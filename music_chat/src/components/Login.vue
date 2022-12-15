<template>
     <div class="login_box">
    <div class="title">用户登录</div>
    <p>用户名</p>
    <input type="text" placeholder="请输入用户名" id="username" v-model="username">
    <!-- <p>密码</p>
    <input type="text" placeholder="请输入密码" id="username" v-model="username"> -->
    <p>选择头像</p>
    <ul class="avatar" id="login_avatar" ref="ava_ul" >
        <li   v-for="(item, index ) in avatar_list" :key="item.id"  @click="onAvatarChange(index)" :class="{active:index === currentIndex}">
          <img :src= "item.avatarSrc"  alt=""   ondragstart="return false"   >
        </li>
    </ul>
    <button class="weui-btn" id="loginBtn" @click="onLoginClick()">登录</button>
  </div>
</template>

<script>
import Qs from 'qs'

    export default{
        name:'Login',
        data(){
            return{
                currentIndex:0,
                avatar_list:[
                    {id:1,avatarSrc : "images/avatar01.jpg"},
                    {id:2,avatarSrc : "images/avatar02.jpg"},
                    {id:3,avatarSrc : "images/avatar03.jpg"},
                    {id:4,avatarSrc : "images/avatar04.jpg"},
                    {id:5,avatarSrc : "images/avatar05.jpg"},
                    {id:6,avatarSrc : "images/avatar06.jpg"},
                    {id:7,avatarSrc : "images/avatar07.jpg"},
                    {id:8,avatarSrc : "images/avatar08.jpg"},
                    {id:9,avatarSrc : "images/avatar09.jpg"},
                    {id:10,avatarSrc : "images/avatar10.jpg"},

                ],
                username:'',
                choic_ava :'',
            }
        },
        methods:{
            //选择头像
            onAvatarChange(curinx){
                this.currentIndex = curinx
                this.choic_ava = this.avatar_list[curinx].avatarSrc
            },

            //点击登陆
            async onLoginClick(e){
                if(!this.username){
                    alert('请输入用户名')
                    return
                }
                if(this.username==='大厅'){
                    alert('用户名已经存在')
                    return
                }
                // const usern = this.username
                // const c_avatar = this.choic_ava
                // 需要告诉socket io服务，登录
                var params = new URLSearchParams();
                params.append('username',this.username);
                params.append('password','root123');

                // 1. 通过组件实例 this 访问到全局挂载的 $http 属性，并发起Ajax 数据请求
                const { data: res } = await this.$http.post('/api/login',params)
                console.log(res)
                // 2. 判断请求是否成功
                if (res.status !== 0) return alert('login fail')
                // 3. 将请求到的数据存储到 data 中，供页面渲染期间使用
                localStorage.setItem('usern',this.username) //本地存储部分信息
                localStorage.setItem('c_avatar',this.choic_ava)
                this.$router.push('/room')
                localStorage.setItem('token', res.token)
                // 模拟存储 Token 的操作
                return localStorage.setItem('token', 'Bearer xxx')//本地存储登录信息
            }
        }
    }
</script>

<style lang="css" scoped>
    .login_box {
  position: relative;
  top: 100px;
  width: 300px;
  height: 330px;
  margin: 0px auto;
  padding: 50px;
  background: #fff;
  border-radius: 5px;
  box-shadow: #999 0px 2px 10px;
}
.login_box .avatar {
  width: 100%;
  /* height: 400px; */
}
.login_box .avatar::after {
  content: '';
  display: block;
  clear:both;
}
.login_box .avatar li {
  float: left;
  width: 60px;
  height: 60px;
  list-style: none;
  padding: 2px;
  box-sizing: border-box;
}
.login_box .avatar li.active {
  border: 1px solid red;
}
.login_box .avatar li img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}
.login_box .title {
  text-align: center;
  font-size: 22px;
}
.login_box p {
  font-size: 16px;
  padding: 10px 0px;
}
.login_box input, .login_box button {
  display: block;
  width: 100%;
  padding: 8px 0;
}
.login_box button {
  background: #3caf36;
  border: 0px;
  border-radius: 2px;
  color: #fff;
  margin-top: 20px;
  cursor: pointer;
}
</style>

