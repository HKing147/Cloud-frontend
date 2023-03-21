<template>
	<div class="main">
		<div class="head">
			<el-row :gutter="0" style="padding-left: 25px; line-height: 18px; color: #6a6a6a; font-size: 12px; display: flex; flex-direction: row; align-items: center">
				<el-col :span="2">
					<el-checkbox v-model="isCheckAll" @change="checkAll">{{ isCheckAll ? "取消全选" : "全选" }}</el-checkbox>
				</el-col>
				<el-col :span="18"></el-col>
				<el-col :span="3" style="display: flex; flex-direction: row; align-items: center">
					<el-icon :size="16"><Sort /></el-icon>
					按修改时间排序
				</el-col>
				<el-col :span="1">
					<el-icon :size="16"><Menu /></el-icon>
				</el-col>
			</el-row>
			<el-row :gutter="0" style="padding-left: 5px; line-height: 40px; font-size: 10px; color: #aaaaaa">
				<el-col :span="2">名称</el-col>
				<el-col :span="11"></el-col>
				<el-col :span="5">修改时间</el-col>
				<el-col :span="3"></el-col>
				<el-col :span="2">大小</el-col>
			</el-row>
		</div>
		<el-scrollbar height="100%">
			<el-checkbox-group v-model="checkedList" fill="#637dff" @change="checked">
				<el-tree :data="props.data" :props="defaultProps" @node-click="handleNodeClick" :load="loadNode" lazy draggable>
					<template #default="{ node, data }">
						<!-- <div class="tree-node"> -->
						<el-row :gutter="25" class="tree-node" style="width: 98%">
							<el-col :span="0">
								<el-checkbox v-bind="data.id" :key="data.id" :label="data.id"><br /></el-checkbox>
							</el-col>
							<!-- <el-col :span="0.2"> <img src="../assets/icon/doc.png" /></el-col> -->
							<el-col :span="0.2" @click="openFolder(data)">
								<img :src="'/public/assets/icon/' + data.type + '.png'" onerror="this.src='/public/assets/icon/other.png'"
							/></el-col>
							<el-col :span="12" @click="openFolder(data)"> {{ node.label }}</el-col>
							<el-col class="icon" :span="1">
								<!-- <el-icon :size="17"><MoreFilled /></el-icon> -->
								<el-dropdown>
									<!-- <el-button type="primary">
									<el-icon class="el-icon--right"><arrow-down /></el-icon>
								</el-button> -->
									<el-icon :size="17" style="outline: none"><MoreFilled /></el-icon>
									<template #dropdown>
										<el-dropdown-menu>
											<el-dropdown-item>下载</el-dropdown-item>
											<el-dropdown-item>分享</el-dropdown-item>
											<el-dropdown-item @click="collected(data)">{{ data.isCollect ? "取消收藏" : "收藏" }}</el-dropdown-item>
											<el-dropdown-item divided>重命名</el-dropdown-item>
											<el-dropdown-item>移动</el-dropdown-item>
											<el-dropdown-item divided @click="deleteFiles(data.filePath, data.id)">删除</el-dropdown-item>
										</el-dropdown-menu>
									</template>
								</el-dropdown>
							</el-col>
							<el-col :span="7">
								<span style="font-size: 8px; color: #9d9d9d">{{ new Date(data.updatedTime).toLocaleString() }} </span></el-col
							>
							<el-col :span="1">
								<span style="font-size: 8px; color: #9d9d9d"
									>{{
										data.type == "folder"
											? "" // 文件夹不显示大小
											: data.size / 1024 < 1024
											? (data.size / 1024).toFixed(2) + "KB" // 小于1MB
											: data.size / 1024 / 1024 < 1024
											? (data.size / 1024 / 1024).toFixed(2) + "MB" // 小于1GB
											: (data.size / 1024 / 1024 / 1024).toFixed(2) + "GB"
									}}
								</span></el-col
							>
						</el-row>
						<!-- </div> -->
					</template>
				</el-tree>
			</el-checkbox-group>
		</el-scrollbar>
		<!-- <el-tree-v2 :data="data" :props="defaultProps" item-size="50" icon="" show-checkbox draggable>
		<template #default="{ node, data }">
			<img src="../assets/img/minfolder.png" style="width: 25px; height: 25px; padding-right: 20px" />
			<span style="width: 500px">{{ node.label }}</span>
			<el-icon style="visibility: hidden"><MoreFilled /></el-icon>
			<span style="width: 300px">{{ data.time }} </span>
			<span>{{ data.size }} </span>
		</template>
	</el-tree-v2> -->
	</div>
</template>

<script setup>
import { onBeforeMount, onMounted, reactive, toRefs } from "vue";
import service from "../request";
import router from "../router";
const props = defineProps({
	data: Object,
	parentDir: {
		type: String,
		default: "",
		required: false,
	},
});
// var data = reactive([]);
// onMounted(() => {
// 	data = props.data.value;
// 	console.log("tableData: ", props.data.value);
// });
const { data } = toRefs(props); // 还是响应式的，与父组件保持一致，而 data = props.data不是响应式的

console.log("tableData: ", data);
const defaultProps = {
	// children: "children",
	label: "fileName",
	// isLeaf: "notFolder",
	isLeaf: () => {
		return true;
	},
};
const isCheckAll = ref(false);
const checkedList = ref([]);
function checked(e) {
	console.log("check e: ", e);
	console.log(checkedList.value);
	// checkedList 没满就将 isCheckAll 置为 false
	isCheckAll.value = checkedList.value.length == data.length;
}
function checkAll() {
	console.log("checkAll");
	console.log(isCheckAll.value);
	console.log(checkedList.value);
	if (isCheckAll.value) {
		checkedList.value = [];
		for (var i = 0; i < data.value.length; ++i) {
			console.log(data.value[i].id);
			checkedList.value.push(data.value[i].id);
			// checkedList.value.push(data[i]);
		}
	} else {
		checkedList.value = [];
	}
	console.log(checkedList.value);
}

// function handleCheckedChange(newCheckedList) {
// 	console.log("checkedList ", checkedList.value);
// 	checkedList.value = newCheckedList;
// 	console.log("checkedList ", checkedList.value);
// }
/*
const data = reactive([
	{
		id: 1,
		filename: "文件夹一",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		children: [
			{
				filename: "Level two 1-1",
				time: "2021/09/26 21:17",
				size: 100,
				isLeaf: true,
				children: [],
			},
		],
	},
	{
		id: 2,
		filename: "文件夹二",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		children: [
			{
				filename: "Level two 1-1",
				time: "2021/09/26 21:17",
				size: 100,
				isLeaf: true,
				children: [],
			},
		],
	},
	{
		id: 3,
		filename: "文件夹三",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		children: [
			{
				filename: "Level two 1-1",
				time: "2021/09/26 21:17",
				size: 100,
				isLeaf: true,
				children: [],
			},
		],
	},
	{
		id: 4,
		filename: "文件夹四",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		children: [
			{
				isLeaf: true,
				filename: "Level two 1-1",
				time: "2021/09/26 21:17",
				size: 100,
				children: [],
			},
		],
	},
	{
		id: 5,
		filename: "文件",
		time: "2021/09/26 21:17",
		size: 1024,
		isLeaf: true,
		// children: [],
	},
]);
*/
console.log(data);
const loadNode = (node, resolve) => {
	console.log("node", node.data);
	if (node.level === 0) {
		return resolve(node.data);
	}
	return resolve([]);
};
/* TyScript */
// const loadNode = (node, resolve: (data) => void) => {
// 	console.log("node", node.data);
// 	if (node.level === 0) {
// 		return resolve(node.data);
// 	}
// 	return resolve([]);
// };

function handleNodeClick(e) {
	console.log("handleNodeClick ", e);
	// if (e.type == "folder") {
	// 	// 点击的是文件夹
	// 	router.push(router.currentRoute.value.fullPath + "/" + e.fileName);
	// }
}

function openFolder(e) {
	console.log("openFolder: ", e);
	if (e.type == "folder") {
		// 点击的是文件夹
		router.push("/home/files" + e.filePath + e.fileName);
		// router.push(router.currentRoute.value.fullPath + "/" + props.parentDir + e.fileName);
		// router.push(router.currentRoute.value.fullPath + "/" + e.fileName);
	}
}

function collected(item) {
	console.log("collected: ");
	var fileIDList = [];
	console.log(item);
	fileIDList.push(item.id);
	service.post("/collectedFiles", { fileIDList });
	item.isCollect = !item.isCollect;
}

function deleteFiles(path, ...userFileIDList) {
	console.log("deleteFiles: ", path, userFileIDList);
	service.post("/deleteFiles", { userFileIDList, path });
}

// 取消多选
function cancel() {
	console.log(checkedList.value);
	isCheckAll.value = false;
	checkedList.value = [];
}
//这里需要暴露出去不然父组件获取不到
defineExpose({
	isCheckAll,
	checkedList,
	deleteFiles,
	cancel,
});
</script>
<style lang="scss" scoped>
.main {
	.head {
		.el-row {
			border-top: solid;
			border-width: thin;
			border-color: #f5f5f6;
			.el-col {
				display: flex;
				flex-direction: column;
				// flex-direction: row;
				// align-items: center;
				text-align: center;
			}
		}
	}

	:deep(.el-tree) {
		display: flex;
		flex-direction: column;
		font-size: 14px;
		width: 100%;
		.tree-node {
			&:hover {
				background-color: #f5f5f6;
			}
			&:hover .el-col .el-icon {
				visibility: visible;
				// color: #aaaaaa;
				color: #9d9d9d;
			}
			// &:hover .el-checkbox {
			// 	visibility: visible;
			// 	color: #aaaaad;
			// }
			.el-col {
				display: flex;
				flex-direction: row;
				align-items: center;

				.el-icon {
					visibility: hidden;
					:hover {
						background: white;
						color: #717171;
					}
				}
			}

			.el-checkbox {
				// visibility: hidden;
				padding-right: 20px;
			}
			img {
				width: 25px;
				height: 25px;
				vertical-align: center;
				// padding-right: 20px;
			}
		}
		// }
	}

	:deep(.el-tree-node__content) {
		display: flex;
		height: 40px;
		line-height: 40px;
		vertical-align: middle;
		// border-width: 0px;
		// border: solid;
		border-top: solid;
		border-width: thin;
		border-color: #f5f5f6;

		cursor: pointer;
	}
	:deep(.el-checkbox__inner) {
		border-radius: 50%;
	}
}
</style>
