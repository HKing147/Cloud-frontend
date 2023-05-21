<template>
	<div class="main">
		<el-container style="height: 100%">
			<el-aside style="height: 100%; width: 220px">
				<div class="left">
					<el-menu :default-active="activeIndex" router>
						<div class="logo">
							<img src="/assets/img/logo.png" style="width: 104px; height: auto" />
						</div>
						<el-menu-item index="/admin" key="0">
							<el-icon :size="20">
								<component :is="'PieChart'"></component>
							</el-icon>
							<span> 首页 </span>
						</el-menu-item>
						<el-menu-item index="/admin/managerUser" key="1">
							<el-icon :size="20">
								<component :is="'User'"></component>
							</el-icon>
							<span> 用户管理 </span>
						</el-menu-item>
						<el-menu-item index="/admin/managerFile" key="2">
							<el-icon :size="20">
								<component :is="'Files'"></component>
							</el-icon>
							<span> 文件管理 </span>
						</el-menu-item>
						<!-- <el-menu-item v-for="(item, index) in menuList.value" :index="item.path" :key="index">
							<el-icon :size="20">
								<component :is="item.icon"></component>
							</el-icon>
							<span>{{ item.name }}</span>
						</el-menu-item> -->
						<el-divider style="margin-top: 430px" border-style="double" />
						<div class="foot">
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
											<el-dropdown-item @click="logout">退出登录</el-dropdown-item>
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
			</el-main>
		</el-container>
	</div>
</template>

<script setup>
import { inject, onMounted, reactive, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import service from "../request";
const router = useRouter();
const route = useRoute();
const activeIndex = ref("0");
const userInfo = ref({});

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

onMounted(() => {
	console.log("Cookies token:", token);
});

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

function logout() {
	vueCookies.remove("admin_token"); // 删除token
	router.push("/admin/login"); // 返回登陆页面
}
</script>

<style lang="scss" scoped>
.main {
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	min-height: 100%;

	.left {
		float: left;
		height: 100%;
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
		width: 100%;
		height: 100%;
		bottom: 0;
	}
}
</style>
