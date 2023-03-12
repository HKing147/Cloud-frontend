// 导入axios实例
import axios from "axios";
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
export function uploadLargeFile(file, url) {
	service.post(url, { file: file }, { headers: { "Content-Type": "multipart/form-data" } });

	// service.post(url, { file: file }, options)
	// 	.then((response) => {
	// 		console.log(response);
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
}
