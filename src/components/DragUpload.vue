<template>
	<div class="mask" v-show="show" id="mask">
		<h3>
			<el-icon :size="200"><UploadFilled /></el-icon>
			<br />
			拖拽到这里上传
		</h3>
	</div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
const props = defineProps({
	name: String, // 上传的字段名
	header: { Object, Number, String }, // 上传的文件头
	// 验证的文件类型,有值的时候只会拖入所有的文件只会保留设置过滤后的文件
	accept: {
		type: String,
		default: "",
	},
	// 是否开启自动上传
	autoUpload: {
		type: Boolean,
		default: true,
	},
	// 上传地址
	action: {
		type: String,
		default: "#",
	},
	onDrop: Function,
});

const emit = defineEmits(["onError", "onProgress", "onSuccess", "onChange"]); // 默认emit事件
let show = ref(false); // 是否展示遮罩
let fileList = reactive([]); // 文件列表
let tempIndex = 0; // 做一个标记
onMounted(() => {
	disableDefaultEvents();
	init();
});
// 初始化拖入事件
function init() {
	const ele = document.querySelector("body");
	console.log(ele);
	ele.addEventListener("dragenter", () => {
		show.value = true;
	}); //拖后放
	ele.addEventListener("dragleave", (e) => {
		console.log("leave", e);
		if (
			e.target.nodeName === "div#" + props.targetId + ".mainHTML" ||
			e.target === e.explicitOriginalTarget ||
			(!e.fromElement && (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight))
		) {
			show.value = false;
		}
	}); //拖离
	ele.addEventListener("drop", (e) => {
		show.value = false;
		e.preventDefault();
		console.log("调用drop", props.onDrop);
		props.onDrop(e);
	}); //拖进
}
// 禁用默认拖拽事件
function disableDefaultEvents() {
	const doc = document.documentElement;
	doc.addEventListener("dragleave", (e) => e.preventDefault()); //拖离
	doc.addEventListener("drop", (e) => e.preventDefault()); //拖后放
	doc.addEventListener("dragenter", (e) => e.preventDefault()); //拖进
	doc.addEventListener("dragover", (e) => e.preventDefault()); //拖来拖去
}
// 拖入时的事件
// function onDrop(e) {
// 	console.log("onDrop", e);
// 	const accept = props.accept;
// 	const list = [].slice.call(e.dataTransfer.files).filter((file) => {
// 		if (accept) {
// 			return checkType(file, accept);
// 		}
// 		return true;
// 	});
// 	fileList = list.map((p) => {
// 		return handleStart(p);
// 	});
// 	onChange();
// 	if (props.autoUpload) {
// 		if (props.action === "") {
// 			onError();
// 			throw "need action";
// 			return;
// 		}
// 		list.forEach((file) => {
// 			post(file);
// 		});
// 	}
// }
// 检查文件类型
function checkType(file, accept = "") {
	console.log("checkType", file);
	return true;
	const { type, name } = file;
	if (accept.length === 0) return true;
	const extension = name.indexOf(".") > -1 ? `.${name.split(".").pop()}` : "";
	const baseType = type.replace(/\/.*$/, "");
	return accept
		.split(",")
		.map((type) => type.trim())
		.filter((type) => type)
		.some((acceptedType) => {
			if (/\..+$/.test(acceptedType)) {
				return extension === acceptedType;
			}
			if (/\/\*$/.test(acceptedType)) {
				return baseType === acceptedType.replace(/\/\*$/, "");
			}
			if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
				return type === acceptedType;
			}
		});
}
// 处理文件列表返回值
function handleStart(rawFile) {
	console.log("handleStart", rawFile);
	rawFile.uid = Date.now() + tempIndex++;
	return {
		status: "ready",
		name: rawFile.name,
		size: rawFile.size,
		percentage: 0,
		uid: rawFile.uid,
		raw: rawFile,
	};
}
// 上传的事件
function post(rawFile) {
	console.log("post", rawFile);
	const options = {
		headers: props.header,
		file: rawFile,
		data: props.data || "",
		filename: props.name || "file",
		action: props.action,
	};
	upload(options)
		.then((res) => {
			res.JSON();
		})
		.then((json) => {
			onSuccess(json, rawFile);
		})
		.catch((err) => {
			onError(err, rawFile);
		});
}
// 文件上传方法
function upload(option) {
	console.log("upload===", option);
	const action = option.action;

	const formData = new FormData();

	if (option.data) {
		Object.keys(option.data).forEach((key) => {
			formData.append(key, option.data[key]);
		});
	}
	formData.append(option.filename, option.file, option.file.name);

	const headers = new Headers();
	for (let item in headers) {
		if (headers.hasOwnProperty(item) && headers[item] !== null) {
			headers.append(i, option.headers[i]);
		}
	}
	return fetch(action, {
		mode: "no-cors",
		body: formData,
		headers: headers,
		method: "post",
	});
}

// 拖拽进去获取文件列表的事件
function onChange() {
	emit("onChange", fileList);
}
// 上传中的事件
function onProgress(e, file) {
	emit("onProgress", e, file, fileList);
}
// 上传成功事件
function onSuccess(res, file) {
	emit("onProgress", res, file, fileList);
}
// 上传失败事件
function onError() {
	emit("onError");
}
</script>
<style scoped>
.mask {
	top: 0;
	bottom: 0;
	width: 100%;
	right: 0;
	left: 0;
	position: fixed;
	z-index: 9999;
	opacity: 0.6;
	text-align: center;
	background: rgb(255, 255, 255);
}
h3 {
	margin: -0.5em 0 0;
	position: absolute;
	top: 50%;
	left: 0;
	right: 0;
	-webkit-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
	transform: translateY(-50%);
	font-size: 40px;
	color: rgb(36, 84, 243);
	padding: 0;
}
</style>
