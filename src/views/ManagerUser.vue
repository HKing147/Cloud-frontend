<template>
	<div class="main">
		<div style="font-size: 18px; font-weight: 600; padding: 30px">用户管理</div>
		<div class="table">
			<el-button type="primary" @click="showCreateUserDialogVisible" round>创建用户</el-button>
			<el-button type="danger" @click="deleteUsers(...selectedUserList)" round>删除用户</el-button>
			<el-table style="margin-top: 20px" :data="userList" @selection-change="handleSelectionChange" stripe border>
				<el-table-column type="selection" width="40" />
				<el-table-column fixed prop="userName" label="用户名" width="200" />
				<el-table-column prop="email" label="邮箱" width="200" />
				<el-table-column prop="QQ" label="QQ" width="150" />
				<el-table-column prop="Wechat" label="微信" width="150" />
				<el-table-column prop="totalSpace" label="总空间" width="100">
					<template #default="scope">
						<span>{{ parseSize(scope.row.totalSpace) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="usedSpace" label="已用空间" width="100">
					<template #default="scope">
						<span>{{ parseSize(scope.row.usedSpace) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="CreatedAt" label="创建时间" width="180">
					<template #default="scope">
						<span>{{ new Date(scope.row.CreatedAt).toLocaleString() }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="right" label="权限" width="100">
					<template #default="scope">
						<el-tag :type="scope.row.right ? 'success' : ''" disable-transitions>{{ scope.row.right ? "管理员" : "普通用户" }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="100">
					<template #default="scope">
						<el-button @click="showUpdateUserDialogVisible(scope.row)" type="primary" :icon="Edit" circle />
						<el-button @click="deleteUsers(scope.row)" type="danger" :icon="Delete" circle />
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 修改用户信息对话框 -->
		<el-dialog class="detail" v-model="updateUserDialogVisible" title="修改用户信息" width="38%" style="border-radius: 10px" draggable>
			<el-form label-width="100px" :model="updatedUser" style="max-width: 460px">
				<el-form-item label="用户名">
					<el-input size="large" v-model="updatedUser.userName" />
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input size="large" v-model="updatedUser.email" />
				</el-form-item>
				<el-form-item label="QQ">
					<el-input size="large" v-model="updatedUser.QQ" />
				</el-form-item>
				<el-form-item label="微信">
					<el-input size="large" v-model="updatedUser.Wechat" />
				</el-form-item>
				<el-form-item label="总空间">
					<el-input-number v-model="totalSpace" size="large" :precision="0" :min="1" :max="100" />
				</el-form-item>
				<el-form-item label="密码">
					<el-input size="large" type="password" v-model="updatedUser.password" show-password />
				</el-form-item>
				<el-form-item label="权限">
					<!-- <el-input size="large" v-model="updatedUser.right" /> -->
					<el-select v-model="updatedUser.right" placeholder="Select" size="large">
						<el-option :value="true" :key="true" label="管理员" />
						<el-option :value="false" :key="false" label="普通用户" />
					</el-select>
				</el-form-item>
				<el-button class="btn" @click="updateUser()" type="primary" round>确定修改</el-button>
			</el-form>
		</el-dialog>
		<!-- 创建用户对话框 -->
		<el-dialog class="detail" v-model="createUserDialogVisible" title="创建用户" width="38%" style="border-radius: 10px" draggable>
			<el-form label-width="100px" :model="createdUser" style="max-width: 460px">
				<el-form-item label="用户名">
					<el-input size="large" v-model="createdUser.userName" />
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input size="large" v-model="createdUser.email" />
				</el-form-item>
				<el-form-item label="QQ">
					<el-input size="large" v-model="createdUser.QQ" />
				</el-form-item>
				<el-form-item label="微信">
					<el-input size="large" v-model="createdUser.Wechat" />
				</el-form-item>
				<el-form-item label="总空间">
					<el-input-number v-model="totalSpace" size="large" :precision="0" :min="1" :max="100" />
				</el-form-item>
				<el-form-item label="密码">
					<el-input size="large" type="password" v-model="createdUser.password" show-password />
				</el-form-item>
				<el-form-item label="权限">
					<!-- <el-input size="large" v-model="updatedUser.right" /> -->
					<el-select v-model="createdUser.right" placeholder="Select" size="large">
						<el-option :value="true" :key="true" label="管理员" />
						<el-option :value="false" :key="false" label="普通用户" />
					</el-select>
				</el-form-item>
				<el-button class="btn" @click="createUser()" type="primary" round>确定创建</el-button>
			</el-form>
		</el-dialog>
	</div>
</template>

<script setup>
import { parseSize } from "../utils";
import { Delete, Edit } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import service from "../request";
import router from "../router";
const userList = ref([]);
async function getUserList() {
	const res = await service.get("/getUserList");
	console.log(res.userList);
	userList.value = res.userList;
}
getUserList();

var selectedUserList = [];
function handleSelectionChange(users) {
	console.log(users);
	selectedUserList = users;
}
async function deleteUsers(...userList) {
	console.log(userList);
	var len = userList.length;
	var userIDList = [];
	for (var i = 0; i < len; i++) {
		userIDList.push(userList[i].ID);
	}
	console.log(userIDList);
	const res = await service.post("/deleteUsers", userIDList);
	ElMessage({
		message: res.meta.msg,
		type: res.meta.msg,
	});
	if (res.meta.code == 0) {
		router.go(0);
	}
}

const updateUserDialogVisible = ref(false);
const updatedUser = ref({});
const totalSpace = ref(10);
function showUpdateUserDialogVisible(user) {
	updatedUser.value = user;
	updatedUser.value.password = "";
	totalSpace.value = updatedUser.value.totalSpace / 1024 / 1024 / 1024;
	console.log(updatedUser.value);
	updateUserDialogVisible.value = true;
}
async function updateUser() {
	updatedUser.value.totalSpace = totalSpace.value * 1024 * 1024 * 1024;
	console.log(updatedUser.value);
	const res = await service.post("/updateUserInfo", updatedUser.value);
	ElMessage({
		message: res.meta.msg,
		type: res.meta.msg,
	});
	if (res.meta.code == 0) {
		router.go(0);
	}
}

const createUserDialogVisible = ref(false);
const createdUser = ref({});
function showCreateUserDialogVisible() {
	totalSpace.value = 10;
	createUserDialogVisible.value = true;
}
async function createUser() {
	createdUser.value.totalSpace = totalSpace.value * 1024 * 1024 * 1024;
	console.log(createdUser.value);
	const res = await service.post("/createUser", createdUser.value);
	ElMessage({
		message: res.meta.msg,
		type: res.meta.msg,
	});
	if (res.meta.code == 0) {
		router.go(0);
	}
}
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;
	.table {
		width: 80%;
		margin: 0 auto;
		// margin-top: 20px;
	}
	.btn {
		margin-left: 100px;
		width: 80%;
		height: 40px;
		border-radius: 10px;
		font-size: 14px;
		color: white;
		background: linear-gradient(175deg, #476fff, #8da1ff);
	}
}
</style>
