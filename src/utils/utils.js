import axios from "axios";
import { uploadFile, uploadLargeFile } from "../apis";
const upload = (e) => {
	let files = e.dataTransfer.items;
	for (var i = 0; i < files.length; ++i) {
		scan(files[i].webkitGetAsEntry());
	}
};
const scan = (file) => {
	if (file.isFile) {
		// 文件
		file.file((f) => {
			console.log("文件：", f.name, f.size, file.fullPath, file);
			// TODO: 上传文件  f 就是file类型
			// uploadFile(f, "/upload");
			uploadLargeFile(f);
		});
	} else {
		// 文件夹
		console.log("文件夹：", file.name);
		// TODO: 创建文件夹
		file.createReader().readEntries(
			(entries) => {
				for (var i = 0; i < entries.length; ++i) {
					scan(entries[i]);
				}
			},
			(e) => reject(e)
		);
	}
};

export default upload;
