<template>
    <!-- 聊天盒子 -->
  <div class="container">
    <!-- 左侧用户列表 -->
    <div class="user-list">
      <div class="header">
        <div class="avatar">
          <img :src="login_ava" alt="" class="img avatar_url">
        </div>
        <div class="info">
          <h3 class="username">{{login_user}}</h3>
        </div>
      </div>
      <div class="title">
        <h3>用户列表</h3>
      </div>
      <ul>
        <li class="user" v-for="(item , index) in user_list" :key="index" @click="onClickUser(index)" :class="{active:index === curUserIndex}">
          <div class="avatar"><img :src="item.avatar" alt=""></div>
          <div class="name">{{item.username}}</div>
        </li>
      </ul>
    </div>
    <!-- 聊天主窗口 -->
    <chat-window-vue   :login_user="login_user" :login_user_ava="login_ava"  :to_user="to_user" :to_user_ava="to_user_avatar"></chat-window-vue>
  </div>

</template>

<script>
import ChatWindowVue from './subcomponents/ChatWindow.vue'
    export default{
        name: 'Room',
        components:{
          ChatWindowVue,
        },
        data(){
            return{
                to_user:'大厅',
                to_user_avatar:'images/avatar02.jpg',
                curUserIndex:0,
                login_user:"百花",
                login_ava:"images/avatar02.jpg",
                user_list:[
                  {username:'大厅', avatar:"images/avatar08.jpg"},
                  {username:'test', avatar:"images/avatar06.jpg"}
                ],
                bocast_massage:[
                  // {type:'system', user:'sys', avatar:"images/avatar06.jpg",msg:'sys for test', time:2022},
                  // {type:'message-box',user:'百花' ,avatar:"images/avatar02.jpg" ,msg:'百花 for test12', time:2022},
                  // {type:'message-box',user:'浅草',avatar:"images/avatar08.jpg" ,msg:'for test145', time:2022},
                ],
                private_massage:[
                  //后续优化可以根据用户名找头像
                  {type:'message-box',sender:'百花',avatar1:"images/avatar02.jpg", to: '浅草', avatar2:"images/avatar08.jpg",msg:'你好浅草，我是百花', time:2022},
                  {type:'message-box',sender:'浅草',avatar1:"images/avatar08.jpg", to: '百花', avatar2:"images/avatar02.jpg",msg:'百花你好，我是浅草', time:2022},
                  {type:'message-box',sender:'百花',avatar1:"images/avatar02.jpg", to: 'asfg', avatar2:"images/avatar05.jpg",msg:'你好asfg，我是百花', time:2022},
                  {type:'message-box',sender:'asfg',avatar1:"images/avatar05.jpg", to: '百花', avatar2:"images/avatar02.jpg",msg:'百花你好，我是asfg', time:2022},
                  {type:'message-box',sender:'百花',avatar1:"images/avatar02.jpg", to: 'ggff', avatar2:"images/avatar09.jpg",msg:'你好ggff，我是百花', time:2022},
                  {type:'message-box',sender:'ggff',avatar1:"images/avatar09.jpg", to: '百花', avatar2:"images/avatar02.jpg",msg:'百花你好，我是ggff', time:2022},
                ],
                to_msg:[],
            }
        },
        mounted(){
          this.login_user = localStorage.getItem('usern')
          this.login_ava = localStorage.getItem('c_avatar') 
            
          this.$socket.emit('login', {
            username :this.login_user,
            avatar:this.login_ava
          })

          this.sockets.subscribe('loginError', data=>{
            alert("用户名已存在")
            //移除 Token
            localStorage.removeItem('token')
            this.$router.push('/login')
          })
          // this.sockets.subscribe('loginSuccess', data=>{
          //   this.login_user = data.login_user,
          //   this.login_ava = data.login_ava
          // })

          this.sockets.subscribe('UpdatauserList', data=>{
            // console.log(data)
            this.user_list = data
          })

          this.sockets.subscribe('delUser', data=>{
            // console.log(data)
            const idx = this.user_list.findIndex(item => item.username === data.username)
            this.user_list.splice(idx, 1)//剔除
            // this.user_list = data
          })

          //消息框
          this.sockets.subscribe('addUser', data => {
            // 添加一条系统消息
            this.bocast_massage.push({type:'system',user:data.username, avatar:"",msg:"",time:2022})
            // scrollIntoView()
          })

          //接收群发消息
          this.sockets.subscribe('receiveMessage', data => {
            // 添加一条系统消息
            this.bocast_massage.push(
              data
              // {type:data.type,
              // user:data.user, 
              // avatar:data.avatar,
              // msg:data.msg,
              // time:2022}
              )
            // scrollIntoView()
          })

          this.sockets.subscribe('sendMessageToOne', data => {
            // 接受个人信息
            console.log('private'+ data)
            this.private_massage.push(data)
          })

        },

        methods:{
          onClickUser(curIndex){
            this.curUserIndex = curIndex
            this.to_user =  this.user_list[curIndex].username
            // if(this.to_user == '群聊'){

            // }
            // else{
            //   this.to_msg=this.private_massage.filter(x => (x.sender ==  this.to_user)||(x.to ==this.to_user) )
            //   // console.log(this.to_msg)
            // }
          },

        },
    
    }
</script>

<style lang="css" scoped>
.user-list img, .box-bd .avatar {
  width: 40px;
  height: 40px;
}

.container {
  margin: 0px auto;
  max-width: 1000px;
  min-width: 700px;
  width: 100%;
  height: 100%;
  min-height: 720px;
  border-radius: 3px;
}

.container .user-list {
  box-sizing: border-box;
  padding: 15px;
  float: left;
  height: 100%;
  width: 280px;
  background: #2e3238;
  color: #fff;
  font-size: 16px;
}
.user-list ul {
  height: 580px;
  overflow: auto;
  /* scrollbar-width: 0px; */
}

.container .header, .container .title {
  border-bottom: 1px solid #26292e;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.container h3 {
  /* font-size: 10px; */
  font-weight: normal;
  /* border-top: 1px solid #f2f2f2; */
}
.container .avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  display: inline-block;
}
.info, .user .name{
  float: right;
  width: 190px;
  height: 40px;
  line-height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.container .user-list .user {
  list-style: none;
  padding: 10px 0px;
}
.container .box {
  /* float: right; */
  display: inline-block;
  height: 100%;
  width: calc(100% - 280px);
  min-width: 420px;
  background: #eeeeee;
  padding: 10px;
  box-sizing: border-box;
}

.container .box .box-hd {
  text-align: center;
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 10px;
}
.container .box .box-bd {
  width: 100%;
  height: 450px;
  overflow: auto;
  padding: 10px 0px;
}

/* 设置滚动条样式 */
/* 滚动条整体样式 */
.user-list ul::-webkit-scrollbar, .container .box .box-bd::-webkit-scrollbar, .box-ft #content::-webkit-scrollbar {
  width: 5px;
  height: 1px;
}
/* 滚动条里面的小方块 */
.user-list ul::-webkit-scrollbar-thumb, .container .box .box-bd::-webkit-scrollbar-thumb, .box-ft #content::-webkit-scrollbar-thumb {
  border-radius: 4px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #f2f2f2;
}
/* 滚动条里面的轨道 */
.user-list ul::-webkit-scrollbar-track, .container .box .box-bd::-webkit-scrollbar-track, .box-ft #content::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: #fff;
}

.box-ft {
  border-top: 1px solid #d6d6d6;
  width: 100%;
  height: 180px;
  /* overflow: hidden; */
}
.box-ft .toolbar {
  width: 100%;
  height: 40px;
  padding: 5px;
  box-sizing: border-box;
}
.box-ft .toolbar label {
  display: inline-block;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.box-ft .action {
  float: right;
  height: 40px;
  font-size: 12px;
  color: #9b9b9b;
}
.box-ft .action .btn-send{
  /* width: 40px; */
  display: inline-block;
  padding: 2px 25px;
  background: #fcfcfd;
  color: black;
  text-decoration: none;
  border: 1px solid #9b9b9b;
  font-size: 16px;
  border-radius: 3px;
}
.box-ft .action .btn-send:hover {
  background: #f8f8f8;
}
.box-ft .content, .box-ft #content {
  height: 120px;
  border: 0px solid black;
  background: #eeeeee;
  outline: none;
  width: 100%;
  font-size: 18px;
  overflow: auto;
}
.box-ft .toolbar a {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url(/images/icon.png);
  background-size: 487px 462px;
}
.box-ft .toolbar a.face {
  background-position: -404px -398px;
}
.box-ft .toolbar a.screen-cut {
  background-position: -30px -432px;
}
.box-ft .toolbar a.file {
  /* background-size: 487px 462px; */
  background-position: -120px -432px;
}
.box-bd .message-box {
  padding: 10px;
  position: relative;
}
.box-bd .message-box .content {
  max-width: 400px;
  display: inline-block;
  padding: 5px 10px;
  box-sizing: border-box;
  line-height: 30px;
  vertical-align: top;
  background: #fff;
  border-radius: 4px;
  position: relative;
}
/* 添加消息框中的小三角 */
.box-bd .message-box .other .content::before {
  position: absolute;
  top: 14px;
  border: 6px solid transparent;
  content: "";
  left: -10px;
  border-right-color: #fff;
  border-right-width: 4px
}
.box-bd .message-box .my .content::after {
  position: absolute;
  left: 100%;
  top: 14px;
  border: 6px solid transparent;
  content: "";
  border-left-color: #b2e281;
  border-left-width: 4px
}

.box-bd .message-box .my .avatar, .box-bd .message-box .my .content{
  float: right;
  margin-right: 10px;
  background: #b2e281;
}
.box-bd .message-box .my::after {
  content: "";
  display: block;
  clear: both;
}

.nickname {
  position: absolute;
  top: -10px;
  color: #b7b7b7;
  font-size: 12px;
}
.system {
  text-align: center;
  color: #b7b7b7;
  font-size: 12px;
}
.system.leave {
  color: #cc3322;
}
.bubble_cont img {
  max-width: 300px;
}

ul .user {
  border-bottom: 1px solid #26292e;
}
.container .user-list .active{
  background: #3a3f45;
}

.bubble_toName {
  position: absolute;
  font-size: 12px;
  color: gray;
  top: 0;
  left: 100%;
  width: 30px;
  height: 40px;
  line-height: 40px;
  margin-left: 10px;
}
.my .bubble_toName {
  left: -40px;
}
</style>