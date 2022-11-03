<template>

<div class="container" >

  <div class="box">
      <div class="box-hd" >
        <!-- <div id="chatName"></div> -->
        <!-- <h3>群聊(<span id="userCount">99</span>)</h3> -->
        <h3 id="chatName">{{to_user}}</h3>
      </div>
      <div class="box-bd" ref="boxbdRef">
        <div v-for="(item,index) in msg_list" :key="index" >
          <!-- 如果是系统消息则渲染 系统消息 -->
          <p v-if="item.type === 'system'" class="system">
            <span class="content">{{item.user}}加入群聊</span>
          </p>

          <!--  如果是自己的消息 则渲染自己的对话框-->
          <div v-else-if="item.type === 'message-box' && item.sender === login_user" class="message-box">
            <div class=" my message">
              <img :src="item.avatar1" alt="" class="avatar">
              <div class="content">
                <div class="bubble">
                  <div class="bubble_cont">{{item.msg}}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 其他人消息 -->
          <div v-else class="message-box">
            <div class="other message">
            <img :src="item.avatar1" alt="" class="avatar">
            <!-- 私聊不显示nickname了 -->
            <div class="nickname">{{item.user}}</div>
            <div class="content">
              <div class="bubble">
                <div class="bubble_cont">{{item.msg}}</div>
                </div>
              </div>
            </div>
          </div>
          </div>
      </div>
      <!-- 聊天窗口底部 -->
      <div class="box-ft">
        <!-- 工具栏 -->
        <div class="toolbar">
          <a class="face" href="javascript:;" title="表情"></a>
          <!-- <a class="screen-cut" href="javascript:;" title="暂不支持截屏"></a> -->
          <a href="javascript:;" title="图片" class="file">
            <label for="file"></label><input type="file" id="file" style="display:none;"> 
          </a>
        </div>
        <!-- 内容输入区 -->
        <div class="content">
          <!-- div添加contenteditable即可编辑 -->
          <div name="" id="content" class="text" ref="inputMsg" contenteditable></div>
        </div>
        <!-- 发送按钮 -->
        <div class="action">
          <span class="desc">按下Ctrl+Enter发送</span>
          <a class="btn-send" id="btn-send" href="javascript:;" @click="onSendClick">发送</a>
        </div>
      </div>
  </div>

</div>

</template>

<script>
    export default{
        name:'ChatWindow',
        data(){
          return{
          pmsg_len : 0,

          msg_list:[
            {type:'message-box',sender:'百花',avatar1:"images/avatar02.jpg", to: '浅草', avatar2:"images/avatar08.jpg",msg:'你好浅草，我是百花', time:2022},
          ],

          bocast_massage:[
            {type:'system', user:'sys', avatar:"images/avatar06.jpg",msg:'sys for test', time:2022},
            {type:'message-box',user:'百花' ,avatar:"images/avatar02.jpg" ,msg:'百花 for test12', time:2022},
            {type:'message-box',user:'浅草',avatar:"images/avatar08.jpg" ,msg:'for test145', time:2022},
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
          }
          
        },  
        props:{
            // msg_list:{
            //     require:true,
            //     // default:[
            //     //     {type:'message-box',sender:'百花',avatar1:"images/avatar02.jpg", to: '浅草', avatar2:"images/avatar08.jpg",msg:'你好浅草，我是百花', time:2022},
            //     // ]
            // },
            login_user:{
              type:String,
              require:true,
            },
            login_user_ava:{
              require:true,
            },

            to_user:{
              type:String,
              require:true,
            },
            to_user_ava:{
              require:true,
            },
        },  

        watch:{
          to_user:{
            handler(newto,oldto){
              if(newto == '群聊'){
                this.msg_list=this.bocast_massage;
              }
              else{
                this.msg_list=this.private_massage.filter(x => (x.sender ==  newto )||(x.to ==newto) )
              }
              // console.log(newto,oldto)
            },
            immediate:true
          },

          pmsg_len:{
            handler(newlen,oldlen){
              console.log(newlen)
              this.msg_list=this.private_massage.filter(x => (x.sender ==  this.to_user )||(x.to ==this.to_user) )
              // console.log(newto,oldto)
            },
            immediate:true,
          }
        },

        mounted(){

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
          }),

          this.sockets.subscribe('sendMessageToOne', data => {
            // 接受个人信息
            console.log('private'+ data)
            this.private_massage.push(data)
            this.pmsg_len = this.private_massage.length
          })

        },

        methods:{
            onSendClick(){
            if(this.to_user == "群聊"){
              this.$socket.emit('sendMessage',{
                type:'message-box',
                user:this.login_user,
                avatar:"images/avatar02.jpg",
                msg : this.$refs.inputMsg.innerText,
                time:2022,
              });
            }
            //私聊内容
            else{
              console.log(this.$socket.id)
              const sendToOneMsg = {
                type:'message-box',
                sender:this.login_user,
                avatar1:this.login_user_ava,
                to: this.to_user, 
                avatar2:this.to_user_ava,
                msg:this.$refs.inputMsg.innerText, 
                time:2022
              }
              this.private_massage.push(sendToOneMsg)
              this.pmsg_len = this.private_massage.length
              console.log(this.private_massage)
              this.$socket.emit('sendMessageToOne',sendToOneMsg)
            }
            
            this.$refs.inputMsg.innerText = ""
          },
        }
    }
</script>

<style lang="css" scoped>
.box-bd .avatar {
  width: 40px;
  height: 40px;
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

 .box {
  /* float: right; */
  display: inline-block;
  height: 100%;
  width: calc(100% - 280px);
  min-width: 420px;
  background: #eeeeee;
  padding: 10px;
  box-sizing: border-box;
}

.box .box-hd {
  text-align: center;
  border-bottom: 1px solid #d6d6d6;
  padding-bottom: 10px;
}
.box .box-bd {
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

.container .user-list .active{
  background: #3a3f45;
}
.container .avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  display: inline-block;
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