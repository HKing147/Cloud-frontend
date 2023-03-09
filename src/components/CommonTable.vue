<template>
	<div class="main">
		<el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" />
			<el-table-column label="文件名">
				<template #default="scope">{{ scope.row.filename }}</template>
			</el-table-column>
			<el-table-column property="path" label="路径" />
			<el-table-column property="size" label="大小" show-overflow-tooltip />
		</el-table>
	</div>
</template>

<script setup>
const props = defineProps({
	tableData: Object,
});
const tableData = props.tableData;
console.log(tableData);
function handleSelectionChange() {}
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	// width: 1000px;
}
</style>
