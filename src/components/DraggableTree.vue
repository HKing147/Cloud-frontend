<template>
	<div class="main">
		<div class="head">
			<el-checkbox v-model="isCheckAll" @change="checkAll">{{ isCheckAll ? "取消全选" : "全选" }}</el-checkbox>
			<el-row :gutter="0" style="padding-left: 5px">
				<el-col :span="2">名称</el-col>
				<el-col :span="11"></el-col>
				<el-col :span="5">修改时间</el-col>
				<el-col :span="3"></el-col>
				<el-col :span="2">大小</el-col>
			</el-row>
		</div>
		<el-checkbox-group v-model="checkedList" fill="#637dff" @change="check">
			<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" :load="loadNode" lazy draggable>
				<template #default="{ node, data }">
					<!-- <div class="tree-node"> -->
					<el-row :gutter="25" class="tree-node" style="width: 100%">
						<el-col :span="0">
							<el-checkbox v-bind="data.id" :key="data.id" :label="data.id"><br /></el-checkbox>
						</el-col>
						<el-col :span="0.2"> <img src="../assets/img/minfolder.png" /></el-col>
						<el-col :span="12"> {{ node.label }}</el-col>
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
										<el-dropdown-item>收藏</el-dropdown-item>
										<el-dropdown-item divided>重命名</el-dropdown-item>
										<el-dropdown-item>移动</el-dropdown-item>
										<el-dropdown-item divided>删除</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</el-col>
						<el-col :span="7">
							<span style="font-size: 8px; color: #9d9d9d">{{ data.time }} </span></el-col
						>
						<el-col :span="1">
							<span style="font-size: 8px; color: #9d9d9d">{{ data.size }} </span></el-col
						>
					</el-row>
					<!-- </div> -->
				</template>
			</el-tree>
		</el-checkbox-group>
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
import { reactive } from "vue";
const props = defineProps({
	data: Object,
});
const data = props.data;
console.log("tableData: ", props.data);
const defaultProps = {
	children: "children",
	label: "filename",
	isLeaf: "isLeaf",
};
const isCheckAll = ref(false);
const checkedList = ref([]);
function check(e) {
	console.log("e: ", e);
	console.log(checkedList.value);
	// checkedList 没满就将 isCheckAll 置为 false
	isCheckAll.value = checkedList.value.length == data.length;
}
function checkAll() {
	console.log(isCheckAll.value);
	console.log(checkedList.value);
	if (isCheckAll.value) {
		checkedList.value = [];
		for (var i = 0; i < data.length; ++i) {
			console.log(data[i].id);
			checkedList.value.push(data[i].id);
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

function handleNodeClick() {}

//这里需要暴露出去不然父组件获取不到
defineExpose({
	checkedList,
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
		.tree-node {
			&:hover {
				background-color: #f5f5f6;
			}
			&:hover .el-col .el-icon {
				visibility: visible;
				color: #aaaaad;
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
