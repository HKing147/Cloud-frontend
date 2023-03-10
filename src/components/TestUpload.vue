<template>
	<!-- // 这里是template中代码 -->
	<div
		class="middle-ccc"
		:class="[{ 'drop-shadow': dropType === 'ccc' }]"
		style="width: 600px; height: 1000px; background: blue"
		@dragenter.stop.prevent="handlePictureBoxDragenter('ccc')"
		@dragover.stop.prevent=""
		@dragleave.stop.prevent="handlePictureBoxDragleave"
		@drop.stop.prevent="handlePictureBoxDrop($event, 'ccc')"
	>
		<!-- // 内部代码省略 -->
	</div>
</template>

<script setup>
// 这里是vue3的js处理流程
const fileArrPromiseResolve = ref(null); // 图片文件上传的promise事件
const fileArrPromise = ref(null);

// 设置文件加载的promise
const initFileArrPromise = () => {
	fileArrPromise.value = new Promise((resolve) => {
		fileArrPromiseResolve.value = resolve;
	});
};

// 文件拖拽dragenter进入
const handlePictureBoxDragenter = (type) => {
	console.log("dragenter");
	// 这里传入一个10ms的延迟锁，让dragleave在enter延迟后触发
	pictureBoxLock.value = true;
	setTimeout(() => {
		pictureBoxLock.value = false;
	}, 10);
	// dropType.value是文件拖拽进选中范围的高亮效果
	dropType.value = type;
};

// 文件拖拽dragleave离开
const handlePictureBoxDragleave = () => {
	console.log("dragleave");
	// 多张图片拖拽进入的延迟锁时返回
	if (pictureBoxLock.value) return;
	dropType.value = "";
};

// 文件拖拽drop落下
const handlePictureBoxDrop = async (e) => {
	console.log(e);
	dropType.value = "";
	// 判断file是文件夹还是文件
	const isDirectory = e.dataTransfer.items[0].webkitGetAsEntry().isDirectory;
	// 这里的file给了一个初始值，如果是单张或多张图片拖拽可以直接获取其files属性
	let file = e.dataTransfer.files;
	if (isDirectory) {
		// 这里对promise进行一个初始化
		initFileArrPromise();
		// 这里获取到文件的一个file信息
		const fileItems = e.dataTransfer.items[0].webkitGetAsEntry();
		// 这里是对fileItems处理，返回的是所有文件的数组
		file = await getFileDirectory(fileItems);
	}
	// 如果未能读取到想要的图片或者文件夹为空，都直接提示错误返回
	if (!file || !file.length) {
		ElMessage({ message: "图片上传错误", type: "error" });
		return;
	}
	console.log(file, "file");
};

// 这里对文件处理通过promise进行处理，为了确保文件夹中最后一个文件读取完成后再进行操作
const getFileDirectory = (fileItems) => {
	return new Promise((resolve) => {
		fileTypeLoop(fileItems, "", []);
		fileArrPromise.value.then((file) => {
			resolve(file);
		});
	});
};
//	TODO: 这段代码过于复杂，后面会考虑优化
// 文件夹上传解析，进行了递归和类型划分，返回fileArr数组
const fileTypeLoop = (fileItem, path, fileArr, loopOver = false) => {
	let dirReader = null;
	// 如果fileItem是文件而不是文件夹进入
	if (fileItem.isFile) {
		fileItem.file((file) => {
			// fileTypeFilter方法是对你想要哪一类型的文件，我这里只想要图片格式
			const fileFilter = file.type && "image/gif,image/jpeg,image/jpg,image/png,image/bmp".indexOf(file.type) > -1;
			if (fileFilter) {
				// 这里将路径重新进行整理
				fileItem.path = path + file.name;
				// 重新创建file数据格式，加入type和path放入到fileArr中
				const newFile = new File([file], fileItem.path, { type: file.type });
				fileArr.push(newFile);
			}
			// 如果文件夹读到最后一个时，将fileArr数组通过resolve返回出去
			if (loopOver) fileArrPromiseResolve.value(fileArr);
		});
	} else if (fileItem.isDirectory) {
		// 如果fileItem是文件夹,读取文件夹内容再进行处理
		dirReader = fileItem.createReader();
		dirReader.readEntries(onReadEntries);
	}
	// 通过递归解析出文件夹中所有文件，readEntries正常只能读出100个文件
	// 项目中一个文件中有280个文件，能成功读取出
	function onReadEntries(entries) {
		for (let i = 0; i < entries.length; i++) {
			// 判断是否是最后一个文件，是的话就让loopOver为true
			if (i === entries.length - 1 && !entries[i].isDirectory && entries.length < 100) loopOver = true;
			// 进行递归处理
			fileTypeLoop(entries[i], path, fileArr, loopOver);
		}
		// 如果entries.length则说明文件中可能不止100个文件，这个时候需要继续嵌套读取
		if (entries.length) dirReader.readEntries(onReadEntries);
	}
};
</script>

<style lang="scss" scoped>
.drop-shadow {
	box-shadow: 0px 0px 12px #18bae3;
}
</style>
