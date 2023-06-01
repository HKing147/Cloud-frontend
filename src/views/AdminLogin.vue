<template>
	<div class="main">
		<div class="loginContainer">
			<div style="font-size: 30px">网盘后台管理系统</div>
			<div class="loginForm">
				<div class="head">管理员登陆</div>
				<el-form :model="loginForm" :rules="loginRules" size="large" style="margin: 30px 10px" class="login-form">
					<el-form-item prop="email">
						<el-input v-model="loginForm.email" placeholder="请输入邮箱" style="height: 46px">
							<template #suffix>
								<el-icon size="20"><Avatar /></el-icon>
							</template>
						</el-input>
					</el-form-item>
					<!-- <el-form-item prop="password">
						<el-input v-model="loginForm.password" placeholder="请输入密码" style="height: 46px">
							<template #suffix>
								<el-icon size="20"><WalletFilled /></el-icon>
							</template>
						</el-input>
					</el-form-item> -->
					<el-form-item prop="password">
						<el-input type="password" show-password v-model="loginForm.password" placeholder="请输入密码" style="height: 46px"> </el-input>
					</el-form-item>
					<el-button type="primary" class="btn" @click="login">登录</el-button>
					<el-checkbox v-model="loginForm.rememberMe" label="下次自动登录" size="large" style="float: left" />
				</el-form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { inject, reactive } from "vue";
import service from "../request";
import router from "../router";
const loginForm = reactive({ email: "1470042308@qq.com", password: "123456", rememberMe: false });
const loginRules = reactive({
	email: [
		{
			required: true,
			message: "请输入邮箱",
			trigger: "change",
		},
		{
			type: "email",
			message: "请输入正确的邮箱",
			trigger: ["blur", "change"],
		},
	],
	password: [
		{
			required: true,
			message: "请输入密码",
			trigger: "change",
		},
	],
});
const vueCookies = inject("vueCookies");
async function login() {
	console.log(loginForm);
	// 登录逻辑
	// service.defaults.withCredentials = true;
	var res = await service.post("/login", loginForm);
	console.log(res);
	// 从Cookie获取登录信息：admin_token
	const admin_token = vueCookies.get("admin_token");
	if (admin_token == null) {
		ElMessage({
			message: "登陆失败",
			type: "error",
		});
		return;
	}
	//登录成功
	if (res.meta.code == 0) {
		ElMessage({
			message: res.meta.msg,
			type: "success",
		});
		if (history.state.back != null) {
			// 上一页存在则跳转过去
			router.push(history.state.back);
		} else {
			// 否则跳转至home
			router.push("/admin/statistics");
		}
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
	width: 100%;
	height: 100%;
	background-color: #ecefff;
	.loginContainer {
		width: 350px;
		margin: 0px auto;
		padding-top: 100px;
		text-align: center;
		.loginForm {
			margin-top: 30px;
			padding: 20px;
			height: 270px;
			border-radius: 10px;
			background-color: white;
			.login-form {
				.btn {
					width: 100%;
					height: 48px;
					border-radius: 10px;
					font-size: 16px;
					color: white;
					background: linear-gradient(175deg, #476fff, #8da1ff);
				}
				.checkCodeBtn {
					width: 80px;
					padding: 10px 10px 10px 0px;
					border: none; // 去掉插槽按钮和input中的边框
					background: rgba(233, 237, 246, 0.5);
					&:hover {
						background: rgba(233, 237, 246, 0.5) !important;
					}
				}
			}
		}
	}
}
</style>
