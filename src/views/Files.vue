<template>
	<div class="main" id="filePage">
		<div class="head">
			<el-breadcrumb separator-icon="ArrowRight">
				<el-breadcrumb-item :to="{ path: './' }"> 文件 </el-breadcrumb-item>
				<el-breadcrumb-item><a href="./backup">我的备份</a></el-breadcrumb-item>
				<el-breadcrumb-item>相册</el-breadcrumb-item>
			</el-breadcrumb>
			<el-icon class="search" :size="24"><Search /></el-icon>
			<div class="addContainer">
				<el-icon class="add" :size="20" @click="send"><Plus /></el-icon>
			</div>
		</div>

		<div class="content">
			<DraggableTree :data="data" ref="draggableTreeRef" />
		</div>
	</div>
	<el-affix position="bottom" :offset="60" v-if="draggableTreeRef != null && draggableTreeRef.checkedList != null && draggableTreeRef.checkedList.length > 0">
		<div class="ops">
			<el-icon :size="18" color="#c6c6c7"><Download /></el-icon>
			<el-icon :size="18" color="#c6c6c7"><Share /></el-icon>
			<el-icon :size="18" color="#c6c6c7"><Star /></el-icon>
			<el-icon :size="18" color="#c6c6c7"><Delete /></el-icon>
			<el-icon :size="18" color="#c6c6c7"><MoreFilled /></el-icon>
			<el-icon :size="18" color="#c6c6c7"><CircleCloseFilled /></el-icon>
		</div>
	</el-affix>
	<drag-upload :onDrop="drop"></drag-upload>
</template>

<script setup>
import axios from "axios";
import { onMounted, reactive, watch } from "vue";
import DraggableTree from "../components/DraggableTree.vue";
import upload from "../utils/utils";
function send() {
	axios.post("http://localhost:8080/api/upload", { name: "test", age: 18 }, { headers: { "Content-Type": "multipart/form-data" } });
}

const data = reactive([
	{
		id: 1,
		filename: "文件夹一",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		children: [
			{
				filename: "Level two 1-1",
				time: "2021/09/26 21:17",
				size: 100,
				isLeaf: true,
				children: [],
			},
		],
	},
	{
		id: 2,
		filename: "文件夹二",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		children: [
			{
				filename: "Level two 1-1",
				time: "2021/09/26 21:17",
				size: 100,
				isLeaf: true,
				children: [],
			},
		],
	},
	{
		id: 3,
		filename: "文件夹三",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		children: [
			{
				filename: "Level two 1-1",
				time: "2021/09/26 21:17",
				size: 100,
				isLeaf: true,
				children: [],
			},
		],
	},
	{
		id: 4,
		filename: "文件夹四",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		children: [
			{
				isLeaf: true,
				filename: "Level two 1-1",
				time: "2021/09/26 21:17",
				size: 100,
				children: [],
			},
		],
	},
	{
		id: 5,
		filename: "文件",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		// children: [],
	},
	{
		id: 5,
		filename: "文件",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		// children: [],
	},
	{
		id: 5,
		filename: "文件",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		// children: [],
	},
	{
		id: 5,
		filename: "文件",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		// children: [],
	},
	{
		id: 5,
		filename: "文件",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		// children: [],
	},
	{
		id: 5,
		filename: "文件",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		// children: [],
	},
	{
		id: 5,
		filename: "文件",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		// children: [],
	},
	{
		id: 5,
		filename: "文件",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		// children: [],
	},
	{
		id: 5,
		filename: "文件",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		// children: [],
	},
]);

// 当前请求的文件夹路径：/前端/Vue/
const path = ref([{}, {}]);

// 拖拽上传文件方法（传给drag-upload组件的onDrop方法）
function drop(e) {
	console.log(e);
	e.preventDefault();
	upload(e);
}

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
			.add {
				// margin: auto;
				border-radius: 50%;
				color: white;
			}
		}
	}
	.content {
		padding-top: 30px;
		padding-left: 20px;
		width: 100%;
	}
}
.el-affix {
	width: 200px;
	margin: 0 auto;
	.ops {
		background: #313136;
		padding: 15px;
		width: 100%;
		border-radius: 15px;
		.el-icon {
			margin-left: 7px;
			margin-right: 7px;
		}
	}
}
:deep(.el-upload-dragger) {
	border: 0;
	cursor: default;
}
</style>
