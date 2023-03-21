<template>
	<div class="main" id="filePage">
		<div class="head">
			<el-breadcrumb separator-icon="ArrowRight">
				<el-breadcrumb-item v-for="(item, index) in path" :to="{ path: '/home/files' + item.path }" :key="index">{{ item.name }}</el-breadcrumb-item>
				<!-- <el-breadcrumb-item :to="{ path: './' }"> 文件 </el-breadcrumb-item>
				<el-breadcrumb-item><a href="./backup">我的备份</a></el-breadcrumb-item>
				<el-breadcrumb-item>相册</el-breadcrumb-item> -->
			</el-breadcrumb>
			<el-icon class="search" :size="24" @click="searchFileDialogVisible = true"><Search /></el-icon>
			<!-- <div class="addContainer">
				<el-icon class="add" :size="20" @click="send"><Plus /></el-icon>
			</div> -->
			<el-dropdown trigger="click">
				<span class="addContainer">
					<el-icon class="add" :size="20"><Plus /></el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item>
							<el-upload
								style="width: 100%; height: 26px"
								:file-list="fileList"
								:show-file-list="false"
								:auto-upload="false"
								:on-change="uploadOneFile"
								multiple
							>
								<el-icon :size="18"><Document /></el-icon>上传文件
							</el-upload>
						</el-dropdown-item>
						<el-dropdown-item>
							<span @click="clickInput" style="width: 100%; height: 26px; display: flex; flex-direction: row; align-items: center">
								<el-icon :size="18"><Folder /></el-icon>上传文件夹
								<input id="uploadFolder" v-show="false" type="file" @change="uploadFolder" webkitdirectory multiple />
							</span>
						</el-dropdown-item>
						<el-dropdown-item>
							<span @click="createFolderDialogVisible = true" style="width: 100%; height: 26px">
								<el-icon :size="18"><FolderAdd /></el-icon>新建文件夹
							</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>

		<div class="content">
			<DraggableTree :data="data" ref="draggableTreeRef" />
		</div>

		<!-- <div class="affix">
			<el-affix position="bottom" target="#filePage" :offset="60" v-if="draggableTreeRef != null && draggableTreeRef.checkedList != null && draggableTreeRef.checkedList.length > 0">
				<div class="ops">
					<span class="op">
						<el-tooltip placement="top" :offset="20">
							<template #content>下载</template>
							<el-icon :size="18" color="#c6c6c7"><Download /></el-icon>
						</el-tooltip>
					</span>
					<span class="op">
						<el-tooltip placement="top" :offset="20">
							<template #content>分享</template>
							<el-icon :size="18" color="#c6c6c7"><Share /></el-icon>
						</el-tooltip>
					</span>
					<span class="op">
						<el-tooltip placement="top" :offset="20">
							<template #content>收藏</template>
							<el-icon :size="18" color="#c6c6c7"><Star /></el-icon>
						</el-tooltip>
					</span>
					<span class="op" @click="draggableTreeRef.deleteFiles(currentDir + '/', ...draggableTreeRef.checkedList)">
						<el-tooltip placement="top" :offset="20">
							<template #content>放入回收站</template>
							<el-icon :size="18" color="#c6c6c7"><Delete /></el-icon>
						</el-tooltip>
					</span>
					<span class="op">
						<el-tooltip placement="top" :offset="20">
							<template #content>更多</template>
							<el-icon :size="18" color="#c6c6c7"><MoreFilled /></el-icon>
						</el-tooltip>
					</span>
					<span class="op" @click="draggableTreeRef.cancel">
						<el-tooltip placement="top" :offset="20">
							<template #content>取消多选</template>
							<el-icon :size="18" color="#c6c6c7"><CircleCloseFilled /></el-icon>
						</el-tooltip>
					</span>
				</div>
			</el-affix>
		</div> -->

		<el-affix position="bottom" target="#filePage" :offset="100" v-if="draggableTreeRef != null && draggableTreeRef.checkedList != null && draggableTreeRef.checkedList.length > 0">
			<div class="ops">
				<span class="op">
					<el-tooltip placement="top" :offset="20">
						<template #content>下载</template>
						<el-icon :size="18" color="#c6c6c7"><Download /></el-icon>
					</el-tooltip>
				</span>
				<span class="op">
					<el-tooltip placement="top" :offset="20">
						<template #content>分享</template>
						<el-icon :size="18" color="#c6c6c7"><Share /></el-icon>
					</el-tooltip>
				</span>
				<span class="op">
					<el-tooltip placement="top" :offset="20">
						<template #content>收藏</template>
						<el-icon :size="18" color="#c6c6c7"><Star /></el-icon>
					</el-tooltip>
				</span>
				<span class="op" @click="draggableTreeRef.deleteFiles(currentDir + '/', ...draggableTreeRef.checkedList)">
					<el-tooltip placement="top" :offset="20">
						<template #content>放入回收站</template>
						<el-icon :size="18" color="#c6c6c7"><Delete /></el-icon>
					</el-tooltip>
				</span>
				<span class="op">
					<el-tooltip placement="top" :offset="20">
						<template #content>更多</template>
						<el-icon :size="18" color="#c6c6c7"><MoreFilled /></el-icon>
					</el-tooltip>
				</span>
				<span class="op" @click="draggableTreeRef.cancel">
					<el-tooltip placement="top" :offset="20">
						<template #content>取消多选</template>
						<el-icon :size="18" color="#c6c6c7"><CircleCloseFilled /></el-icon>
					</el-tooltip>
				</span>
			</div>
		</el-affix>

		<!-- 创建文件夹对话框 -->
		<el-dialog v-model="createFolderDialogVisible" title="新建文件夹" width="25%" style="border-radius: 10px" draggable>
			<img style="width: 120px; display: block; margin: 0 auto" src="/public/assets/img/maxfolder.png" />
			<template #footer>
				<span>
					<el-input size="large" style="margin-bottom: 20px" v-model="folderName" placeholder="请输入文件夹名" />
					<el-button color="#637dff" style="color: white" type="primary" @click="createFolder"> 确定 </el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 搜索文件对话框 -->
		<el-dialog class="searchFile" v-model="searchFileDialogVisible" width="40%" style="border-radius: 10px" :show-close="false" draggable>
			<template #header>
				<div style="height: 20px">
					<el-input @input="searchFile" size="large" style="border: 0px" v-model="fileName" placeholder="搜索文件" clearable />
				</div>
			</template>
			<el-scrollbar max-height="450px">
				<div v-for="item in searchFileList" :key="item">
					<img :src="'/public/assets/icon/' + item.type + '.png'" onerror="this.src='/public/assets/icon/other.png'" />
					{{ item.fileName }}
				</div>
			</el-scrollbar>
		</el-dialog>
	</div>

	<drag-upload :onDrop="drop"></drag-upload>
</template>

<script setup>
import axios from "axios";
import { set } from "lodash";
import { onBeforeMount, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import checkUploaded from "../apis";
import DraggableTree from "../components/DraggableTree.vue";
import service from "../request";
import { upload, uploadFile, scan } from "../utils/index.js";
function send() {
	axios.post("http://localhost:8080/api/upload", { name: "test", age: 18 }, { headers: { "Content-Type": "multipart/form-data" } });
}
const currentDir = ref("/"); // 当前文件夹（默认为'/'）
// const data = reactive([
// 	{
// 		id: 1,
// 		filename: "文件夹一",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		children: [
// 			{
// 				filename: "Level two 1-1",
// 				time: "2021/09/26 21:17",
// 				size: 100,
// 				isLeaf: true,
// 				children: [],
// 			},
// 		],
// 	},
// 	{
// 		id: 2,
// 		filename: "文件夹二",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		children: [
// 			{
// 				filename: "Level two 1-1",
// 				time: "2021/09/26 21:17",
// 				size: 100,
// 				isLeaf: true,
// 				children: [],
// 			},
// 		],
// 	},
// 	{
// 		id: 3,
// 		filename: "文件夹三",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		children: [
// 			{
// 				filename: "Level two 1-1",
// 				time: "2021/09/26 21:17",
// 				size: 100,
// 				isLeaf: true,
// 				children: [],
// 			},
// 		],
// 	},
// 	{
// 		id: 4,
// 		filename: "文件夹四",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		children: [
// 			{
// 				isLeaf: true,
// 				filename: "Level two 1-1",
// 				time: "2021/09/26 21:17",
// 				size: 100,
// 				children: [],
// 			},
// 		],
// 	},
// 	{
// 		id: 5,
// 		filename: "文件",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		// children: [],
// 	},
// 	{
// 		id: 5,
// 		filename: "文件",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		// children: [],
// 	},
// 	{
// 		id: 5,
// 		filename: "文件",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		// children: [],
// 	},
// 	{
// 		id: 5,
// 		filename: "文件",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		// children: [],
// 	},
// 	{
// 		id: 5,
// 		filename: "文件",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		// children: [],
// 	},
// 	{
// 		id: 5,
// 		filename: "文件",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		// children: [],
// 	},
// 	{
// 		id: 5,
// 		filename: "文件",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		// children: [],
// 	},
// 	{
// 		id: 5,
// 		filename: "文件",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		// children: [],
// 	},
// 	{
// 		id: 5,
// 		filename: "文件",
// 		time: "2021/09/26 21:17",
// 		size: 1024,
// 		isLeaf: true,
// 		// children: [],
// 	},
// ]);

// 当前请求的文件夹路径：/前端/Vue/
var data = ref([]);
// var data = reactive([]);
const path = ref([{ name: "文件", path: "" }]);
const route = new useRoute();

// 用currentDir更新path
function updatePath(list) {
	var fa = "";
	console.log("path ->", path.value, currentDir);
	path.value = [{ name: "文件", path: "" }];
	if (list == null) return;
	for (var i = 0; i < list.length; ++i) {
		fa += "/" + list[i];
		path.value.push({ name: list[i], path: fa });
		console.log("path ->", path.value);
	}
	currentDir.value = path.value[path.value.length - 1].path;
	console.log("path:", path.value);
	console.log("currentDir:", currentDir.value);
}

async function getFileList(currentDir) {
	const res = await service.get("/getFileList", { params: { path: currentDir.value + "/" } });
	console.log("fileList: ", res.fileList);
	return res.fileList;
}

// watch(
// 	() => route.params.currentDir,
// 	async (newval, oldval) => {
// 		console.log("old:", oldval, "new:", newval);
// 		updatePath(newval);
// 		// await getFileList(currentDir);
// 		data.value = [{ id: 1, fileName: "1.txt" }];
// 	}
// );

watchEffect(async () => {
	var list = route.params.currentDir;
	path.value = [{ name: "文件", path: "/" }];
	updatePath(list);
	currentDir.value = path.value[path.value.length - 1].path;
	data.value = await getFileList(currentDir);
	// getFileList(currentDir);
	// var res = await service.get("/getFileList", { params: { path: currentDir.value } });
	// console.log("fileList: ", res.fileList);
	// data.value = reactive(res.fileList);
	// console.log("data: ", data.value);
});

// 拖拽上传文件方法（传给drag-upload组件的onDrop方法）
function drop(e) {
	console.log(e);
	e.preventDefault();
	console.log("currentDir:", currentDir);
	upload(e, currentDir.value + "/");
}
const fileList = ref([]);
function uploadOneFile(file) {
	// 每次上传一个
	console.log("file:", file, "path: ", currentDir.value + "/");
	// uploadFile(file.raw, currentDir.value + "/");
}

function clickInput() {
	document.querySelector("#uploadFolder").click();
}

async function uploadFolder(e) {
	console.log(e);
	var fileList = e.target.files;
	console.log(fileList);
	const st = new Set(); // 存储已经创建的文件夹，防止重复创建
	for (var i = 0; i < fileList.length; ++i) {
		// console.log(fileList[i].webkitRelativePath);
		var filePath = fileList[i].webkitRelativePath;
		var list = filePath.split("/");
		// 先创建该文件的所有祖先文件夹
		var path = currentDir.value + "/";
		for (var j = 0; j < list.length - 1; ++j) {
			if (!st.has(path + list[j] + "/")) {
				// 没有就创建
				const res = await service.post("/createFolder", { folderName: list[j], path: path });
				console.log(res);
				console.log("create: ", path + list[j] + "/");
			}
			path += list[j] + "/";
			st.add(path);
		}
		console.log(path, " ==> ", list[list.length - 1]);
		// 最后再上传该文件
		const res = await uploadFile(fileList[i], path);
		console.log(res);
	}
}

const createFolderDialogVisible = ref(false);
const folderName = ref("新建文件夹");
async function createFolder() {
	if (folderName.length == 0) {
		return;
	}
	const res = await service.post("/createFolder", { folderName: folderName.value, path: currentDir.value + "/" });
	if (res.meta.code == 0) {
		createFolderDialogVisible.value = false;
	}
}

const searchFileDialogVisible = ref(false);
const fileName = ref("");
const searchFileList = ref([]);
async function searchFile() {
	if (fileName.value == "") return;
	console.log("搜索文件: ", fileName.value);
	const res = await service.get("/searchFile", { params: { fileName: fileName.value } });
	console.log(res);
	if (res.meta.code == 0) {
		searchFileList.value = res.fileList;
	}
}
// async function uploadFile(file) {
// 	console.log("upload: ", file.name, file.raw);
// 	const f = file.raw;
// 	const path = currentDir.value + "/";
// 	// scan(file.raw, currentDir.value);
// 	// file.raw.File(async (f) => {
// 	console.log("文件：", f.name, f.size, file.fullPath, file);
// 	// TODO: 上传文件  f 就是file类型
// 	// uploadFile(f, "/upload");
// 	// 先检查文件是否已经上传过
// 	console.log("文件f：", f);
// 	const res = await checkUploaded(f, path);
// 	console.log("res+++", res);
// 	if (res.meta.code == 0) {
// 		// 上传过
// 	} else {
// 		// 没上传过
// 		uploadLargeFile(f, path);
// 	}
// 	// });
// }

onMounted(() => {
	// document.addEventListener("dragleave", preventDe);
	// document.addEventListener("dragover", preventDe);
	// document.addEventListener("dragenter", preventDe);
	// document.addEventListener("drop", drop);
	// window.addEventListener("dragover", preventDe);
	// window.addEventListener("dragenter", preventDe);
	// window.addEventListener("drop", drop);
	// document.querySelector("#filePage").addEventListener("dragover", preventDe);
	// document.querySelector("#filePage").addEventListener("dragenter", preventDe);
	// disableDefaultEvents();
	// document.querySelector("#filePage").addEventListener("drop", drop);
});

const draggableTreeRef = ref();
</script>

<style lang="scss" scoped>
.main {
	height: 100%;
	// height: 1000px;
	overflow: hidden;
	width: 100%;
	// width: 700px;
	display: flex;
	flex-direction: column;

	.head {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 35px;
		width: 100%;
		.el-breadcrumb {
			padding-left: 40px;
			font-size: 18px;
			font-weight: 700;
			width: 100%;
		}
		.el-icon {
			// position: fixed;
		}
		.search {
			right: 60px;
		}
		.addContainer {
			position: relative;
			right: 30px;
			// margin-right: 50px;
			width: 32px;
			height: 32px;
			border-radius: 50%;
			background: linear-gradient(129.12deg, #446dff 0%, rgba(99, 125, 255, 0.75) 100%);
			display: flex;
			justify-content: center;
			align-items: center;
			outline: none; // 点击时去黑边
			.add {
				// margin: auto;
				border-radius: 50%;
				color: white;
			}
			&:hover {
				background: #4465ec;
				cursor: pointer;
			}
		}
	}
	.content {
		padding-top: 30px;
		padding-left: 20px;
		width: 98%;
		overflow: auto;
	}
}
.searchFile {
	.el-scrollbar {
		padding-right: 20px;
		div {
			display: flex;
			align-items: center;
			padding-left: 10px;
			font-size: 14px;
			img {
				width: 32px;
				height: 32px;
				margin-right: 10px;
				margin-top: 5px;
				margin-bottom: 5px;
			}
			&:hover {
				cursor: pointer;
				background: #f5f5f6;
				border-radius: 3px;
			}
		}
	}
}
// .affix {
// 	text-align: center;
// 	.el-affix {
// 		// width: 200px;
// 		margin: 0 auto;
// 		// width: 0px;
// 		// overflow: hidden;
// 		white-space: nowrap;
// 		display: inline-block;
// 		// text-align: center;
// 		// position: absolute;
// 		// padding: 20px;
// 		.ops {
// 			background: #313136;
// 			padding: 15px;
// 			// width: 100%;
// 			border-radius: 15px;
// 			.op {
// 				padding: 5px;
// 				padding-bottom: 0px;
// 				margin: 5px;
// 				// .el-icon {
// 				// 	margin-left: 7px;
// 				// 	margin-right: 7px;
// 				// }
// 				&:hover {
// 					cursor: pointer;
// 					background: #555559;
// 					border-radius: 5px;
// 				}
// 			}
// 		}
// 	}
// }

.el-affix {
	// width: 200px;
	margin: 0 auto;
	// width: 0px;
	// overflow: hidden;
	white-space: nowrap;
	display: inline-block;
	// text-align: center;
	// position: absolute;
	// padding: 20px;
	.ops {
		background: #313136;
		padding: 15px;
		// width: 100%;
		border-radius: 15px;
		.op {
			padding: 5px;
			padding-bottom: 0px;
			margin: 5px;
			// .el-icon {
			// 	margin-left: 7px;
			// 	margin-right: 7px;
			// }
			&:hover {
				cursor: pointer;
				background: #555559;
				border-radius: 5px;
			}
		}
	}
}
:deep(.el-upload-dragger) {
	border: 0;
	cursor: default;
}
// :deep(.el-dialog__body) {
// 	text-align: center;
// }
</style>
