import axios from "axios";
import SparkMD5 from "spark-md5";
import { checkUploaded, uploadLargeFile } from "../apis";
import service from "../request";

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
	const res = await checkUploaded(file, path);
	console.log("res+++", res);
	if (res.meta.code == 0) {
		// 上传过
		uploadList.value[idx].uploadedSize = uploadList.value[idx].size;
	} else {
		// 没上传过
		uploadLargeFile(file, path, uploadList, idx);
	}
}

export async function scan(file, path, uploadList, idx) {
	// file可能是文件夹
	if (file.isFile) {
		// 文件
		file.file(async (f) => {
			// uploadFile(f, path);
			console.log("文件：", f.name, f.size, file.fullPath, file);
			// TODO: 上传文件  f 就是file类型
			// uploadFile(f, "/upload");
			// 先检查文件是否已经上传过
			console.log("文件f：", f);
			const res = await checkUploaded(f, path);
			console.log("res+++", res);
			if (res.meta.code == 0) {
				// 上传过
				uploadList.value[idx].uploadedSize = uploadList.value[idx].size;
			} else {
				// 没上传过
				uploadLargeFile(f, path, uploadList, idx);
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
	console.log("file ==> ", file);
	return new Promise((resolve, reject) => {
		const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
		const chunkSize = 1024 * 1024 * 10; // Read in chunks of 2MB
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
	} else {
		return (size / base / base / base).toFixed(2) + "GB";
	}
}
