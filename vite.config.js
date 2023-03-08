import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import path from "path";

const pathSrc = path.resolve(__dirname, "src");
// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": pathSrc,
			// "@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	plugins: [
		vue(),
		// 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
		AutoImport({
			imports: ["vue"],
			resolvers: [
				ElementPlusResolver(),
				// 自动导入图标组件
				IconsResolver({
					prefix: "Icon",
				}),
			],
			dts: path.resolve(pathSrc, "components.d.ts"),
		}),
		Components({
			resolvers: [
				// 自动注册 Element Plus 组件
				ElementPlusResolver(),
				// 自动注册图标组件
				IconsResolver({
					enabledCollections: ["ep"],
				}),
			],

			dts: path.resolve(pathSrc, "auto-imports.d.ts"),
		}),
		Icons({
			autoInstall: true,
		}),
	],
});
