<template>
	<div class="main">
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
		<div class="right">
			<router-view></router-view>
		</div>
	</div>
</template>

<script setup>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const menuList = reactive({});
const activeIndex = ref("0");

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
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 100%;
	.left {
		height: 100%;
		width: 200px;
		// position: fixed;
		// bottom: 0;
		// background: #f5f5f6;
		.el-menu {
			position: fixed;
			bottom: 0;
			width: 200px;
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
					}
				}
			}
		}
	}
	.right {
		flex: 1;
		height: 100%;
	}
}
</style>
