// import { createRouter, createWebHashHistory } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import VueCookies from "vue-cookies";

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
				path: "/home/collected",
				icon: "Star",
				component: () => import("../views/Collected.vue"),
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
			{
				name: "文件",
				path: "/home/files/:currentDir*",
				icon: "Document",
				component: () => import("../views/Files.vue"),
			},
			{
				name: "个人中心",
				path: "/home/profile",
				component: () => import("../views/Profile.vue"),
			},
		],
	},
	{
		name: "Admin",
		path: "/admin",
		component: () => import("../views/Admin.vue"),
		redirect: "/admin/statistics",
		children: [
			{
				name: "统计",
				path: "/admin/statistics",
				icon: "PieChart",
				component: () => import("../views/Statistics.vue"),
			},
			{
				name: "用户管理",
				path: "/admin/managerUser",
				icon: "User",
				component: () => import("../views/ManagerUser.vue"),
			},
			{
				name: "文件管理",
				path: "/admin/managerFile",
				icon: "Files",
				component: () => import("../views/ManagerFile.vue"),
			},
		],
	},
	{
		name: "AdminLogin",
		path: "/admin/login",
		component: () => import("../views/AdminLogin.vue"),
	},
	{
		name: "Share",
		path: "/share/:shareUrl",
		component: () => import("../views/Share.vue"),
	},
	// {
	// 	name: "Manager",
	// 	path: "/manager",
	// 	component: () => import("../views/Manager.vue"),
	// },
	{
		name: "FilePreview",
		path: "/filePreview/:fileUrl*",
		component: () => import("../components/FilePreview.vue"),
	},
	{
		name: "Draggable",
		path: "/draggable",
		component: () => import("../components/DraggableTree.vue"),
	},
	{
		name: "Draggable",
		path: "/testUpload",
		component: () => import("../components/TestUpload.vue"),
	},
	{
		name: "Draggable",
		path: "/dragUpload",
		component: () => import("../components/DragUpload.vue"),
	},
	{
		name: "Chat",
		path: "/chat",
		component: () => import("../views/Chat.vue"),
	},
];

const router = createRouter({
	routes,
	// history: createWebHashHistory(), // 地址栏会有#号
	history: createWebHistory(),
});

// 路由守卫
router.beforeEach((to, from, next) => {
	console.log("to: ", to);
	console.log("from: ", from);
	console.log("next: ", next);
	if (to.fullPath == "/" || to.fullPath == "/admin/login" || to.fullPath.startsWith("/share")) {
		// 登录注册页
		next();
		return;
	} else {
		// 检查是否有token
		var token = VueCookies.get("token");
		// 检查是否有admin_token
		var admin_token = VueCookies.get("admin_token");
		console.log("token: ", token);
		if (token == null && admin_token == null && !to.fullPath.startsWith("/admin")) {
			router.push("/");
			ElMessage({
				message: "请先登录！！！",
				type: "error",
			});
		} else {
			console.log("admin_token: ", admin_token);
			if (admin_token == null && to.fullPath.startsWith("/admin")) {
				router.push("/admin/login");
				ElMessage({
					message: "请先登录！！！",
					type: "error",
				});
			}
		}
	}
	next();
});

export default router;
