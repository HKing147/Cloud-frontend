<template>
	<div class="main">
		<div class="up">
			<el-card style="background-color: #0099ff">
				<div class="cardContent">
					<el-icon style="background-color: #00a8ff" :size="30" :color="'white'"><Folder /></el-icon>
					<div>
						<div style="font-size: 12px">文件夹数</div>
						<div style="font-size: 22px; margin-top: 4px">{{ folderCount }}</div>
					</div>
				</div>
			</el-card>
			<el-card style="background-color: #ff6d5b">
				<div class="cardContent">
					<el-icon style="background-color: #ff8a7c" :size="30" :color="'white'"><Folder /></el-icon>
					<div>
						<div style="font-size: 12px">文件数</div>
						<div style="font-size: 22px; margin-top: 4px">{{ fileCount }}</div>
					</div>
				</div>
			</el-card>
			<el-card style="background-color: #00b07f">
				<div class="cardContent">
					<el-icon style="background-color: #00ba97" :size="30" :color="'white'"><Folder /></el-icon>
					<div>
						<div style="font-size: 12px">分享数</div>
						<div style="font-size: 22px; margin-top: 4px">2</div>
					</div>
				</div>
			</el-card>
			<el-card style="background-color: #9b78e0">
				<div class="cardContent">
					<el-icon style="background-color: #ac90e6" :size="30" :color="'white'"><Folder /></el-icon>
					<div>
						<div style="font-size: 12px">存储空间</div>
						<div style="font-size: 20px; margin-top: 4px">{{ parseSize(usedSpace) }}/{{ parseSize(totalSpace) }}</div>
					</div>
				</div>
			</el-card>
		</div>
		<div class="down">
			<el-card style="height: 500px; margin: 40px 20px" header="文件统计">
				<div id="chart2" style="width: 400px; height: 400px"></div>
			</el-card>
			<el-card style="height: 500px; margin: 40px 20px" header="空间使用情况">
				<div id="chart3" style="width: 400px; height: 400px"></div>
			</el-card>
		</div>
	</div>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from "vue";
import service from "../request";
import { parseSize } from "../utils";
const echarts = inject("$echarts");
let MyChart1 = null;
let MyChart2 = null;
let MyChart3 = null;
const folderCount = ref(0);
const fileCount = ref(0);
const totalSpace = ref(1024 ** 4); // 1TB
const usedSpace = ref(0);
const option1 = reactive({
	xAxis: {
		data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
	},
	yAxis: {},
	series: [
		{
			type: "bar",
			data: [23, 24, 18, 25, 27, 28, 25],
		},
	],
});
const fileCategoryList = ref({
	legend: {
		top: "bottom",
	},
	tooltip: {
		trigger: "item",
		formatter: "{b} : {c} ({d}%)",
	},
	toolbox: {
		show: true,
		feature: {
			mark: { show: true },
			dataView: { show: true, readOnly: false },
			restore: { show: true },
			saveAsImage: { show: true },
		},
	},
	series: [
		{
			name: "Nightingale Chart",
			type: "pie",
			radius: [30, 100],
			center: ["50%", "50%"],
			roseType: "area",
			itemStyle: {
				borderRadius: 8,
			},
			data: [
				{ value: 20, name: "rose 1" },
				{ value: 38, name: "rose 2" },
				{ value: 32, name: "rose 3" },
				{ value: 30, name: "rose 4" },
				{ value: 28, name: "rose 5" },
				{ value: 26, name: "rose 6" },
				{ value: 22, name: "rose 7" },
				{ value: 18, name: "rose 8" },
			],
		},
	],
});
const storage = ref({
	tooltip: {
		trigger: "item",
		formatter: (item, val) => {
			console.log("item:", item);
			console.log("val:", val);
			return item.data.name + " : " + parseSize(item.data.value) + " (" + item.percent + "%)";
		},
		// formatter: "{b} : {c} ({d}%)",
	},
	legend: {
		top: "bottom",
		left: "center",
	},
	toolbox: {
		show: true,
		feature: {
			mark: { show: true },
			dataView: { show: true, readOnly: false },
			restore: { show: true },
			saveAsImage: { show: true },
		},
	},
	series: [
		{
			name: "Access From",
			type: "pie",
			radius: ["40%", "70%"],
			avoidLabelOverlap: false,
			itemStyle: {
				borderRadius: 10,
				borderColor: "#fff",
				borderWidth: 2,
			},
			label: {
				show: false,
				position: "center",
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 30,
					fontWeight: "bold",
				},
			},
			labelLine: {
				show: false,
			},
			data: [
				{ value: 1024 ** 4, name: "空闲空间" },
				{ value: 100 * 1024 ** 3, name: "使用空间" },
			],
		},
	],
});
async function getFileCategory() {
	const res = await service.get("/getFileCategory");
	fileCategoryList.value.series[0].data = res.fileCategoryList;
	var len = res.fileCategoryList.length;
	folderCount.value = fileCount.value = 0;
	for (var i = 0; i < len; i++) {
		if (res.fileCategoryList[i].name == "folder") {
			folderCount.value += res.fileCategoryList[i].value;
		} else {
			fileCount.value += res.fileCategoryList[i].value;
		}
	}
}
async function getStorage() {
	const res = await service.get("/getStorage");
	var tot = 1024 ** 4; // 1TB
	console.log("-_-", storage.value.series[0].data[0].name);
	storage.value.series[0].data[0].value = tot - res.storage;
	storage.value.series[0].data[1].value = res.storage;
	console.log("-_-", storage.value.series[0].data);
}

onMounted(async () => {
	await getFileCategory();
	await getStorage();
	// MyChart1 = echarts.init(document.getElementById("chart1"));
	// MyChart1.setOption(option1);
	MyChart2 = echarts.init(document.getElementById("chart2"));
	MyChart2.setOption(fileCategoryList.value);
	MyChart3 = echarts.init(document.getElementById("chart3"));
	MyChart3.setOption(storage.value);
});
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;
	.up {
		// margin: 10px;
		padding: 40px 20px 0;
		display: flex;
		flex-direction: row;
		// width: 100%;
		// align-content: space-between;
		justify-content: space-between;
		.el-card {
			height: 100px;
			width: 21%;
			.cardContent {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				color: white;
				.el-icon {
					padding: 10px;
					border-radius: 50%;
				}
			}
		}
	}
	.down {
		display: flex;
		flex-direction: row;
		align-content: space-between;
	}
}
</style>
