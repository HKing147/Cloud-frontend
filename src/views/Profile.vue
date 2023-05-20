<template>
	<div class="main">
		<div class="head">个人中心</div>
		<div class="content">
			<el-card class="box-card">
				<div style="display: flex; width: 100%">
					<el-upload
						class="avatar-uploader"
						:action="baseURL + '/uploadAvatar'"
						:show-file-list="false"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload"
						:with-credentials="true"
					>
						<div
							class="avatar"
							:style="{
								backgroundImage: 'url(' + userInfo.avatar + ')',
								backgroundSize: 'cover',
								backgroundRepeat: 'no-repeat',
								backgroundPosition: 'center center',
							}"
						>
							<el-icon color="#409eff" :size="50"><UploadFilled /></el-icon>
						</div>
					</el-upload>
				</div>
				<el-input size="large" v-model="userInfo.userName" clearable>
					<template #prepend>用户名</template>
				</el-input>
				<el-input size="large" v-model="userInfo.password" clearable>
					<template #prepend>修改密码</template>
				</el-input>
				<el-input size="large" v-model="userInfo.email" disabled>
					<template #prepend>邮箱</template>
				</el-input>
				<el-input size="large" v-model="userInfo.QQ" clearable>
					<template #prepend>QQ</template>
				</el-input>
				<el-input size="large" v-model="userInfo.Wechat" clearable>
					<template #prepend>微信</template>
				</el-input>
				<el-input size="large" v-model="userInfo.totalSpace" disabled>
					<template #prepend>网盘空间</template>
				</el-input>
				<el-input size="large" v-model="userInfo.usedSpace" disabled>
					<template #prepend>使用空间</template>
				</el-input>
				<el-input size="large" v-model="userInfo.CreatedAt" disabled>
					<template #prepend>注册时间</template>
				</el-input>
				<div class="btn">
					<el-button color="#577aff" round>修改信息</el-button>
				</div>
			</el-card>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import service, { baseURL } from "../request";
const userInfo = ref({});
async function getUserInfo() {
	const res = await service.get("/getUserInfo");
	console.log("getUserInfo: ", res);
	if (res.meta.code == 0) {
		userInfo.value = res.user;
		userInfo.value.password = "";
	}
}
getUserInfo();

function handleAvatarSuccess(res, uploadFile, uploadFiles) {
	console.log(res, uploadFile, uploadFiles);
	ElMessage({
		message: res.meta.msg,
		type: res.meta.msg,
	});
	if (res.meta.code == 0) {
		userInfo.value.avatar = res.avatar;
	}
}
</script>

<style lang="scss" scoped>
.main {
	.head {
		padding-top: 30px;
		padding-left: 30px;
		padding-bottom: 10px;
		font-size: 16px;
		font-weight: 600;
	}
	.content {
		.box-card {
			margin: 0 auto;
			width: 70%;
			display: flex;
			flex-direction: column;
			padding: 0 40px;
			.avatar-uploader {
				margin: 0 auto;
				.avatar {
					display: flex;
					width: 100px;
					height: 100px;
					border-radius: 50%;
					.el-icon {
						visibility: hidden;
					}
					&:hover {
						.el-icon {
							width: 100px;
							height: 100px;
							border-radius: 50%;
							background-color: rgba(255, 255, 255, 0.4);
							visibility: visible;
							margin: auto auto;
						}
					}
				}
			}
			.el-input {
				padding: 10px 0;
			}
			.btn {
				padding-top: 15px;
				display: flex;
				.el-button {
					margin: 0 auto;
					width: 180px;
					height: 40px;
					font-size: 20px;
				}
			}
			// .avatar {
			// 	visibility: hidden;
			// 	img {
			// 		width: 100px;
			// 		height: 100px;
			// 		border-radius: 50%;
			// 		display: block;
			// 		visibility: visible;
			// 		margin: 0 auto;
			// 	}
			// 	&:hover {
			// 		visibility: visible;
			// 		background-color: aqua;
			// 		.el-icon {
			// 			visibility: visible;
			// 		}
			// 	}
			// }
		}
	}
}
</style>
