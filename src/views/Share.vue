<template>
	<div class="main">
		<div class="head">
			<img class="logo" src="/public/assets/img/logo.png" @click="to('/home')" />
			<!-- <img class="avatar" v-if="userInfo != null" :src="userInfo != null ? userInfo.avatar : ''" onerror="this.src='/public/assets/img/tou.jpg'" /> -->
			<div
				v-if="userInfo != null"
				class="avatar"
				:style="{
					backgroundImage: 'url(' + userInfo.avatar + ')',
					backgroundSize: 'cover',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center center',
				}"
			></div>
			<el-button v-else @click="to('/')" round>登录</el-button>
		</div>
		<div v-if="shareInfo.password == ''" class="container">
			<div class="container-head">
				<div class="avatarContainer">
					<!-- <img :src="shareUserInfo.avatar" onerror="this.src='/public/assets/img/tou.jpg'" /> -->
					<div
						class="avatar"
						:style="{
							backgroundImage: 'url(' + shareUserInfo.avatar + ')',
							backgroundSize: 'cover',
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center center',
						}"
					></div>
					<div>
						<!-- <div style="font-size: 16px; font-weight: 600">分享文件</div> -->
						<div style="font-size: 16px; font-weight: 600">
							<el-breadcrumb separator-icon="ArrowRight">
								<el-breadcrumb-item style="cursor: pointer" v-for="(path, index) in paths" :key="index" @click="changePaths(path)">{{
									path.name
								}}</el-breadcrumb-item>
							</el-breadcrumb>
						</div>
						<div style="font-size: 13px; font-weight: 100; display: flex; flex-direction: row; margin-top: 8px">
							<span style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; width: 50px">
								{{ shareUserInfo.userName }}
							</span>
							<span> · {{ shareInfo.expirationTime == null ? "永久有效" : "30天内有效，请尽快保存" }}</span>
						</div>
					</div>
				</div>
				<el-button color="#637dff" style="color: white" @click="showSaveDialog(...draggableTreeRef.checkedList)">保存到我的云盘</el-button>
			</div>
			<DraggableTree :data="fileList" :getFileList="getFileList" :openFolder="openFolder" ref="draggableTreeRef"></DraggableTree>
		</div>
		<div v-else style="width: 50%; margin: 0 auto; margin-top: 50px; display: flex; flex-direction: column; text-align: center">
			<img style="height: 70px; width: 70px; border-radius: 50%; margin: 0 auto" :src="shareUserInfo.avatar" onerror="this.src='/public/assets/img/tou.jpg'" />
			<div style="font-size: 20px; display: flex; margin: 30px 0; justify-content: center">
				<span style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; width: 100px">{{ shareUserInfo.userName }}</span>
				分享了文件
			</div>
			<el-input v-model="inputPassword" size="large" style="width: 50%; display: block; margin: 20px auto" placeholder="请输入提取码"></el-input>
			<el-button @click="check" color="#4f75ff" size="large" style="font-size: 18px; width: 28%; display: block; margin: 0 auto">查看文件</el-button>
			<span style="margin-top: 10px; font-size: 12px; font-weight: 100">{{ shareInfo.expirationTime == null ? "永久有效" : "30天内有效" }}</span>
		</div>
		<!-- 保存文件对话框 -->
		<el-dialog v-model="saveDialogVisible" title="保存到" width="30%" style="border-radius: 10px" draggable>
			<el-breadcrumb separator-icon="ArrowRight">
				<el-breadcrumb-item style="cursor: pointer" @click="saveDir = item.path" v-for="(item, index) in savePath" :key="index">{{ item.name }}</el-breadcrumb-item>
				<!-- <el-breadcrumb-item :to="{ path: './' }"> 文件 </el-breadcrumb-item>
				<el-breadcrumb-item><a href="./backup">我的备份</a></el-breadcrumb-item>
				<el-breadcrumb-item>相册</el-breadcrumb-item> -->
			</el-breadcrumb>
			<el-scrollbar max-height="300px" style="margin-top: 10px">
				<div v-for="(item, index) in saveFileList" :key="index">
					<div
						@click="item.isFolder ? updateDirPath(item) : null"
						style="padding: 3px; width: 95%; display: flex; flex-direction: row; align-items: center"
						:class="item.isFolder ? 'canSelect' : 'cannotSelect'"
					>
						<img
							style="width: 30px; height: 30px; margin-right: 15px"
							:src="'/public/assets/icon/' + item.type + '.png'"
							onerror="this.src='/public/assets/icon/other.png'"
						/>
						{{ item.fileName }}
					</div>
				</div>
			</el-scrollbar>
			<template #footer>
				<span>
					<el-button @click="saveDialogVisible = false"> 取消 </el-button>
					<el-button color="#637dff" style="color: white" type="primary" @click="saveFiles"> 保存到此处 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import service from "../request";
import router from "../router";

const draggableTreeRef = ref();
const userInfo = ref(null);
const shareUserInfo = ref({});
const shareInfo = ref({});
const shareUrl = ref("");
const fileList = ref([]);

function to(target) {
	router.push(target);
}

async function getUserInfo() {
	const res = await service.get("/getUserInfo");
	console.log("getUserInfo: ", res);
	userInfo.value = res.user;
}

onMounted(async () => {
	await getUserInfo();
	var list = router.currentRoute.value.params.shareUrl.split("_");
	if (list.length != 3 || list[0] != "share") {
		ElMessage({
			message: "invalid params",
			type: "error",
		});
		router.push("/home/files");
	}
	shareUrl.value = router.currentRoute.value.params.shareUrl;
	var userID = parseInt(list[1]);
	console.log(shareUrl);
	console.log(userID);
	const res = await service.get("selectUserByID", { params: { userID } });
	if (res.meta.code == 0) {
		shareUserInfo.value = res.user;
	}
	await getFileList("updated_at");
});

async function getFileList(sortMethod) {
	const res = await service.get("/getShareByShareUrl", { params: { shareUrl: shareUrl.value, sortMethod } });
	console.log("fileList: ", res.fileList);
	if (res.meta.code == 0) {
		fileList.value = res.fileList;
		shareInfo.value = res.shareInfo;
	}
}

const paths = ref([{ id: "0", name: "分享文件" }]);
async function changePaths(path) {
	var list = path.id.split("-");
	var newLen = list.length;
	console.log("newLen: ", newLen);
	paths.value = paths.value.slice(0, newLen);
	// 再更新fileList
	if (newLen == 1) {
		// folderID=0 => 获取分享文件列表
		getFileList("");
	} else {
		const res = await service.get("/getFileListByFolderID", { params: { folderID: parseInt(list[newLen - 1]), sortMethod: "" } });
		if (res.meta.code == 0) {
			fileList.value = res.fileList;
		}
	}
}

async function openFolder(folder) {
	console.log(folder);
	// 打开该文件夹（获取文件列表）
	const res = await service.get("/getFileListByFolderID", { params: { folderID: folder.id, sortMethod: "" } });
	if (res.meta.code == 0) {
		fileList.value = res.fileList;
		// 更新paths
		var lastPath = paths.value[paths.value.length - 1];
		paths.value.push({ id: lastPath.id + "-" + folder.id, name: folder.fileName });
	}
}

const inputPassword = ref("");
function check() {
	if (inputPassword.value == shareInfo.value.password) {
		shareInfo.value.password = "";
	}
}

// 保存
const saveDialogVisible = ref(false);
// const fromFile = ref({});
const fromFiles = ref([]);
const saveDir = ref("/");
const savePath = ref([{ name: "文件", path: "/" }]);
const saveFileList = ref([]);
async function showSaveDialog(...fileIDList) {
	// 先判断是否登录
	if (userInfo.value == null) {
		ElMessage({
			message: "请先登录",
			type: "error",
		});
		router.push("/");
	}
	saveDialogVisible.value = true;
	// fromFile.value = file;
	fromFiles.value = fileIDList;
	saveDir.value = "/";
	savePath.value = [{ name: "文件", path: "/" }];
	// 获取文件列表
	const res = await service.get("/getFileList", { params: { path: saveDir.value } });
	console.log(res.fileList);
	saveFileList.value = res.fileList;
}
function updateDirPath(item) {
	saveDir.value = item.filePath + item.fileName + "/";
	savePath.value.push({ name: item.fileName, path: saveDir.value });
}
async function updateSaveFileList() {
	const res = await service.get("/getFileList", { params: { path: saveDir.value } });
	console.log(res.fileList);
	saveFileList.value = res.fileList;
}
watchEffect(() => {
	console.log("saveDir: ", saveDir.value);
	// saveDir发生变化，更新savePath
	var list = saveDir.value.split("/");
	console.log("list: ", list);
	savePath.value = savePath.value.slice(0, list.length - 1);
	console.log("savePath: ", savePath.value);
	// 最后再更新saveFileList
	updateSaveFileList();
});
async function saveFiles() {
	console.log(fromFiles.value, " ==> ", saveDir.value);
	const res = await service.post("/saveFiles", { userFileIDList: fromFiles.value, savePath: saveDir.value });
	ElMessage({
		message: res.meta.msg,
		type: res.meta.msg,
	});
	if (res.meta.code == 0) {
		saveDialogVisible.value = false;
	}
}
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;
	.head {
		height: 60px;
		display: flex;
		padding: 0 20px;
		flex-direction: row;
		justify-content: space-between;
		box-shadow: 0 0 1px 1px rgba(28, 28, 32, 0.05), 0 8px 24px rgba(28, 28, 32, 0.06);
		.logo {
			width: 110px;
			height: auto;
			margin: auto 0;
			&:hover {
				cursor: pointer;
			}
		}
		.avatar {
			width: 32px;
			height: 32px;
			border-radius: 50%;
			margin: auto 0;
		}
		.el-button {
			width: 80px;
			font-size: 14px;
			margin: auto 0;
		}
	}
	.container {
		width: 70%;
		margin: 0 auto;
		margin-top: 50px;
		.container-head {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-bottom: 30px;
			.avatarContainer {
				display: flex;
				flex-direction: row;
				.avatar {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					margin-right: 10px;
				}
				// img {
				// 	margin-right: 10px;
				// 	width: 40px;
				// 	height: 40px;
				// 	border-radius: 50%;
				// }
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
</style>
