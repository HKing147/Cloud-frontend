<template>
	<div class="main" id="filePage">
		<div class="head">
			<div class="txt">我的分享</div>
			<!-- <el-breadcrumb separator-icon="ArrowRight">
				<el-breadcrumb-item v-for="(item, index) in path" :to="{ path: '/home/files' + item.path }" :key="index">{{ item.name }}</el-breadcrumb-item>
			</el-breadcrumb> -->
			<div class="delete" style="display: flex; flex-direction: row; align-items: center">
				<el-icon :size="20"><Delete /> </el-icon>清空
			</div>
			<!-- <div class="addContainer">
				<el-icon class="add" :size="20" @click="send"><Plus /></el-icon>
			</div> -->
		</div>

		<div class="content">
			<DraggableTree :data="data" :menuItem="'myShare'" :parentDir="'./share/'" ref="draggableTreeRef" />
		</div>
	</div>
	<div class="affix">
		<el-affix position="bottom" :offset="60" v-if="draggableTreeRef != null && draggableTreeRef.checkedList != null && draggableTreeRef.checkedList.length > 0">
			<div class="ops">
				<span class="op" @click="resumeFiles(...draggableTreeRef.checkedList)">
					<el-tooltip placement="top" :offset="20">
						<template #content>恢复</template>
						<el-icon :size="18" color="#c6c6c7"><RefreshLeft /></el-icon>
					</el-tooltip>
				</span>
				<span class="op">
					<el-tooltip placement="top" :offset="20">
						<template #content>彻底删除</template>
						<el-icon :size="18" color="#c6c6c7"><Delete /></el-icon>
					</el-tooltip>
				</span>
				<!-- <span class="op">
					<el-icon :size="18" color="#c6c6c7"><CircleCloseFilled /></el-icon>
				</span> -->
				<span class="op" @click="draggableTreeRef.cancel">
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
import service from "../request";
const data = ref([]);
async function getShareList() {
	const res = await service.get("/getShareList");
	console.log("getShareList:", res.fileList);
	data.value = res.fileList;
}
getShareList();

async function getShareByID(shareID) {
	const res = await service.get("/getShareByID", { params: { shareID } });
	console.log("getShareByID:", res.fileList);
}
getShareByID(3);
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
		.txt {
			font-size: 18px;
			font-weight: 1000;
			margin-left: 40px;
		}
		.delete {
			padding: 5px;
			margin-right: 40px;
			font-size: 14px;
			.el-icon {
				margin-right: 5px;
			}
		}
		.delete:hover {
			border-radius: 5px;
			background-color: #feebea;
			color: #f47b6a;
			cursor: pointer;
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
