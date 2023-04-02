import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const baseURL = "http://localhost:8080/api"; // 开发
// export const baseURL = "http://www.lab-0.com:8080/api"; // 发布
// export const baseURL = "http://47.100.190.87:8080/api";
// 创建一个 axios 实例
// axios.defaults.withCredentials = true;
var service = axios.create({
	baseURL: baseURL, // 所有的请求地址前缀部分
	timeout: 60000, // 请求超时时间毫秒
	withCredentials: true, // 异步请求携带cookie,(开启会跨域)
	headers: {
		// 设置后端需要的传参类型
		// "Content-Type": "application/json",
		// "Content-Type": "application/x-www-form-urlencoded",
		// token: "your token",
		// "X-Requested-With": "XMLHttpRequest",
	},
});
// const config = {
// 	baseURL: "http://127.0.0.1:8080/api", // 所有的请求地址前缀部分
// };
// const request = {};

// request.get = (url, params, cb) => {
// 	url = config.baseURL + url;
// 	axios.get(url, { params: params }).then(next(cb)).catch(error());
// };

// 添加请求拦截器
service.interceptors.request.use(
	function (config) {
		// 在发送请求之前做些什么
		NProgress.start();
		return config;
	},
	function (error) {
		// 对请求错误做些什么
		NProgress.done();
		console.log(error);
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	function (response) {
		NProgress.done();
		console.log("response: ", response);
		// ElMessage({
		// 	message: response.data.meta.msg,
		// 	type: response.data.meta.code == 0 ? "success" : "error",
		// 	duration: 1000,
		// });
		// 2xx 范围内的状态码都会触发该函数。
		// 对响应数据做点什么
		// dataAxios 是 axios 返回数据中的 data
		const dataAxios = response.data;
		// 这个状态码是和后端约定的
		const code = dataAxios.reset;
		return dataAxios;
	},
	function (error) {
		NProgress.done();
		// 超出 2xx 范围的状态码都会触发该函数。
		// 对响应错误做点什么
		console.log(error);
		return Promise.reject(error);
	}
);
export default service;
