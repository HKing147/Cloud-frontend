<template>
	<div class="main" id="filePage">
		<div class="head">
			<div class="txt">收藏夹</div>
			<!-- <el-breadcrumb separator-icon="ArrowRight">
				<el-breadcrumb-item v-for="(item, index) in path" :to="{ path: '/home/files' + item.path }" :key="index">{{ item.name }}</el-breadcrumb-item>
			</el-breadcrumb> -->
			<el-icon class="search" :size="24"><Search /></el-icon>
			<!-- <div class="addContainer">
				<el-icon class="add" :size="20" @click="send"><Plus /></el-icon>
			</div> -->
		</div>

		<div class="content">
			<DraggableTree :data="data" :parentDir="'../files/'" ref="draggableTreeRef" />
		</div>
	</div>
	<!-- <el-affix position="bottom" :offset="60" v-if="draggableTreeRef != null && draggableTreeRef.checkedList != null && draggableTreeRef.checkedList.length > 0">
		<div class="ops">
			<el-icon :size="18" color="#c6c6c7"><Download /></el-icon>
			<el-icon :size="18" color="#c6c6c7"><Share /></el-icon>
			<el-icon :size="18" color="#f35b51"><Star /></el-icon>
			<el-icon :size="18" color="#c6c6c7"><Delete /></el-icon>
			<el-icon :size="18" color="#c6c6c7"><MoreFilled /></el-icon>
			<el-icon :size="18" color="#c6c6c7"><CircleCloseFilled /></el-icon>
		</div>
	</el-affix> -->

	<div class="affix">
		<el-affix position="bottom" :offset="60" v-if="draggableTreeRef != null && draggableTreeRef.checkedList != null && draggableTreeRef.checkedList.length > 0">
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
						<template #content>取消收藏</template>
						<el-icon :size="18" color="#f35b51"><Star /></el-icon>
					</el-tooltip>
				</span>
				<span class="op">
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
				<span class="op">
					<el-tooltip placement="top" :offset="20">
						<template #content>取消多选</template>
						<el-icon :size="18" color="#c6c6c7"><CircleCloseFilled /></el-icon>
					</el-tooltip>
				</span>
			</div>
		</el-affix>
	</div>

	<!-- <drag-upload :onDrop="drop"></drag-upload> -->
</template>

<script setup>
import axios from "axios";
import { onBeforeMount, onMounted, reactive, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import DraggableTree from "../components/DraggableTree.vue";
import service from "../request";
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
// var data = reactive([]);
const path = ref([{ name: "文件", path: "" }]);
const route = new useRoute();

async function getCollectedList() {
	const res = await service.get("/getCollectedList");
	console.log("collectedList: ", res.collectedList);
	data.value = res.collectedList;
}

getCollectedList();

// watchEffect(async () => {
// 	var list = route.params.currentDir;
// 	path.value = [{ name: "文件", path: "/" }];
// 	updatePath(list);
// 	currentDir.value = path.value[path.value.length - 1].path;
// 	data.value = await getFileList(currentDir);
// 	// getFileList(currentDir);
// 	// var res = await service.get("/getFileList", { params: { path: currentDir.value } });
// 	// console.log("fileList: ", res.fileList);
// 	// data.value = reactive(res.fileList);
// 	// console.log("data: ", data.value);
// });

// // 拖拽上传文件方法（传给drag-upload组件的onDrop方法）
// function drop(e) {
// 	console.log(e);
// 	e.preventDefault();
// 	console.log("currentDir:", currentDir);
// 	upload(e, currentDir.value + "/");
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
		// align-items: center;
		justify-content: space-between;
		// justify-content: space-around;
		margin-top: 35px;
		// margin-left: 40px;
		width: 100%;
		font-size: 18px;
		font-weight: 1000;
		.txt {
			margin-left: 40px;
		}
		.el-icon {
			margin-right: 40px;
		}
	}
	.content {
		padding-top: 30px;
		padding-left: 20px;
		width: 100%;
	}
}
.affix {
	text-align: center;
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
}
:deep(.el-upload-dragger) {
	border: 0;
	cursor: default;
}
</style>
