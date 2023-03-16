import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookies from "vue-cookies";
// import ElementPlus from "element-plus";
// import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// import draggable from "vuedraggable";

const app = createApp(App);
app.provide("vueCookies", VueCookies);
app.use(router);
// app.use(ElementPlus, {
// 	locale: zhCn,
// });
// app.use(Vue3DraggableResizable);
// app.use(draggable);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}

app.mount("#app");
