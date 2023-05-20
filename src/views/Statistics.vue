<template>
	<div class="main">
		<div id="chart1" style="width: 400px; height: 400px"></div>
		<div id="chart2" style="width: 700px; height: 600px"></div>
	</div>
</template>

<script setup>
import { inject, onMounted } from "vue";
const echarts = inject("$echarts");
let MyChart1 = null;
let MyChart2 = null;
const option1 = {
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
};
const option2 = {
	legend: {
		top: "bottom",
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
			radius: [50, 250],
			center: ["50%", "50%"],
			roseType: "area",
			itemStyle: {
				borderRadius: 8,
			},
			data: [
				{ value: 40, name: "rose 1" },
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
};

onMounted(() => {
	MyChart1 = echarts.init(document.getElementById("chart1"));
	MyChart1.setOption(option1);
	MyChart2 = echarts.init(document.getElementById("chart2"));
	MyChart2.setOption(option2);
});
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	align-content: space-between;
}
</style>
