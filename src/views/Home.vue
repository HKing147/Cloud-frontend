<template>
	<div class="main">
		<el-container style="height: 100%">
			<el-aside style="height: 100%; width: 220px">
				<div class="left">
					<el-menu :default-active="activeIndex" router>
						<!-- <el-menu-item index="0" style="margin-bottom: 20px"> -->
						<div class="logo">
							<img src="../assets/img/logo.png" style="width: 104px; height: auto" />
						</div>
						<el-menu-item v-for="(item, index) in menuList.value" :index="item.path" :key="index">
							<el-icon :size="20">
								<component :is="item.icon"></component>
							</el-icon>
							<span>{{ item.name }}</span>
						</el-menu-item>
						<div class="space">
							<el-progress :percentage="50" />
						</div>
						<div class="foot">
							<img src="../assets/img/tou.jpg" />
							<span class="uname">用户名</span>
							<span class="menu">
								<el-dropdown>
									<el-icon><More /></el-icon>
									<template #dropdown>
										<el-dropdown-menu>
											<el-dropdown-item>Action 1</el-dropdown-item>
											<el-dropdown-item>Action 2</el-dropdown-item>
											<el-dropdown-item>Action 3</el-dropdown-item>
											<el-dropdown-item disabled>Action 4</el-dropdown-item>
											<el-dropdown-item divided>Action 5</el-dropdown-item>
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
	</div>
</template>

<script setup>
import { inject, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const menuList = reactive({});
const activeIndex = ref("0");

// 从Cookie获取登录信息：token
const vueCookies = inject("vueCookies");
const token = vueCookies.get("token");

onMounted(() => {
	console.log("Cookies token:", token);
});

function getMenuList() {
	menuList.value = router.options.routes[1].children;
	// for (var i = 0; i < router.options.routes.length; i++) {
	// 	if (router.options.routes[i].path == route.path) {
	// 		menuList.value = router.options.routes[i].children;
	// 		console.log(menuList.value);
	// 	}
	// }
}
getMenuList();

function getActiveIndex() {
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
getActiveIndex();
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
				margin-top: 200px;
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
				bottom: 20px;
				img {
					width: 40px;
					height: 40px;
					border-radius: 50%;
				}
				.uname {
					height: 40px;
				}
				.menu {
					padding-left: 10px;
					padding-top: 12px;
					.el-dropdown {
						cursor: pointer;
						:hover {
							background-color: #e3e3e5;
							border-radius: 3px;
						}
						.el-icon {
							outline: none;
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
