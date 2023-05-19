<template>
	<vue-office-docx v-if:="type == 'doc' || type == 'docx'" :src="fileUrl" style="height: 100vh" @rendered="rendered" />
	<vue-office-excel v-if:="type == 'xlsx' || type == 'xls'" :src="fileUrl" style="height: 100vh" @rendered="rendered" />
	<vue-office-pdf v-if:="type == 'pdf'" :src="fileUrl" style="height: 100vh" @rendered="rendered" />
</template>

<script setup>
import VueOfficeDocx from "@vue-office/docx";
import "@vue-office/docx/lib/index.css";
import VueOfficeExcel from "@vue-office/excel";
import "@vue-office/excel/lib/index.css";
import VueOfficePdf from "@vue-office/pdf";
import { onMounted } from "vue";
import router from "../router";
const fileUrl = ref("");
const type = ref("");
onMounted(() => {
	console.log(router.currentRoute.value.query.fileUrl);
	fileUrl.value = router.currentRoute.value.query.fileUrl;
	console.log(fileUrl.value);
	type.value = router.currentRoute.value.query.type;
    console.log(type.value)
});
</script>

<style lang="scss" scoped></style>
