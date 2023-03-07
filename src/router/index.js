import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
	{
		name: "登录注册页",
		path: "/",
		component: () => import("../views/LoginAndRegister.vue"),
	},
];

const router = createRouter({
	routes,
	history: createWebHashHistory(),
});

export default router;
