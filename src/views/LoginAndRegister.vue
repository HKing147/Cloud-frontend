<template>
	<div class="main">
		<div class="face">
			<img src="../assets/img/face.png" alt="" />
		</div>
		<div class="right">
			<div class="logo">
				<img src="../assets/img/logo.png" alt="" />
			</div>
			<div class="login-container">
				<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" type="border-card">
					<el-tab-pane>
						<template #label>
							<span class="custom-tabs-label">
								<span style="font-size: 18px">密码登录</span>
							</span>
						</template>
						<el-form :model="form" size="large" style="margin: 30px 10px" class="login-form">
							<el-form-item>
								<el-input v-model="form.account" placeholder="请输入邮箱" style="height: 46px" />
							</el-form-item>
							<el-form-item>
								<el-input v-model="form.password" placeholder="请输入密码" style="height: 46px" />
							</el-form-item>
							<el-button class="btn">登录</el-button>
							<el-checkbox v-model="rem" label="下次自动登录" size="large" style="float: left" />
						</el-form>
					</el-tab-pane>
					<el-tab-pane>
						<template #label>
							<span class="custom-tabs-label">
								<span style="font-size: 18px">扫码登录</span>
							</span>
						</template>
						<img src="../assets/img/qrcode.png" style="width: 150px; height: 150px; margin-top: 30px" />
					</el-tab-pane>
					<el-tab-pane>
						<template #label>
							<span class="custom-tabs-label">
								<span style="font-size: 18px">注册账号</span>
							</span>
						</template>
						注册账号
					</el-tab-pane>
					<!-- <el-tab-pane label="扫码登录" name="second">扫码登录</el-tab-pane>
					<el-tab-pane label="注册" name="third">注册</el-tab-pane> -->
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive } from "vue";

const form = reactive({});
</script>

<!-- <style scoped> -->
<style lang="scss">
.main {
	position: fixed;
	height: 100%;
	width: 100%;
	/* height: 100vh;
	width: 100vh; */
	/* margin: 0;
	padding: 0;
	border: 0; */
	background-size: 100% 100%;
	background-color: #ecefff;
	/* background: url("../assets/img/face.png"); */
	display: flex;
	flex-direction: row;
	padding: 120px;
	.face img {
		height: 500px;
	}
	.right {
		margin-left: 150px;
		// width: 350px;
		text-align: center;
		font-size: 20px;
		img {
			height: 50px;
			margin-bottom: 30px;
		}
		.login-container {
			// height: 350px;
			width: 100%;
			border-radius: 20px;
			border: 0;
			overflow: hidden;
			.el-tabs {
				border: 0;
				height: 100%;
				// width: 100%;
				// background-color: white;
				.login-form {
					.btn {
						width: 100%;
						height: 48px;
						border-radius: 10px;
						font-size: 16px;
						color: white;
						background: linear-gradient(175deg, #476fff, #8da1ff);
					}
				}
			}
		}
	}
}
</style>
