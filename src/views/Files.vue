<template>
	<div class="main">
		<div class="head">
			<span>文件</span>
			<el-icon class="search" :size="20"><Search /></el-icon>
			<div class="addContainer">
				<el-icon class="add" :size="20"><Plus /></el-icon>
			</div>
		</div>
	</div>
</template>

<script setup></script>

<style lang="scss" scoped>
.main {
	.head {
		display: flex;
		flex-direction: row;
		margin-top: 35px;
		text-align: center;
		height: 40px;
		line-height: 40px;
		span {
			padding-left: 40px;
			font-size: 18px;
			font-weight: 700;
		}
		.el-icon {
			position: fixed;
		}
		.search {
			right: 100px;
		}
		.addContainer {
			position: fixed;
			right: 30px;
			width: 32px;
			height: 32px;
			border-radius: 50%;
			background: linear-gradient(129.12deg, #446dff 0%, rgba(99, 125, 255, 0.75) 100%);
			display: flex;
			justify-content: center;
			align-items: center;
			.add {
				// margin: auto;
				border-radius: 50%;
				color: white;
			}
		}
	}
}
</style>
