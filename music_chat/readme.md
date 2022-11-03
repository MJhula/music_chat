npm init vite-app music_chat

cd music_chat
npm i


login.vue

npm install vue-router@4.0.13  -S
npm install axios@0.21.0  -S

点击排他
v-bind:class="{active:isActive}", data:{isActive:true} data 中若isActive为true则class="acrive",显示，为false则不见，根据style的样式，将改变文本样式。

vue3 使用socketio：
https://blog.csdn.net/ajiejie66/article/details/123706723

服务端：
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.send('<h1>这是一个socket服务</h1>');
});
 
io.on('connection',function(socket) {
  //接收数据
  socket.on('login', function (obj) {                
      console.log(obj.username);
      // 发送数据
      socket.emit('relogin', {
        msg: `你好${obj.username}`,
        code: 200
      });  
  });
});
 
http.listen(8848, function(){
  console.log('listening on *:8848');
});

启动服务端：
node app.js

客户端：
npm install vue-3-socket.io --save
npm install socket.io-client --save

在main.js中：
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-3-socket.io'
import io from 'socket.io-client';
const socketio = new VueSocketIO({
    debug: true,
    connection: io('http://xxxx:8848',{ transports : ['websocket'] }),
	//http:自己的服务：端口
    extraHeaders: {"Access-Control-Allow-Origin": '*'},
});
const app = createApp(App)
app.use(store)
app.use(router)
app.use(socketio)
app.mount('#app')

客户端页面监听：
mounted(){
    this.sockets.subscribe('relogin', (data) => {
      console.log("获取到他发给我的",data)
    })
}

可在页面使用按键发送：
send(){
      console.log("我发送消息给服务端");
      //发送信息给服务端
      this.$socket.emit('login',{
        username: 'ajj',
        password: '123456'
      });
 },


socket.io发送给指定的客户端
服务器对于每一个已经连接的客户端，会用存储在io.sockets.sockets数组里，然后可以根据设置的username的属性去找到这个客户端
http://www.cnblogs.com/ajccom/archive/2013/07/18/3197809.html
socket.emit('message',"this is a test");//发送给对应的客户端

io.sockets.emit('message',"this is a test");//发送给所有客户端

socket.broadcast.emit('message',"this is a test");//发送给除了发送者之外的所有客户端

socket.broadcast.to('game').emit('message','nice game');//发送给房间game中除了发送者的所有客户端

io.sockets.in('game').emit('message','cool game');//
发送给房间game中的所有客户端，包括发送者


io.sockets.socket(socketid).emit('message','for your eyes only');//发送给指定socketId的客户端

http://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender-socket-io

http://cnodejs.org/topic/4feb37348a7cb2d22b4edf96

https://github.com/leizongmin/qchat/blob/master/lib/room.js

http://cnodejs.org/topic/5153e2b85dff253b372ad193

http://blog.fens.me/nodejs-socketio-chat/


坑1：响应式：
chatroom.vue 数据更新  页面不同步更新
watch private_msg监听不到
暂时解决：添加一个private_msg数组长度的len变量   watch监听这个len即可
1.
push()，pop()，shift()，unshift()，splice()，sort()，reverse()可被vue检测到 ，
filter(), concat(), slice() 它们不会变更原始数组，而总是返回一个新数组。使用这些方法会造成数据双向绑定失效。。


2.set函数：原理：对象是引用类型，vue不一定能监控到 所以当我们新建一个对象并赋值给oldObj字段的话，直接改变了它的指向地址
this.$set(this,'oldArray',newArray);