<template>
	<div>
		<div class="title">鼠标放到ID列和行上试试 可以拖拽行和列</div>
		<table class="tb">
			<thead>
				<th>名称</th>
				<th>修改时间</th>
				<th>大小</th>
				<!-- <draggable v-model="state.headers" animation="200" tag="tr" :item-key="(key) => key">
					<template #item="{ element: header }">
						<th class="move">
							{{ header }}
						</th>
					</template>
				</draggable> -->
			</thead>
			<draggable
				:list="state.list"
				handle=".move"
				animation="200"
				@start="onStart"
				@end="onEnd"
				:move="moveEvent"
				@moved="onMoved"
				@sort="onSort"
				@update="onUpdate"
				@change="onChange"
				@choose="onChoose"
				tag="tbody"
				item-key="name"
			>
				<template #item="{ element }">
					<tr>
						<td class="move" style="display: flex; flex-direction: row">
							<img src="../assets/img/minfolder.png" style="width: 20px; height: 20px; padding-right: 10px" />
							{{ element.id }}
						</td>
						<td class="move">{{ element.name }}</td>
						<td class="move">{{ element.intro }}</td>
						<!-- <td class="move" v-for="(header, index) in state.headers" :key="header">
							{{ element[header] }}
						</td> -->
					</tr>
				</template>
			</draggable>
		</table>
		<el-affix position="bottom" :offset="60">
			<div class="ops">
				<el-icon :size="18" color="#c6c6c7"><Download /></el-icon>
				<el-icon :size="18" color="#c6c6c7"><Share /></el-icon>
				<el-icon :size="18" color="#c6c6c7"><Star /></el-icon>
				<el-icon :size="18" color="#c6c6c7"><Delete /></el-icon>
				<el-icon :size="18" color="#c6c6c7"><MoreFilled /></el-icon>
				<el-icon :size="18" color="#c6c6c7"><CircleCloseFilled /></el-icon>
			</div>
		</el-affix>
	</div>
</template>
<script setup>
import { ref, reactive } from "vue";
import draggable from "vuedraggable";
/*
draggable 对CSS样式没有什么要求万物皆可拖拽
:list="state.list"         //需要绑定的数组
animation="300"            //动画效果
@start="onStart"           //拖拽开始的事件
@end="onEnd"               //拖拽结束的事件
*/
const state = reactive({
	//列的名称
	headers: ["id", "name", "intro"],
	//需要拖拽的数据，拖拽后数据的顺序也会变化
	list: [
		{ name: "www.itxst.com", id: 0, intro: "慢吞吞的蜗牛", children: [] },
		{ name: "www.baidu.com", id: 1, intro: "中文搜索引擎", children: [] },
		{ name: "www.google.com", id: 3, intro: "安卓操作系统", children: [] },
	],
});

const dragOrignalItem = reactive({});
const dragTargetItem = reactive({});
//拖拽开始的事件
const onStart = (e) => {
	console.log("开始拖拽", e);
	// console.log(state.list);
	console.log(state.list[0]);
	console.log(state.list[1]);
	console.log(state.list[2]);
};

//拖拽结束的事件
const onEnd = (e) => {
	console.log("结束拖拽", e.oldIndex, " -> ", e.newIndex);
	// var item = state.list[e.oldIndex];
	// state.list[e.newIndex].children.push(item);
	// state.list.splice(e.oldIndex, 1);
	console.log(state.list);
	console.log("Ending......", dragOrignalItem.value, dragTargetItem.value);
	// console.log("Ending......", dragOrignalItem.value, dragTargetItem.value, dragTargetItemRect.value);
	if ((dragOrignalItem.value == null && dragTargetItem.value == null) || dragOrignalItem.value.id == dragTargetItem.value.id) return;
	var item = dragOrignalItem.value;
	var srcIndex = 0,
		destIndex = 0;
	for (var i = 0; i < state.list.length; i++) {
		if (state.list[i].id == dragOrignalItem.value.id) {
			srcIndex = i;
			break;
		}
	}
	for (var i = 0; i < state.list.length; i++) {
		if (state.list[i].id == dragTargetItem.value.id) {
			destIndex = i;
			break;
		}
	}
	console.log(srcIndex, " -> ", destIndex);
	state.list[destIndex].children.push(item);
	state.list.splice(srcIndex, 1);
	console.log("结束...", state.list);
	dragOrignalItem.value = null;
	dragTargetItem.value = null;
};

const moveEvent = (evt) => {
	let event = window.event;
	if (event && event.pointerType && event.pointerType === "touch") return;
	//记录移动的条目和目标条目
	if (evt.draggedContext && evt.relatedContext && evt.draggedContext.element && evt.relatedContext.element) {
		dragOrignalItem.value = evt.draggedContext.element;
		dragTargetItem.value = evt.relatedContext.element;
	} else {
		dragOrignalItem.value = null;
		dragTargetItem.value = null;
	}
	return true;
};

const onMoved = (e) => {
	console.log("onMoved...", e);
};

const onChange = (e) => {
	console.log("onChange...", e.moved.oldIndex, " -> ", e.moved.newIndex);
	// console.log(state.list);
	console.log(state.list[0]);
	console.log(state.list[1]);
	console.log(state.list[2]);
};
const onUpdate = (e) => {
	console.log("onUpdate...", e);
	console.log(state.list[0]);
	console.log(state.list[1]);
	console.log(state.list[2]);
};
const onSort = (e) => {
	console.log("onSort...", e);
	console.log(state.list[0]);
	console.log(state.list[1]);
	console.log(state.list[2]);
};
const onChoose = (e) => {
	console.log("onChoose...", e);
};
</script>
<style scoped>
thead {
	font-size: 12px;
	cursor: pointer;
}
.move {
	cursor: move;
}
</style>
