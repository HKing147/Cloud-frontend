<script setup></script>

<template>
	<Suspense>
		<div>
			<router-view />
		</div>
	</Suspense>
</template>

<style lang="scss" scoped>
div {
	height: 100%;
	width: 100%;
	min-height: 100%;
	max-height: 100%;
	margin: 0;
	padding: 0;
	// list-style: node;
	// text-decoration: node;
	// outline: none;
}

/* .loginandregister {
	position: fixed;
	height: 100%;
	width: 100%;
} */
/* .wrapper {
	background: url("./assets/img/face.png");
	width: 100%;
	height: 100%;
	position: fixed;
	background-size: 100% 100%;
} */
</style>
