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
							<el-form-item prop="account">
								<el-input v-model="loginForm.account" placeholder="请输入邮箱" style="height: 46px" />
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
							<el-form-item prop="account">
								<el-input v-model="registerForm.account" placeholder="请输入邮箱" style="height: 46px" />
							</el-form-item>
							<el-form-item prop="password">
								<el-input v-model="registerForm.password" placeholder="请输入密码" style="height: 46px" />
							</el-form-item>
							<el-form-item prop="checkCode">
								<el-input v-model="registerForm.checkCode" placeholder="请输入验证码" style="height: 46px">
									<template #append>
										<el-button class="checkCodeBtn" type="text" @click="pressCheckCodeBtn">{{
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

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormRules } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const loginForm = reactive({ account: "", password: "", rememberMe: false });
function login() {
	console.log(loginForm);
	// 登录逻辑

	//登录成功
	router.push("/home");
}
const loginRules = reactive<FormRules>({
	account: [
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
	account: "",
	password: "",
	checkCode: "",
});
const registerRules = reactive<FormRules>({
	account: [
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

function pressCheckCodeBtn() {
	const TIME_COUNT = 10;
	console.log(TIME_COUNT);
	if (!timer) {
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
		// 发送验证码
		getCheckCode();
	}
}

function getCheckCode() {
	console.log("发送验证码...");
}

function register() {
	console.log(registerForm);
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
