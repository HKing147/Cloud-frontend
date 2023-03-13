// 导入axios实例
import axios from "axios";
import SparkMD5 from "spark-md5";
import service from "../request/index.js";

// 上传小文件
export function uploadFile(file, url) {
	service.post(url, { file: file }, { headers: { "Content-Type": "multipart/form-data" } });
	// service.post(url, { file: file }, options)
	// 	.then((response) => {
	// 		console.log(response);
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
}

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

export function uploadLargeFile(file, url, chunkSize) {
	// 默认分片大小 2MB
	let defaultChunkSize = 1024 * 1024 * 100;

	chunkSize = chunkSize || defaultChunkSize;

	let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
		// 总分片数
		chunks = Math.ceil(file.size / chunkSize),
		currentChunk = 0,
		allMD5 = new SparkMD5.ArrayBuffer(),
		fileReader = new FileReader();

	fileReader.onload = function (e) {
		console.log("read chunk nr", currentChunk + 1, "of", chunks);
		console.log("e:", e);
		allMD5.append(e.target.result); // Append array buffer
		currentChunk++;
		var MD5 = new SparkMD5.ArrayBuffer();
		MD5.append(e.target.result); // Append array buffer
		console.log(chunkSize, "===>", MD5.end());

		service.post(url, { file: new File([e.target.result], file.name), idx: currentChunk }, { headers: { "Content-Type": "multipart/form-data" } });
		if (currentChunk < chunks) {
			loadNext();
		} else {
			// resolve(spark.end());
			console.log("allMD5: ", allMD5.end());
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
}
