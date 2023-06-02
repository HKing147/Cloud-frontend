<template>
	<div class="main" id="filePage">
		<div class="head">
			<div class="txt">相册</div>
			<!-- <el-breadcrumb separator-icon="ArrowRight">
				<el-breadcrumb-item v-for="(item, index) in path" :to="{ path: '/home/files' + item.path }" :key="index">{{ item.name }}</el-breadcrumb-item>
			</el-breadcrumb> -->
			<!-- <el-icon class="search" :size="24"><Search /></el-icon> -->
			<!-- <div class="addContainer" style="display: flex; flex-direction: column">
				<el-icon class="add" :size="20" @click="send"><Plus /></el-icon>
			</div> -->
		</div>

		<div class="content">
			<!-- <DraggableTree :data="data" :parentDir="'../files/'" ref="draggableTreeRef" /> -->
			<el-checkbox style="padding-left: 10px" v-model="isCheckAll" @change="checkAll">{{ isCheckAll ? "取消全选" : "全选" }}</el-checkbox>
			<el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
				<div class="row" :gutter="0" v-for="(row, rowIndex) in data" :key="rowIndex">
					<div id="col" class="col" :span="4" v-for="(item, colIndex) in row" :key="colIndex" @click="previewImage(rowIndex * 7 + colIndex)">
						<div
							class="imgContainer"
							:style="{
								'background-image': `url(${item.fileUrl})`,
								'background-size': 'cover',
							}"
						>
							<el-checkbox :label="item.id" size="large" @click.stop><br /></el-checkbox>
						</div>
					</div>
				</div>
			</el-checkbox-group>
		</div>
		<el-affix position="bottom" :offset="60" v-if="checkedList.length > 0">
			<div class="ops">
				<span class="op" @click="downloadFiles(...checkedList)">
					<el-tooltip placement="top" :offset="20">
						<template #content>下载</template>
						<el-icon :size="18" color="#c6c6c7"><Download /></el-icon>
					</el-tooltip>
				</span>
				<span class="op" @click="deleteFiles('/', ...checkedList)">
					<el-tooltip placement="top" :offset="20">
						<template #content>放入回收站</template>
						<el-icon :size="18" color="#c6c6c7"><Delete /></el-icon>
					</el-tooltip>
				</span>
				<span class="op" @click="cancel">
					<el-tooltip placement="top" :offset="20">
						<template #content>取消多选</template>
						<el-icon :size="18" color="#c6c6c7"><CircleCloseFilled /></el-icon>
					</el-tooltip>
				</span>
			</div>
		</el-affix>
	</div>
	<el-image-viewer v-if="visiable" :url-list="imgUrlList" :initial-index="iniIndex" :z-index="100" :teleported="true" @close="close(e)"></el-image-viewer>
</template>

<script setup>
import axios from "axios";
import { useRoute } from "vue-router";
import service from "../request";
import { downloadFiles } from "../utils/index.js";
import router from "../router";
function send() {
	axios.post("http://localhost:8080/api/upload", { name: "test", age: 18 }, { headers: { "Content-Type": "multipart/form-data" } });
}
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
var visiable = ref(false);
const imgList = ref([]);
const imgUrlList = ref([]);
const iniIndex = ref(0);
// var data = reactive([]);
const path = ref([{ name: "文件", path: "" }]);
const route = new useRoute();

async function getAlbum() {
	const res = await service.get("/getAlbum");
	imgList.value = res.imgList;
	console.log("imgList: ", res.imgList);
	data.value = [];
	for (var i = 0; i < res.imgList.length; i += 7) {
		data.value.push(res.imgList.slice(i, Math.min(i + 7, res.imgList.length)));
	}
	// 一维数组变二维, 每行7张图片
	// data.value = res.imgList;
	console.log(data.value);
	// 获取imgUrl列表用于el-image-viewer组件
	imgUrlList.value = [];
	for (var i = 0; i < res.imgList.length; ++i) {
		imgUrlList.value.push(res.imgList[i].fileUrl);
	}
}

getAlbum();

const draggableTreeRef = ref();
function previewImage(idx) {
	iniIndex.value = idx;
	visiable.value = true;
	console.log("image: ", image);
}
function close(e) {
	console.log(e);
	visiable.value = false;
}

const checkedList = ref([]);
const isCheckAll = ref(false);
function handleCheckedChange(e) {
	console.log("check e: ", e);
	console.log(checkedList.value);
	// checkedList 没满就将 isCheckAll 置为 false
	isCheckAll.value = checkedList.value.length == imgList.value.length;
}
function checkAll() {
	console.log("checkAll");
	console.log(isCheckAll.value);
	console.log(checkedList.value);
	console.log(imgList.value);
	if (isCheckAll.value) {
		checkedList.value = [];
		for (var i = 0; i < imgList.value.length; ++i) {
			console.log(imgList.value[i].id);
			checkedList.value.push(imgList.value[i].id);
			// checkedList.value.push(data[i]);
		}
	} else {
		checkedList.value = [];
	}
	console.log(checkedList.value);
}

// 删除
async function deleteFiles(path, ...userFileIDList) {
	console.log("deleteFiles: ", path, userFileIDList);
	const res = await service.post("/deleteFiles", { userFileIDList, path });
	ElMessage({ message: res.meta.msg, type: res.meta.msg });
	if (res.meta.code == 0) {
		router.go(0);
	}
}

// 取消多选
function cancel() {
	console.log(checkedList.value);
	isCheckAll.value = false;
	checkedList.value = [];
}
</script>

<style lang="scss" scoped>
.main {
	// height: 100%;
	// height: 1000px;
	overflow: hidden;
	width: 100%;
	// width: 700px;
	display: flex;
	flex-direction: column;

	.head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 35px;
		width: 100%;
		font-size: 18px;
		font-weight: 1000;
		.txt {
			padding-left: 40px;
		}
		.addContainer {
			margin-right: 50px;
			width: 32px;
			height: 32px;
			border-radius: 50%;
			background: linear-gradient(129.12deg, #446dff 0%, rgba(99, 125, 255, 0.75) 100%);
			display: flex;
			justify-content: center;
			align-items: center;
			.add {
				// margin: auto;
				border-radius: 50%;
				color: white;
			}
		}
	}
	.content {
		padding-top: 30px;
		padding-left: 30px;
		width: 100%;
		.row {
			margin-top: 10px;
			margin-bottom: 10px;
			padding-right: 250px;
			display: flex;
			flex-direction: row;
			.col {
				margin-left: 10px;
				border: solid #f2f2f2 2px;
				border-radius: 3px;
				.imgContainer {
					border-radius: 3px;
					width: 160px;
					height: 160px;
					// border: #313136 1px;

					.el-checkbox {
						// visibility: hidden;
						padding-left: 10px;
						border-radius: 50%;
					}
				}
				.imgContainer:hover {
					cursor: pointer;
					transform: scale(1.1);
					:deep(.el-checkbox__inner) {
						border-radius: 50%;
						// visibility: visible;
					}
				}
			}
			.col:hover {
				cursor: pointer;
				transform: scale(1.1);
			}
		}
	}
}
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
</style>
