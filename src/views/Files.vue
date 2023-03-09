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
			<CommonTable :tableData="tableData"></CommonTable>
		</div>
	</div>
</template>

<script setup>
import { reactive } from "vue";
import CommonTable from "../components/CommonTable.vue";
const tableData = reactive([
	{
		filename: "1.jpg",
		size: 1024,
		path: "/1.jpg",
	},
	{
		filename: "1.jpg",
		size: 1024,
		path: "/1.jpg",
	},
	{
		filename: "1.jpg",
		size: 1024,
		path: "/1.jpg",
	},
	{
		filename: "1.jpg",
		size: 1024,
		path: "/1.jpg",
	},
	{
		filename: "1.jpg",
		size: 1024,
		path: "/1.jpg",
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
		flex-direction: column;
		margin-top: 35px;
		// align-items: center;
		justify-content: center;
		// text-align: center;
		// vertical-align: middle;
		// height: 40px;
		width: 100%;
		// line-height: 40px;
		span {
			padding-left: 40px;
			font-size: 18px;
			font-weight: 700;
		}
		.el-icon {
			position: fixed;
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
	}
}
</style>
