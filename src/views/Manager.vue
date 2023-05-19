<template>
	<div class="main">
		<el-container style="height: 100%">
			<el-aside style="height: 100%; width: 220px">
				<div class="left">
					<el-menu :default-active="activeIndex" router>
						<div class="logo">
							<img src="/assets/img/logo.png" style="width: 104px; height: auto" />
						</div>
						<el-menu-item index="/manager/user" key="0">
							<el-icon :size="20">
								<component :is="'Avatar'"></component>
							</el-icon>
							<span> 用户管理 </span>
						</el-menu-item>
						<!-- <el-menu-item v-for="(item, index) in menuList.value" :index="item.path" :key="index">
							<el-icon :size="20">
								<component :is="item.icon"></component>
							</el-icon>
							<span>{{ item.name }}</span>
						</el-menu-item> -->
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
		}
	}
	.right {
		width: 100%;
		height: 100%;
		bottom: 0;
	}
}
</style>
