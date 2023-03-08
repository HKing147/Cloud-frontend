<template>
	<div class="left">
		<el-menu default-active="2">
			<!-- <el-menu-item index="0" style="margin-bottom: 20px"> -->
			<div class="logo">
				<img src="../assets/img/logo.png" style="width: 104px; height: auto" />
			</div>
			<!-- </el-menu-item> -->
			<el-menu-item index="1">
				<el-icon :size="20"><Document /></el-icon>
				<span>文件</span>
			</el-menu-item>
			<el-menu-item index="2">
				<el-icon :size="20"><Picture /></el-icon>
				<span>相册</span>
			</el-menu-item>
			<el-menu-item index="3">
				<el-icon :size="20"><Star /></el-icon>
				<span>收藏夹</span>
			</el-menu-item>
			<el-menu-item index="4">
				<el-icon :size="20"><Connection /></el-icon>
				<span>共享文件</span>
			</el-menu-item>
			<el-menu-item index="5">
				<el-icon :size="20"><Share /></el-icon>
				<span>我的分享</span>
			</el-menu-item>
			<el-menu-item index="6">
				<el-icon :size="20"><Delete /></el-icon>
				<span>回收站</span>
			</el-menu-item>
			<div class="space">
				<el-progress :percentage="50" />
			</div>
			<div class="foot">
				<img src="../assets/img/tou.jpg" />
				<span class="uname">{{ userName }}</span>
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
</template>

<script setup>
const userName = ref("HKing147");
</script>

<style lang="scss">
.left {
	height: 100%;
	width: 200px;
	position: fixed;
	bottom: 0;
	background: #f5f5f6;
	.el-menu {
		width: 200px;
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
</style>
