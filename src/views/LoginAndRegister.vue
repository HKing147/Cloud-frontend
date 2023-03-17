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
				<el-tabs type="border-card">
					<el-tab-pane>
						<template #label>
							<span class="custom-tabs-label">
								<span style="font-size: 18px">密码登录</span>
							</span>
						</template>
						<el-form :model="loginForm" :rules="loginRules" size="large" style="margin: 30px 10px" class="login-form">
							<el-form-item prop="email">
								<el-input v-model="loginForm.email" placeholder="请输入邮箱" style="height: 46px" />
							</el-form-item>
							<el-form-item prop="password">
								<el-input v-model="loginForm.password" placeholder="请输入密码" style="height: 46px" />
							</el-form-item>
							<el-button class="btn" @click="login">登录</el-button>
							<el-checkbox v-model="loginForm.rememberMe" label="下次自动登录" size="large" style="float: left" />
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
						<el-form :model="registerForm" :rules="registerRules" size="large" style="margin: 30px 10px" class="login-form">
							<el-form-item prop="email">
								<el-input v-model="registerForm.email" placeholder="请输入邮箱" style="height: 46px" />
							</el-form-item>
							<el-form-item prop="password">
								<el-input v-model="registerForm.password" placeholder="请输入密码" style="height: 46px" />
							</el-form-item>
							<el-form-item prop="checkCode">
								<el-input v-model="registerForm.checkCode" placeholder="请输入验证码" style="height: 46px">
									<template #append>
										<el-button class="checkCodeBtn" @click="pressCheckCodeBtn">{{
											count > 0 ? count + "秒后重发" : "获取验证码"
										}}</el-button>
									</template></el-input
								>
							</el-form-item>
							<el-button class="btn" @click="register">注册</el-button>
						</el-form>
					</el-tab-pane>
					<!-- <el-tab-pane label="扫码登录" name="second">扫码登录</el-tab-pane>
					<el-tab-pane label="注册" name="third">注册</el-tab-pane> -->
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from "vue";
// import type { FormRules } from "element-plus";
import { useRouter } from "vue-router";
import service from "../request";

const router = useRouter();

const loginForm = reactive({ email: "1470042308@qq.com", password: "123456", rememberMe: false });
async function login() {
	console.log(loginForm);
	// 登录逻辑
	// service.defaults.withCredentials = true;
	var res = await service.post("/login", loginForm);
	console.log(res);
	//登录成功
	if (res.meta.code == 0) {
		ElMessage({
			message: res.meta.msg,
			type: "success",
		});
		router.push("/home/files");
	} else {
		ElMessage({
			message: res.meta.msg,
			type: "error",
		});
	}
	// router.push("/home");
}
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

const registerForm = reactive({
	email: "1470042308@qq.com",
	password: "123456",
	checkCode: "",
});
const registerRules = reactive({
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

const show = ref(false);
const count = ref(0);
let timer;

async function pressCheckCodeBtn() {
	const TIME_COUNT = 60;
	console.log(TIME_COUNT);
	if (!timer) {
		// 发送验证码
		console.log("发送验证码...");
		var res = await service.get("/getCheckCode", { params: { email: registerForm.email, T: TIME_COUNT } });
		console.log("res:", res);
		if (res.meta.code == 0) {
			// 发送成功
			count.value = TIME_COUNT;
			show.value = false;
			timer = setInterval(() => {
				if (count.value > 0 && count.value <= TIME_COUNT) {
					count.value--;
				} else {
					show.value = true;
					clearInterval(timer);
					timer = null;
				}
				console.log(count.value);
			}, 1000);
		}
	}
}

async function register() {
	var res = await service.post("/register", registerForm);
	console.log(res);
	if (res.meta.code == 0) {
		ElMessage({
			message: res.meta.msg,
			type: "success",
		});
		router.push("/home/files");
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
	position: fixed;
	height: 100%;
	width: 100%;
	background-size: 100% 100%;
	background-color: #ecefff;
	display: flex;
	flex-direction: row;
	padding: 120px;
	.face img {
		height: 500px;
	}
	.right {
		margin-left: 150px;
		text-align: center;
		font-size: 20px;
		img {
			height: 50px;
			margin-bottom: 30px;
		}
		.login-container {
			width: 100%;
			border-radius: 20px;
			border: 0;
			overflow: hidden;
			.el-tabs {
				border: 0;
				height: 100%;
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
}
</style>
