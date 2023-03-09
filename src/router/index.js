import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
	{
		name: "登录注册页",
		path: "/",
		component: () => import("../views/LoginAndRegister.vue"),
	},
	{
		name: "主页",
		path: "/home",
		component: () => import("../views/Home.vue"),
		redirect: "/home/files",
		children: [
			{
				name: "文件",
				path: "/home/files",
				icon: "Document",
				component: () => import("../views/Files.vue"),
			},
			{
				name: "相册",
				path: "/home/album",
				icon: "Picture",
				component: () => import("../views/Album.vue"),
			},
			{
				name: "收藏夹",
				path: "/home/favorites",
				icon: "Star",
				component: () => import("../views/Favorites.vue"),
			},
			{
				name: "共享文件",
				path: "/home/shareFiles",
				icon: "Connection",
				component: () => import("../views/ShareFiles.vue"),
			},
			{
				name: "我的分享",
				path: "/home/myShare",
				icon: "Share",
				component: () => import("../views/MyShare.vue"),
			},
			{
				name: "回收站",
				path: "/home/recycle",
				icon: "Delete",
				component: () => import("../views/Recycle.vue"),
			},
		],
	},
	{
		name: "Draggable",
		path: "/draggable",
		component: () => import("../views/DraggableTree.vue"),
	},
];

const router = createRouter({
	routes,
	history: createWebHashHistory(),
});

export default router;
