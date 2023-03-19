<template>Recycle</template>

<script setup>
import service from "../request";

async function getRecycle() {
	const res = await service.get("/getRecycle");
	console.log("recycle: ", res.recycle);
}
getRecycle();
</script>

<style lang="scss" scoped></style>
