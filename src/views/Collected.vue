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
			<DraggableTree :data="data" :parentDir="'../files/'" ref="draggableTreeRef">
				<template v-slot="prop">
					<el-dropdown>
						<el-icon :size="17" style="outline: none"><MoreFilled /></el-icon>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="downloadFile(prop.data)" :disabled="prop.data.isFolder">下载</el-dropdown-item>
								<el-dropdown-item @click="showShareDialog(prop.data.id)">分享</el-dropdown-item>
								<el-dropdown-item @click="collectedFiles(prop.data.id)">{{ prop.data.isCollect ? "取消收藏" : "收藏" }}</el-dropdown-item>
								<el-dropdown-item @click="showRenameDialog(prop.data)" divided>重命名</el-dropdown-item>
								<el-dropdown-item @click="showMoveDialog(prop.data)">移动</el-dropdown-item>
								<el-dropdown-item @click="showDetialDialog(prop.data)">查看详细信息</el-dropdown-item>
								<el-dropdown-item divided @click="deleteFiles(prop.data.filePath, prop.data.id)">删除</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</template>
			</DraggableTree>
		</div>

		<el-affix position="bottom" target="#filePage" :offset="100" v-if="draggableTreeRef != null && draggableTreeRef.checkedList != null && draggableTreeRef.checkedList.length > 0">
			<div class="ops">
				<span class="op" @click="downloadFiles(...draggableTreeRef.checkedList)">
					<el-tooltip placement="top" :offset="20">
						<template #content>下载</template>
						<el-icon :size="18" color="#c6c6c7"><Download /></el-icon>
					</el-tooltip>
				</span>
				<span class="op" @click="showShareDialog(...draggableTreeRef.checkedList)">
					<el-tooltip placement="top" :offset="20">
						<template #content>分享</template>
						<el-icon :size="18" color="#c6c6c7"><Share /></el-icon>
					</el-tooltip>
				</span>
				<span class="op" @click="collectedFiles(...draggableTreeRef.checkedList)">
					<el-tooltip placement="top" :offset="20">
						<template #content>取消收藏</template>
						<el-icon :size="18" color="#f35b51"><Star /></el-icon>
					</el-tooltip>
				</span>
				<span class="op" @click="deleteFiles(currentDir + '/', ...draggableTreeRef.checkedList)">
					<el-tooltip placement="top" :offset="20">
						<template #content>放入回收站</template>
						<el-icon :size="18" color="#c6c6c7"><Delete /></el-icon>
					</el-tooltip>
				</span>
				<span class="op">
					<el-dropdown trigger="click">
						<span>
							<el-tooltip placement="top" :offset="20">
								<template #content>更多</template>
								<el-icon :size="18" color="#c6c6c7"><MoreFilled /></el-icon>
							</el-tooltip>
						</span>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item @click="showMoveDialog(...draggableTreeRef.checkedList)">移动</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
				</span>
				<span class="op" @click="draggableTreeRef.cancel">
					<el-tooltip placement="top" :offset="20">
						<template #content>取消多选</template>
						<el-icon :size="18" color="#c6c6c7"><CircleCloseFilled /></el-icon>
					</el-tooltip>
				</span>
			</div>
		</el-affix>

		<!-- 重命名文件(夹)对话框 -->
		<el-dialog v-model="renameDialogVisible" title="重命名" width="25%" style="border-radius: 10px" draggable>
			<img style="width: 120px; display: block; margin: 0 auto" :src="'/assets/icon/' + renameFile.type + '.png'" onerror="this.src='/assets/icon/other.png'; this.onerror=null" />
			<template #footer>
				<span>
					<el-input size="large" style="margin-bottom: 20px" v-model="renameFile.fileName" />
					<el-button color="#637dff" style="color: white" type="primary" @click="rename"> 确定 </el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 移动文件对话框 -->
		<el-dialog v-model="moveDialogVisible" title="移动到" width="30%" style="border-radius: 10px" draggable>
			<el-breadcrumb separator-icon="ArrowRight">
				<el-breadcrumb-item style="cursor: pointer" @click="moveDir = item.path" v-for="(item, index) in movePath" :key="index">{{ item.name }}</el-breadcrumb-item>
				<!-- <el-breadcrumb-item :to="{ path: './' }"> 文件 </el-breadcrumb-item>
				<el-breadcrumb-item><a href="./backup">我的备份</a></el-breadcrumb-item>
				<el-breadcrumb-item>相册</el-breadcrumb-item> -->
			</el-breadcrumb>
			<el-scrollbar max-height="300px" style="margin-top: 10px">
				<div v-for="(item, index) in moveFileList" :key="index">
					<div
						@click="item.isFolder ? updateDirPath(item) : null"
						style="padding: 3px; width: 95%; display: flex; flex-direction: row; align-items: center"
						:class="item.isFolder ? 'canSelect' : 'cannotSelect'"
					>
						<img
							style="width: 30px; height: 30px; margin-right: 15px"
							:src="'/assets/icon/' + item.type + '.png'"
							onerror="this.src='/assets/icon/other.png';this.onerror=null"
						/>
						{{ item.fileName }}
					</div>
				</div>
			</el-scrollbar>
			<template #footer>
				<span>
					<el-button @click="moveDialogVisible = false"> 取消 </el-button>
					<el-button color="#637dff" style="color: white" type="primary" @click="move"> 移动到此处 </el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 查看详细信息对话框 -->
		<el-dialog class="detail" v-model="detailDialogVisible" :title="fileDetail.fileName" width="25%" style="border-radius: 10px" draggable>
			<div style="display: flex; flex-direction: row">
				<img style="margin: 0 auto; height: 120px" :src="'/assets/icon/' + fileDetail.type + '.png'" onerror="this.src='/assets/icon/other.png';this.onerror=null" />
			</div>
			<div style="font-size: 18px; margin: 10px 0">详细信息</div>
			<div>文件名</div>
			<div class="attrValue">{{ fileDetail.fileName }}</div>
			<div>文件大小</div>
			<div class="attrValue">
				{{
					fileDetail.type == "folder"
						? "-" // 文件夹不显示大小
						: fileDetail.size / 1024 < 1024
						? (fileDetail.size / 1024).toFixed(2) + "KB" // 小于1MB
						: fileDetail.size / 1024 / 1024 < 1024
						? (fileDetail.size / 1024 / 1024).toFixed(2) + "MB" // 小于1GB
						: (fileDetail.size / 1024 / 1024 / 1024).toFixed(2) + "GB"
				}}
			</div>
			<div>文件位置</div>
			<div class="attrValue">{{ fileDetail.filePath }}</div>
			<div>下载次数</div>
			<div class="attrValue">{{ fileDetail.downCount }}</div>
			<div>云端创建时间</div>
			<div class="attrValue">{{ new Date(fileDetail.createdTime).toLocaleString() }}</div>
			<div>最后修改时间</div>
			<div class="attrValue">{{ new Date(fileDetail.updatedTime).toLocaleString() }}</div>
		</el-dialog>
		<!-- 分享文件对话框 -->
		<el-dialog class="detail" v-model="shareDialogVisible" title="分享文件" width="30%" style="border-radius: 10px" draggable>
			<div style="text-align: center; padding: 10px">
				<img style="height: 120px" :src="'/assets/icon/folder.png'" onerror="this.src='/assets/icon/other.png';this.onerror=null" />
			</div>
			<div style="text-align: center; margin: 30px">共 {{ shareFileIDList.length }} 个文件</div>
			<div v-if="!shareSuccess">
				<div style="margin: 20px 0">
					<span style="margin-right: 10px"> 选择有效期 </span>
					<el-select style="width: 120px" v-model="shareDuration" placeholder="Select">
						<el-option v-for="item in duratinOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</div>
				<div style="margin: 20px 0">
					<span style="margin-right: 24px">分享形式 </span>
					<el-select style="width: 260px" v-model="shareMethod" placeholder="Select">
						<el-option v-for="item in shareMethodOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</div>
			</div>
			<div v-else>
				<div>
					<div style="font-size: 16px; margin: 10px 0">分享链接</div>
					<el-input id="shareUrl" size="large" v-model="shareUrl" disabled>
						<template #suffix>
							<el-icon :size="20" style="cursor: pointer" @click="copy('#shareUrl')"><CopyDocument /></el-icon>
						</template>
					</el-input>
					<div v-if="sharePassword != ''">
						<div style="font-size: 16px; margin: 10px 0">提取码</div>
						<el-input style="width: 30%" id="sharePassword" size="large" v-model="sharePassword" disabled>
							<template #suffix>
								<el-icon :size="20" style="cursor: pointer" @click="copy('#sharePassword')"><CopyDocument /></el-icon>
							</template>
						</el-input>
					</div>
				</div>
			</div>
			<template #footer>
				<span v-if="!shareSuccess">
					<el-button color="#637dff" style="color: white" type="primary" @click="shareFiles"> 创建分享 </el-button>
				</span>
				<span v-else>
					<el-button color="#637dff" style="color: white" type="primary" @click="copyLink"> 复制链接口令 </el-button>
				</span>
			</template>
		</el-dialog>
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

	<!-- <drag-upload :onDrop="drop"></drag-upload> -->
</template>

<script setup>
import axios from "axios";
import { onBeforeMount, onMounted, reactive, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import DraggableTree from "../components/DraggableTree.vue";
import service from "../request";
import router from "../router";
import { downloadFile, downloadFiles } from "../utils";

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
const path = ref([{ name: "文件", path: "" }]);
const route = new useRoute();

async function getCollectedList() {
	const res = await service.get("/getCollectedList");
	console.log("collectedList: ", res.collectedList);
	data.value = res.collectedList;
}

getCollectedList();

const draggableTreeRef = ref();

// 重命名
const renameDialogVisible = ref(false);
const renameFile = ref({});
function showRenameDialog(item) {
	renameFile.value = item;
	renameDialogVisible.value = true;
	console.log(renameFile.value);
}
// 移动
const moveDialogVisible = ref(false);
const formFile = ref({});
const moveDir = ref("/");
const movePath = ref([{ name: "文件", path: "/" }]);
const moveFileList = ref([]);
async function showMoveDialog(file) {
	moveDialogVisible.value = true;
	formFile.value = file;
	moveDir.value = "/";
	movePath.value = [{ name: "文件", path: "/" }];
	// 获取文件列表
	const res = await service.get("/getFileList", { params: { path: moveDir.value } });
	console.log(res.fileList);
	moveFileList.value = res.fileList;
}
function updateDirPath(item) {
	moveDir.value = item.filePath + item.fileName + "/";
	movePath.value.push({ name: item.fileName, path: moveDir.value });
}
async function updateMoveFileList() {
	const res = await service.get("/getFileList", { params: { path: moveDir.value } });
	console.log(res.fileList);
	moveFileList.value = res.fileList;
}
watchEffect(() => {
	console.log("moveDir: ", moveDir.value);
	// moveDir发生变化，更新movePath
	var list = moveDir.value.split("/");
	console.log("list: ", list);
	movePath.value = movePath.value.slice(0, list.length - 1);
	console.log("movePath: ", movePath.value);
	// 最后再更新moveFileList
	updateMoveFileList();
});

// 查看详细信息
const detailDialogVisible = ref(false);
const fileDetail = ref({});
function showDetialDialog(item) {
	detailDialogVisible.value = true;
	fileDetail.value = item;
}

// 下载
function download(fileUrl) {
	console.log("fileUrl: ", fileUrl);
	// ElNotification({
	// 	title: "Custom Position",
	// 	dangerouslyUseHTMLString: true,
	// 	message: "<div>{{data}}</div>",
	// 	position: "bottom-right",
	// });
	// window.open(fileUrl);
}

// 分享
// 分享文件
const duratinOptions = [
	{ value: 30, label: "30天内有效" },
	{ value: 0, label: "永久有效" },
];
const shareMethodOptions = [
	{ value: false, label: "公开链接（不需提取码即可查看）" },
	{ value: true, label: "私密链接（需要提取码才能查看）" },
];
const shareDialogVisible = ref(false);
const shareFileIDList = ref([]);
const shareDuration = ref(30);
const shareMethod = ref(false);
const shareSuccess = ref(false);
const shareUrl = ref("");
const sharePassword = ref("");
function showShareDialog(...fileIDList) {
	console.log(fileIDList);
	shareFileIDList.value = fileIDList;
	shareDialogVisible.value = true;
}
async function shareFiles() {
	console.log(shareDuration.value);
	console.log(shareMethod.value);
	console.log(shareFileIDList.value);
	const res = await service.post("/shareFiles", { shareDuration: shareDuration.value, shareMethod: shareMethod.value, userFileIDList: shareFileIDList.value });
	console.log(res);
	ElMessage({ message: res.meta.msg, type: res.meta.msg });
	if (res.meta.code == 0) {
		shareSuccess.value = true;
		// shareUrl.value = "http://localhost:5173/share/" + res.shareUrl;
		shareUrl.value = window.location.origin + "/share/" + res.shareUrl;
		sharePassword.value = res.password;
	}
}
function copy(id) {
	const input = document.querySelector(id);
	input.select();
	navigator.clipboard.writeText(input.value);
	ElMessage({
		message: "复制成功",
		type: "success",
	});
}
function copyLink() {
	var link =
		shareUrl.value +
		(sharePassword.value != "" ? " 提取码: " + sharePassword.value : "") +
		" 点击链接保存，或者复制本段内容，打开「阿里云盘」APP ，无需下载极速在线查看，视频原画倍速播放。";
	navigator.clipboard.writeText(link);
	ElMessage({
		message: "复制成功",
		type: "success",
	});
}

// 收藏
async function collectedFiles(...fileIDList) {
	const res = await service.post("/collectedFiles", { fileIDList });
	ElMessage({ message: res.meta.msg, type: res.meta.msg });
	if (res.meta.code == 0) {
		router.go(0);
	}
	// item.isCollect = !item.isCollect;
}

// 重命名
async function rename() {
	console.log("重命名文件: ", renameFile.value);
	const res = await service.post("/renameFile", { userFileID: renameFile.value.id, newFileName: renameFile.value.fileName });
	console.log(res);
	if (res.meta.code == 0) renameDialogVisible.value = false;
}

// 移动
async function move() {
	console.log(formFile.value, " ===> ", moveDir.value);
	if (formFile.value.filePath == moveDir.value) {
		ElMessage({
			message: "已在该文件夹下",
		});
	} else if (moveDir.value.startsWith(formFile.value.filePath + formFile.value.fileName + "/")) {
		ElMessage({
			message: "不能移动到自身目录下",
			type: "warning",
		});
	} else {
		// 移动逻辑

		// 文件夹移动
		ElMessage({
			message: "移动成功",
			type: "success",
		});
	}
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
.canSelect {
	&:hover {
		cursor: pointer;
		background: #f5f5f6;
		border-radius: 5px;
	}
}
.cannotSelect {
	opacity: 0.5;
	&:hover {
		cursor: not-allowed;
	}
}
.detail {
	.attrValue {
		font-size: 12px;
		opacity: 0.5;
		margin: 5px 0;
	}
}
:deep(.el-upload-dragger) {
	border: 0;
	cursor: default;
}
</style>
