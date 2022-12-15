const express = require('express')
const app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server,{cors:true})
// var path = require('path')
// 记录所有已经登录过的用户
const users = [{username:'大厅', avatar:"images/avatar07.jpg"}]

server.listen(3001, () => {

  console.log('server running at http://127.0.0.1:3001')
})

// express处理静态资源
// 把public目录设置为静态资源
app.use(require('express').static('public'))

app.get('/', function (req, res) {
  // res.sendFile(path.join(__dirname, '/index.html'))
  res.redirect('/index.html')
})

const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({extended    :    false}))
// 一定要在路由之前，封装 res.cc 函数
app.use((req, res, next) => {
  // status 默认值为 1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

//配置全局的JWT身份认证中间件
const config = require('./config')
const expressJWT = require('express-jwt')

// 通过这个中间件可解析token 
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({secret:config.jwtSecreKey}).unless({path:[/^\/api\//]}))


// 导入并使用用户登陆的路由模块:
const userRouter = require('./router/user.js')
app.use('/api',userRouter)
// 导入并使用个人中心的路由模块:
const userinforRouter = require('./router/userinfo')
app.use('/my', userinforRouter)

// ，如果客户端发送过来的 Token 字符串过期或不合法，会产生一个解析失败的错误，影响项目的正常运行
// 通过 Express 的错误中间件，捕获这个错误并进行相关的处理
const joi = require('joi')
app.use((err, req, res, next)=>{
    // 数据验证失败
    if(err instanceof joi.ValidationError) return res.cc(err)
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    res.cc(err)
})

io.on('connect', function (socket) {
  // 监听用户登录的功能
  console.log("a user conneted")
  socket.on('login', data => {
    console.log(data)
    // 如果用户已经登录
    const user = users.find(item => item.username === data.username)
    if (user) {
      socket.emit('loginError', { msg: '登录失败' })
      console.log('登录失败')
    } else {
      // data.id = socket.id
      users.push(data)
      socket.emit('loginSuccess', data)
      console.log('登录成功')
      // 广播所有用户有用户添加
      io.emit('addUser', data)
      // 告诉所有的用户，目前聊天室中有多少人 更新用户列表
      io.emit('UpdatauserList', users)

      // 把登录成功的用户名和头像存储起来
      socket.username = data.username
      socket.avatar = data.avatar
      //
      //  io.emit('addUser',{usern:socket.username, ava : socket.avatar})
    }
  })

  // 用户断开连接的功能
  socket.on('disconnect', () => {
    // 把当前用户的信息从users中删除
    const idx = users.findIndex(item => item.username === socket.username)
    console.log(socket.username + '离开了')
    users.splice(idx, 1)
    // 告诉所有人，有人离开了聊天室
    io.emit('delUser', {
      username: socket.username,
      avatar: socket.avatar
    })
    // 告诉所有人，userlist发生更新
    io.emit('userList', users)
  })

  // 用户发送消息的功能
  socket.on('sendMessage', data => {
    console.log(data)
    // 广播给所有用户
    io.emit('receiveMessage', data)
  })

  // 监听图片聊天信息
  socket.on('sendImage', data => {
    // 广播给所有用户
    if (data.toName === '大厅') {
      io.emit('receiveImage', data)
    } else {
      // 广播给指定用户
      var toSocket = null
      for (const key in io.sockets.sockets) {
        if (io.sockets.sockets[key].username === data.toName) {
          toSocket = key
          break
        }
      }
      if (toSocket) {
        // 发送给指定用户
        socket.to(toSocket).emit('receiveImage', data)
        // 发送给自己
        socket.emit('receiveImage', data)
      } else {
        data.msg = 0
        socket.emit('receiveImage', data)
      }
    }
  })

  // 私聊功能的实现
  // socket.on("sendMessageToOne", (anotherSocketId, msg) => {
  //   console.log(22)
  //   console.log(io.sockets.sockets)
  //   console.log(anotherSocketId,msg)
  //   socket.to(anotherSocketId).emit("sendMessageToOne", socket.id, msg);
  // });

  socket.on('sendMessageToOne', data => {
    // 广播给指定用户
    
    var toSocket = null
    // for (const key in io.sockets.sockets) {  //失效
    //   console.log(io.sockets.sockets[key].username)
    //   if (io.sockets.sockets[key].username === data.to) {
    //     toSocket = key
    //     break
    //   }
    // }
    var SocketConnections=io.sockets.sockets
    // console.log(io.sockets.sockets)
    SocketConnections.forEach(s=>{
        /* 判断该对象是不是我们需要发送的那个人 */
      // console.log("data:"+data.to)
      // console.log("idid username:"+s.username)
      if(s.username==data.to){
        /* 发送数据 */
        console.log("idid :"+s.id)
        io.to(s.id).emit('sendMessageToOne',data);
      }
    });

    // console.log("tosocket:"+toSocket)
    // if (toSocket) {
    //   // 发送给指定用户
    //   socket.to(toSocket).emit('receiveMessage', data)
    //   // 发送给自己
    //   socket.emit('receiveMessage', data)
    // }
  })
})
