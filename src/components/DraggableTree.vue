<template>
	<el-checkbox-group v-model="checkedList" fill="#637dff">
		<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" :load="loadNode" lazy draggable>
			<template #default="{ node, data }">
				<!-- <div class="tree-node"> -->
				<el-row :gutter="25" class="tree-node" style="width: 100%">
					<el-col :span="0">
						<el-checkbox v-bind="data.id" :key="data.id" :label="data.id"><br /></el-checkbox>
					</el-col>
					<el-col :span="0.2"> <img src="../assets/img/minfolder.png" /></el-col>
					<el-col :span="10"> {{ node.label }}</el-col>
					<el-col class="icon" :span="2">
						<el-icon><MoreFilled /></el-icon
					></el-col>
					<el-col :span="6">
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
const checkedList = ref([]);
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
</script>
<style lang="scss" scoped>
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
		.el-col {
			display: flex;
			flex-direction: row;
			align-items: center;

			.el-icon {
				visibility: hidden;
			}
		}

		.el-checkbox {
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
</style>
