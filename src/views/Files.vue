<template>
	<div class="main">
		<div class="head">
			<span>文件</span>
			<el-icon class="search" :size="20"><Search /></el-icon>
			<div class="addContainer">
				<el-icon class="add" :size="20"><Plus /></el-icon>
			</div>
		</div>
		<div class="content">
			<DraggableTree :data="data" />
		</div>
	</div>
	<el-page-header :icon="ArrowLeft">
		<template #content>
			<el-breadcrumb separator="/">
				<el-breadcrumb-item :to="{ path: './page-header.html' }"> 文件 </el-breadcrumb-item>
				<el-breadcrumb-item><a href="./page-header.html">我的备份</a></el-breadcrumb-item>
				<el-breadcrumb-item>相册</el-breadcrumb-item>
			</el-breadcrumb>
		</template>
	</el-page-header>
</template>

<script setup>
import { reactive } from "vue";
import DraggableTree from "../components/DraggableTree.vue";
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
]);
</script>

<style lang="scss" scoped>
.main {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	.head {
		display: flex;
		// flex-direction: column;
		flex-direction: row;
		margin-top: 35px;
		// align-items: center;
		// justify-content: center;
		// text-align: center;
		// vertical-align: middle;
		// height: 40px;
		width: 100%;
		// line-height: 40px;
		span {
			padding-left: 40px;
			font-size: 18px;
			font-weight: 700;
			width: 100%;
		}
		.el-icon {
			// position: fixed;
		}
		.search {
			right: 100px;
		}
		.addContainer {
			position: fixed;
			right: 30px;
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
		padding-left: 25px;
		width: 100%;
	}
}
</style>
