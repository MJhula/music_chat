import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import router from './router'
// 导入 axios
import axios from 'axios'

//socket.io
import VueSocketIO from 'vue-3-socket.io'
import io from 'socket.io-client';

const app =  createApp(App)
app.use(router)

// 全局配置 axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:3001'
// 将 axios 挂载为全局的 $http 自定义属性
app.config.globalProperties.$http = axios

const socketio = new VueSocketIO({
    debug: true,
    connection: io('http://localhost:3001',{ transports : ['websocket'] }),
	//http:自己的服务：端口
    extraHeaders: {"Access-Control-Allow-Origin": '*'},
});
// console.log(socket)
//便于在任意位置获取到 socket 对象
app.config.globalProperties.$socket = socketio

app.use(socketio)

app.mount('#app')
