import OSS from "ali-oss";
import axios from "axios";
import SparkMD5 from "spark-md5";
import { checkUploaded, uploadLargeFile } from "../apis";
import service from "../request";
import streamSaver from "./StreamSaver";

const client = new OSS({
	region: "oss-cn-hangzhou", // 根据那你的Bucket地点来填写
	accessKeyId: "LTAI5tRnVo7L548yNZ2bRJxv", // 自己账户的accessKeyId或临时秘钥
	accessKeySecret: "X848KXtK7imYFSAjcCQUK0W6TH4cTR", // 自己账户的accessKeySecret或临时秘钥
	// stsToken: "securityToken", //  从STS服务获取的安全令牌（SecurityToken）。
	bucket: "file-bucket001", // bucket名字
});

export async function calFileSize(file, uploadList, idx) {
	if (file.isDirectory) {
		console.log("Dire: ", file);
		await file.createReader().readEntries(
			async (entries) => {
				for await (let entry of entries) {
					calFileSize(entry, uploadList, idx);
				}
			},
			(e) => reject(e)
		);
	} else {
		await file.file((f) => {
			uploadList.value[idx].size += f.size;
		});
	}
}

export function upload(e, path, uploadList) {
	let files = e.dataTransfer.items;
	console.log("files:", files);
	for (var i = 0; i < files.length; ++i) {
		var type = "folder";
		if (files[i].webkitGetAsEntry().isFile) {
			type = files[i].webkitGetAsEntry().name.split(".").at(-1);
		}
		uploadList.value.push({ fileName: files[i].webkitGetAsEntry().name, type: type, size: 0, uploadedSize: 0 });
		var idx = uploadList.value.length - 1;
		calFileSize(files[i].webkitGetAsEntry(), uploadList, idx);
		scan(files[i].webkitGetAsEntry(), path, uploadList, idx); // 不要加await,加了只会遍历到第一个元素
	}
}

export async function uploadFile(file, path, uploadList, idx) {
	// file是file类型, path: 为文件夹路径，末尾带'/'
	console.log("文件：", file);
	// 先检查文件是否已经上传过
	const MD5 = await calMD5(file);
	const res = await checkUploaded(file.name, MD5, path);
	// uploadList.value[idx].size = file.size;
	console.log("res+++", res);
	if (res.meta.code == 0) {
		// 上传过
		uploadList.value[idx].uploadedSize = uploadList.value[idx].size;
	} else {
		// 没上传过
		uploadToOSS(file, MD5, path, uploadList, idx);
		// uploadLargeFile(file, MD5, path, uploadList, idx);
	}
}

export async function scan(file, path, uploadList, idx) {
	// file可能是文件夹
	if (file.isFile) {
		// 是文件
		file.file(async (f) => {
			console.log("文件：", f.name, f.size, file.fullPath, file);
			// 先检查文件是否已经上传过
			console.log("文件f：", f);
			const MD5 = await calMD5(f);
			const res = await checkUploaded(f.name, MD5, path);
			if (res.meta.code == 0) {
				// 上传过, 不用再次上传
				uploadList.value[idx].uploadedSize = Math.min(uploadList.value[idx].size, uploadList.value[idx].uploadedSize + f.size);
				// uploadList.value[idx].uploadedSize = uploadList.value[idx].size;
			} else {
				// 没上传过
				uploadToOSS(f, MD5, path, uploadList, idx);
				// uploadLargeFile(f, MD5, path, uploadList, idx);
			}
		});
	} else {
		// 文件夹
		console.log("文件夹：", file.name);
		// TODO: 创建文件夹
		const res = await service.post("/createFolder", { folderName: file.name, path: path });
		console.log("创建文件夹：", res);
		file.createReader().readEntries(
			(entries) => {
				for (var i = 0; i < entries.length; ++i) {
					scan(entries[i], path + res.file.fileName + "/", uploadList, idx);
				}
			},
			(e) => reject(e)
		);
	}
}

/**
 * 使用 spark-md5 生成文件MD5摘要
 * @resolve {string} md5
 */
export function calMD5(file) {
	console.log("calMD5 file ==> ", file);
	return new Promise((resolve, reject) => {
		const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
		const chunkSize = 1024 * 1024 * 100; // Read in chunks of 100MB
		const chunks = Math.ceil(file.size / chunkSize);
		const spark = new SparkMD5.ArrayBuffer();
		const fileReader = new FileReader();
		let currentChunk = 0;
		fileReader.onload = function (e) {
			spark.append(e.target.result); // Append array buffer
			currentChunk++;
			if (currentChunk < chunks) {
				loadNext();
			} else {
				const MD5 = spark.end();
				console.log("MD5:", MD5);
				resolve(MD5);
			}
		};
		fileReader.onerror = function (e) {
			reject(e);
		};
		function loadNext() {
			const start = currentChunk * chunkSize;
			const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
			fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
		}
		loadNext();
	});
}

/**
 * 解析文件size => str
 */
export function parseSize(size) {
	const base = 1024;
	if (size / base < base) {
		// 小于1MB
		return (size / base).toFixed(2) + "KB";
	} else if (size / base / base < base) {
		// 小于1GB
		return (size / base / base).toFixed(2) + "MB";
	} else if (size / base / base / base < base) {
		// 小于1TB
		return (size / base / base / base).toFixed(2) + "GB";
	} else {
		return (size / base / base / base / base).toFixed(2) + "TB";
	}
}

/**
 * 直接上传至OSS
 */
export async function uploadToOSS(file, MD5, path, uploadList, idx) {
	console.log("uploadToOSS file:", file);

	var list = file.name.split(".");
	var type = list[list.length - 1];
	var uploadSize = 0;
	console.log(file.name, type);
	try {
		var last = file.size;
		const result = await client.multipartUpload(
			`${type + "/" + MD5 + "." + type}`, //如果需要传入到指定的文件夹下，需要在文件名前加上文件夹名称，如： `xxxxx/${file.name}`
			file,
			{
				progress: (p, cpt, res) => {
					// 获取分片上传进度、断点和返回值。
					console.log(p, cpt, res);
					if (cpt != null) {
						uploadList.value[idx].uploadedSize = Math.min(uploadList.value[idx].size, uploadList.value[idx].uploadedSize + Math.min(last, cpt.partSize));
						last -= Math.min(last, cpt.partSize);
						// // uploadSize = Math.min(cpt.fileSize);
						// // var delta = Math.max(0, Math.min(cpt.fileSize, cpt.partSize * cpt.doneParts.length) - cpt.partSize * (cpt.doneParts.length - 1));
						// // console.log(cpt.partSize, cpt.doneParts.length, delta);
						// // origin += delta;
						// uploadList.value[idx].uploadedSize = Math.min(uploadList.value[idx].size, uploadList.value[idx].uploadedSize + delta);
					}
					// uploadList.value[idx].uploadedSize = Math.min(uploadList.value[idx].size, Math.min(cpt.fileSize, cpt.partSize * cpt.doneParts.length));
					// uploadList.value[idx].uploadedSize = Math.min(uploadList.value[idx].size, uploadList.value[idx].uploadedSize + cpt.partSize * cpt.doneParts.length);
					// uploadList.value[idx].uploadedSize = Math.min(uploadList.value[idx].size, uploadList.value[idx].uploadedSize + cpt.partSize);
				},
				parallel: 6, //并发上传的分片数量
				partSize: 1024 * 1024 * 10, //分片大小
				headers: {
					//上传请求头设置
					"Content-Disposition": "inline",
					"Content-Type": file.type,
				},
				// meta: { year: 2023, people: "test" }, // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
				mime: file.type, //上传文件类型
			}
		);
		console.log(result, "result= 切片上传完毕=");
		const res = service.post("/completeUploadFile", { fileName: file.name, size: file.size, type, path, MD5 });
		uploadList.value[idx].uploadedSize = Math.min(uploadList.value[idx].size, uploadList.value[idx].uploadedSize + last);
	} catch (e) {
		console.log("异常--->", e);
		if (e.code === "ConnectionTimeoutError") {
			// 请求超时异常处理
			console.log("TimeoutError");
		}
	}
}

/**
 * 下载文件
 */
export function downloadFile(file) {
	console.log("fileUrl: ", file.fileUrl);
	console.log("===========");
	var url = file.fileUrl,
		fileName = file.fileName;
	fetch(url, {
		method: "GET",
		cache: "no-cache",
	}).then((res) => {
		const fileStream = streamSaver.createWriteStream(fileName, {
			size: res.headers.get("content-length"),
		});
		const readableStream = res.body;
		// more optimized
		if (window.WritableStream && readableStream.pipeTo) {
			return readableStream.pipeTo(fileStream).then(() => console.log("done writing"));
		}
		window.writer = fileStream.getWriter();
		const reader = res.body.getReader();
		const pump = () => reader.read().then((res) => (res.done ? window.writer.close() : window.writer.write(res.value).then(pump)));
		pump();
	});
	// 文件下载次数加1
	service.post("/downloadFile", { id: file.id });
}
// 下载多个文件
export async function downloadFiles(...userFileIDList) {
	console.log("userFileIDList:", userFileIDList);
	const res = await service.get("/getFiles", { params: { userFileIDList } });
	var fileList = res.fileList,
		len = fileList.length;
	for (var i = 0; i < len; i++) {
		if (fileList[i].fileUrl != "") downloadFile(fileList[i]);
	}
}
