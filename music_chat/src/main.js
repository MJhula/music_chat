import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import router from './router'

//socket.io
import VueSocketIO from 'vue-3-socket.io'
import io from 'socket.io-client';

const app =  createApp(App)
app.use(router)


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
