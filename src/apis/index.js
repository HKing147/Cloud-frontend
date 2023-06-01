// 导入axios实例
import axios from "axios";
import SparkMD5 from "spark-md5";
import service from "../request/index.js";
import { calMD5 } from "../utils/index.js";

// // 上传小文件
// export function uploadFile(file, url) {
// 	service.post(url, { file: file }, { headers: { "Content-Type": "multipart/form-data" } });
// 	// service.post(url, { file: file }, options)
// 	// 	.then((response) => {
// 	// 		console.log(response);
// 	// 	})
// 	// 	.catch((err) => {
// 	// 		console.log(err);
// 	// 	});
// }

// 上传大文件(分片上传)
// export async function uploadLargeFile(file, url) {
// 	console.log(file);
// 	var batchsize = 20 * 1024 * 1024 * 5;
// 	var totcount = Math.ceil(file.size / batchsize);
// 	var allMD5 = new SparkMD5.ArrayBuffer();
// 	// var allMD5 = new SparkMD5();
// 	let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
// 	for (var idx = 0; idx < totcount; ++idx) {
// 		var fileSlice = blobSlice.call(file, idx * batchsize, (idx + 1) * batchsize);
// 		console.log(fileSlice);
// 		var MD5 = new SparkMD5.ArrayBuffer();
// 		// var MD5 = new SparkMD5();
// 		var str = await fileSlice.text();
// 		allMD5.append(str);
// 		MD5.append(str);
// 		console.log(idx, "===>", MD5.end());
// 		service.post(url, { file: new File([fileSlice], file.name), idx: idx }, { headers: { "Content-Type": "multipart/form-data" } });
// 	}
// 	console.log("fileMD5", allMD5.end());
// 	// service.post(url, { file: file }, options)
// 	// 	.then((response) => {
// 	// 		console.log(response);
// 	// 	})
// 	// 	.catch((err) => {
// 	// 		console.log(err);
// 	// 	});
// }

export async function uploadLargeFile(file, MD5, path, uploadList, idx) {
	console.log("uploadList: ", uploadList);
	console.log(file.name, " ==> ", path);
	// 初始化分片上传事件
	// var res = await service.get("InitiateMultipartUpload", { params: { filename: file.name } }, { headers: { "Content-Type": "application/json, text/plain, */*" } });
	var res = await service.get("/InitiateMultipartUpload", { params: { filename: file.name } });
	console.log(res);
	if (res.meta.code == 1) {
		console.log(res.meta.msg);
		return;
	}
	var UploadID = res.UploadID;
	// console.log("UploadID: ", UploadID);
	// 默认分片大小 10MB
	let chunkSize = 1024 * 1024 * 10; // 10MB

	let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
		// 总分片数
		chunks = Math.ceil(file.size / chunkSize),
		currentChunk = 0,
		allMD5 = new SparkMD5.ArrayBuffer(),
		fileReader = new FileReader(),
		PromiseList = []; // Promise列表

	fileReader.onload = function (e) {
		console.log("read chunk nr", currentChunk + 1, "of", chunks);
		console.log("e:", e);
		allMD5.append(e.target.result); // Append array buffer
		currentChunk++;
		var MD5 = new SparkMD5.ArrayBuffer();
		MD5.append(e.target.result); // Append array buffer
		console.log(chunkSize, "===>", MD5.end());
		// var formdata = new FormData();
		// formdata.append("file", new File([e.target.result], file.name));
		// formdata.append("idx", currentChunk);
		// formdata.append("imur", imur);
		// 异步
		var res = service
			.post("/UploadPart", { file: new File([e.target.result], file.name), idx: currentChunk, UploadID: UploadID }, { headers: { "Content-Type": "multipart/form-data" } })
			.then((res) => {
				console.log("res", res);
				if (res.meta.code == 0) {
					console.log(res.meta.msg);
					uploadList.value[idx].uploadedSize = Math.min(uploadList.value[idx].size, uploadList.value[idx].uploadedSize + chunkSize);
					console.log("uploadList--: ", uploadList);
				}
			});
		PromiseList.push(res);
		/*
		if (res.meta.code == 0) {
			console.log(res.meta.msg);
			uploadList.value[idx].uploadedSize = Math.min(uploadList.value[idx].size, uploadList.value[idx].uploadedSize + chunkSize);
			console.log("uploadList--: ", uploadList);
		}
        */
		// uploadList.value[idx].uploadedSize = Math.min(uploadList.value[idx].size, uploadList.value[idx].uploadedSize + chunkSize);
		// service.post("UploadPart", { idx: currentChunk, imur: imur }, { headers: { "Content-Type": "multipart/form-data" } });
		// service.post("UploadPart", formdata, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
		if (currentChunk < chunks) {
			loadNext();
		} else {
			// resolve(spark.end());
			/*
			var MD5 = allMD5.end();
			console.log("allMD5: ", MD5);
			var res = await service.post("/CompleteMultipartUpload", { UploadID, path, MD5, size: file.size }, { headers: { "Content-Type": "multipart/form-data" } });
			if (res.meta.code == 0) {
				uploadList.value[idx].uploadedSize = uploadList.value[idx].size;
				console.log("CompleteUpload", res.meta.msg);
			}
            */
			// 等所有的分片上传请求都完成了再合并
			Promise.all(PromiseList).then(async () => {
				var MD5 = allMD5.end();
				console.log("allMD5: ", MD5);
				var res = await service.post("/CompleteMultipartUpload", { UploadID, path, MD5, size: file.size }, { headers: { "Content-Type": "multipart/form-data" } });
				if (res.meta.code == 0) {
					uploadList.value[idx].uploadedSize = uploadList.value[idx].size;
					console.log("CompleteUpload", res.meta.msg);
				}
			});
			return;
		}
	};

	// fileReader.onerror = function (error) {
	// 	reject(error);
	// };

	function loadNext() {
		// 切片起始位置
		let start = currentChunk * chunkSize;
		// 切片终止位置
		let end = start + chunkSize;
		if (end >= file.size) {
			end = file.size;
		}

		fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
	}

	loadNext();
	// var MD5 = allMD5.end();
	// console.log("allMD5: ", MD5);
	// var res = await service.post("/CompleteMultipartUpload", { UploadID, path, MD5, size: file.size }, { headers: { "Content-Type": "multipart/form-data" } });
	// if (res.meta.code == 0) {
	// 	uploadList.value[idx].uploadedSize = uploadList.value[idx].size;
	// 	console.log("CompleteUpload", res.meta.msg);
	// }
}

/**
 * 查看文件是否上传过
 */
export async function checkUploaded(fileName, MD5, path) {
	return service.get("/checkUploaded", { params: { MD5, fileName, path } });
}

export default checkUploaded;
