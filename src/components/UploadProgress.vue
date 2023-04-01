<template>
	<el-scrollbar max-height="400px">
		<div class="line" v-for:="(item, idx) in props.data.value" :key="idx">
			<img :src="'/assets/icon/' + item.type + '.png'" onerror="this.src='/assets/icon/other.png';this.onerror=null" />
			<div>
				<span style="display: flex; flex-direction: row; width: 250px">
					<span class="fileName">{{ item.fileName }}</span>
					<span style="font-size: 12px; padding-left: 5px">{{ parseSize(item.size) }}</span>
				</span>
				<el-progress :percentage="Math.ceil((item.uploadedSize * 100 * 100) / item.size) / 100" />
			</div>
		</div>
	</el-scrollbar>
</template>

<script setup>
import { watchEffect } from "vue";
import { parseSize } from "../utils";

const props = defineProps({
	data: Array,
});
</script>

<style lang="scss" scoped>
.line {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 320px;
	padding-bottom: 5px;
	img {
		width: 30px;
		height: 30px;
		margin-right: 10px;
		display: block;
	}
	.fileName {
		white-space: nowrap; /*强制单行显示*/
		text-overflow: ellipsis; /*超出部分省略号表示*/
		overflow: hidden; /*超出部分隐藏*/
		width: 180px; /*设置显示的最大宽度*/
	}
}
</style>
