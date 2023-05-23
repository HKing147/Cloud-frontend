<template>
	<div class="main">
		<el-container style="height: 100%">
			<el-aside style="height: 100%; width: 220px">
				<div class="left">
					<el-menu :default-active="activeIndex" router>
						<!-- <el-menu-item index="0" style="margin-bottom: 20px"> -->
						<div class="logo">
							<img src="/assets/img/logo.png" style="width: 104px; height: auto" />
						</div>
						<el-menu-item v-for="(item, index) in menuList.value" :index="item.path" :key="index">
							<el-icon :size="20">
								<component :is="item.icon"></component>
							</el-icon>
							<span>{{ item.name }}</span>
						</el-menu-item>
						<div class="space">
							<div style="font-size: 13px; color: #25262b">{{ parseSize(userInfo.usedSpace) }} / {{ parseSize(userInfo.totalSpace) }}</div>
							<el-progress color="#697fe8" :percentage="Math.ceil((userInfo.usedSpace * 100 * 100) / userInfo.totalSpace) / 100" />
						</div>
						<el-divider border-style="double" />
						<div class="foot">
							<!-- <img style="width: 40px; height: 40px; border-radius: 50%" :src="userInfo.avatar" onerror="this.src='/assets/img/tou.jpg'" /> -->
							<div
								class="avatar"
								:style="{
									backgroundImage: 'url(' + userInfo.avatar + ')',
									backgroundSize: 'cover',
									backgroundRepeat: 'no-repeat',
									backgroundPosition: 'center center',
								}"
							></div>
							<span class="uname">{{ userInfo.userName }}</span>
							<span class="menu">
								<el-dropdown trigger="click">
									<el-icon><More /></el-icon>
									<template #dropdown>
										<el-dropdown-menu>
											<el-dropdown-item @click="toProfile()">个人中心</el-dropdown-item>
											<el-dropdown-item @click="updatePasswordDialogVisible = true">修改密码</el-dropdown-item>
											<el-dropdown-item @click="logout" divided>退出登录</el-dropdown-item>
										</el-dropdown-menu>
									</template>
								</el-dropdown>
							</span>
						</div>
					</el-menu>
				</div>
			</el-aside>
			<el-main style="height: 100%; padding: 0px">
				<div class="right">
					<router-view> </router-view>
				</div>
				<!-- <el-affix position="bottom" :offset="60">
					<div class="ops">
						<el-icon :size="18" color="#c6c6c7" @click="print"><Download /></el-icon>
						<el-icon :size="18" color="#c6c6c7"><Share /></el-icon>
						<el-icon :size="18" color="#c6c6c7"><Star /></el-icon>
						<el-icon :size="18" color="#c6c6c7"><Delete /></el-icon>
						<el-icon :size="18" color="#c6c6c7"><MoreFilled /></el-icon>
						<el-icon :size="18" color="#c6c6c7"><CircleCloseFilled /></el-icon>
					</div>
				</el-affix> -->
			</el-main>
		</el-container>
		<!-- 修改密码对话框 -->
		<el-dialog class="detail" v-model="updatePasswordDialogVisible" title="修改密码" width="25%" style="border-radius: 10px" draggable>
			<el-form label-width="70px" :model="updatePasswordForm" style="max-width: 600px">
				<el-form-item label="原密码">
					<el-input type="password" v-model="updatePasswordForm.oldPass" show-password />
				</el-form-item>
				<el-form-item label="新密码">
					<el-input type="password" v-model="updatePasswordForm.newPass" show-password />
				</el-form-item>
				<el-form-item label="确认密码">
					<el-input type="password" v-model="updatePasswordForm.newPass2" @keyup.enter="updatePassword" show-password />
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" style="width: 200px; height: 40px" @click="updatePassword" round>确认修改</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script setup>
import { inject, onMounted, reactive, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import service from "../request";
import { parseSize } from "../utils";
const router = useRouter();
const route = useRoute();
const menuList = reactive({});
const activeIndex = ref("0");
const userInfo = ref({});
const updatePasswordDialogVisible = ref(false);
const updatePasswordForm = ref({});

// 从Cookie获取登录信息：token
const vueCookies = inject("vueCookies");
const token = vueCookies.get("token");

async function getUserInfo() {
	const res = await service.get("/getUserInfo");
	console.log("getUserInfo: ", res);
	if (res.meta.code == 0) {
		userInfo.value = res.user;
	}
}
getUserInfo();

function logout() {
	vueCookies.remove("token"); // 删除token
	router.push("/"); // 返回登陆页面
}

function toProfile() {
	router.push("/home/profile");
}

onMounted(() => {
	console.log("Cookies token:", token);
});

function getMenuList() {
	menuList.value = router.options.routes[1].children.slice(0, 5); // 第6个不要，它是用来正则匹配files的
	console.log("menuList:", menuList.value);
	// for (var i = 0; i < router.options.routes.length; i++) {
	// 	if (router.options.routes[i].path == route.path) {
	// 		menuList.value = router.options.routes[i].children;
	// 		console.log(menuList.value);
	// 	}
	// }
}
getMenuList();

function getActiveIndex() {
	// console.log("route.path: ", route.path);
	activeIndex.value = route.path == "/home" ? menuList.value[0].path : route.path;
	console.log(activeIndex);
	// for (var i = 0; i < menuList.value.length; i++) {
	// 	console.log(menuList.value[i].path, route.path);
	// 	if (menuList.value[i].path == route.path) {
	// 		activeIndex.value = ;
	// 		console.log(activeIndex);
	// 	}
	// }
}
watchEffect(() => {
	console.log("route.path: ", route.path);
	var list = route.path.split("/");
	console.log("list: ", list);
	if (list.length == 2) {
		activeIndex.value = "/home/files";
	} else {
		activeIndex.value = "/home/" + list[2];
	}
	// activeIndex.value = route.path;
});

getActiveIndex();

async function updatePassword() {
	console.log(updatePasswordForm.value);
	if (updatePasswordForm.value.newPass != updatePasswordForm.value.newPass2) {
		ElMessage({
			message: "两次密码不一致",
			type: "error",
		});
		return;
	}
	updatePasswordForm.value.id = userInfo.value.ID;
	const res = await service.post("/updatePassword", updatePasswordForm.value);
	if (res.meta.code == 0) {
		ElMessage({
			message: "修改成功，请重新登录",
			type: "success",
		});
		logout();
	} else {
		ElMessage({
			message: res.meta.msg,
			type: "error",
		});
	}
}
</script>

<style lang="scss" scoped>
.main {
	// display: flex;
	// flex-direction: row;
	// position: absolute;
	// position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	// height: 600px;
	width: 100%;
	min-height: 100%;

	.left {
		float: left;
		// width: 15%;
		height: 100%;
		// width: 220px;
		// position: fixed;
		// bottom: 0;
		// background: #f5f5f6;
		.el-menu {
			position: fixed;
			bottom: 0;
			width: 220px;
			height: 100%;
			background: #f5f5f6;
			border: 0;
			.logo {
				padding-top: 40px;
				margin-bottom: 20px;
				margin-left: 25px;
			}
			span {
				font-size: 15px;
				margin-left: 10px;
			}
			.el-menu-item {
				padding-top: 25px;
				padding-bottom: 25px;
				margin-left: 10px;
			}
			.space {
				margin-top: 260px;
				margin-left: 20px;
			}
			.foot {
				margin-left: 20px;
				line-height: 40px;
				display: flex;
				flex-direction: row;
				// flex-direction: column;
				// justify-content: center;
				position: fixed;
				bottom: 10px;
				.avatar {
					width: 40px;
					height: 40px;
					border-radius: 50%;
				}
				.uname {
					font-size: 14px;
					color: #25262b;
					height: 40px;
					white-space: nowrap; /*强制单行显示*/
					text-overflow: ellipsis; /*超出部分省略号表示*/
					overflow: hidden; /*超出部分隐藏*/
					width: 100px; /*设置显示的最大宽度*/
				}
				.menu {
					margin-left: 10px;
					padding-top: 12px;
					.el-dropdown {
						cursor: pointer;
						:hover {
							background-color: #e3e3e5;
							border-radius: 3px;
						}
						.el-icon {
							outline: none; // 去黑边
						}
					}
				}
			}
		}
	}
	.right {
		// flex: 0;
		// float: right;
		width: 100%;
		// width: 85%;
		// width: calc(100% - 220px);
		height: 100%;
		bottom: 0;
	}
	// .el-affix {
	// 	.ops {
	// 		margin: 0 auto;
	// 		background: #313136;
	// 		padding: 15px;
	// 		width: 200px;
	// 		border-radius: 15px;
	// 		.el-icon {
	// 			margin-left: 7px;
	// 			margin-right: 7px;
	// 		}
	// 	}
	// }
}
</style>
