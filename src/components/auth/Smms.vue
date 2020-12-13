<template>
  <div class="smms">
      <div class="login">
          <h3>登入</h3>
          <div  class="username" >
            <input type="text" placeholder="账户" v-model="username">
          </div>

          <div class="password" >
            <input type="password" placeholder="密码" v-model="password">
          </div>

          <div class="remember">
            <input type="checkbox" id="inputId" v-model="rememberMe">
            <label for="inputId"></label>
            <span @click.stop="clickRememberMe">记住我</span>
          </div>

          <div class="sign">
            <input type="button" value="登入" @click="sign">
          </div>

          <div class="m3nu">
            <router-link class="a" to="/m3nu">菜单</router-link>
          </div>

      </div>
  </div>
</template>


<script>
import HttpApi from '../../util/http.js'
import qs from 'qs'

const {ipcRenderer} = require('electron')
const remote = require('electron').remote
export default {
  name: 'Smms',
  data(){
    return {
      username:'ch3ng',
      password: "ch3ng4smms",
      rememberMe: false,
    }
  },
  methods:{
    sign(){

      HttpApi.post(
        '/api/v2/token',
        qs.stringify({
          username: this.username,
          password: this.password,
        }),
      )
      .then(response=>{
        if(response.success){
          // this.$store.commit("setToken",response.data.token);
          remote.getGlobal('cache').token = response.data.token;
          remote.getGlobal('cache').pi = './smms/Main';
          ipcRenderer.send("pi-win");
        }else{
          throw response.message;
        }
      }).catch(err => {
        let myNotification = new Notification('失败',{
                body: err,
                silent: true,
            });
      });
    }
  },
  created(){
    this.$store.commit("setUri","https://sm.ms/api/v2");
    HttpApi.defaults.baseURL = "https://sm.ms";
  }
}
</script>

<style scoped>
.smms{
  width: 100%;
  height: 100%;
  padding-top: 15%;
}

.login{
  width: 70%;
  height: 60%;
  position: absolute;
  left: 15%;
  /* top: 20%; */
  box-shadow: 2px 4px 6px #999;
}

.remember{
    height: 20px;
    margin: 0 0 20px 10%;
    display: flex;
    align-items: center;
}

.remember input{
    display: none;
}
label {
    width: 12px;
    height: 12px;
    border-radius: 1px;
    border: 1px solid #888;
    position: relative;
    cursor: pointer;
}
label::before {
    content: " ";
    width: 6px;
    border: 2px solid #fff;
    height: 2px;
    border-top: none;
    border-right: none;
    transform: rotate(-45deg);
    top: 2px;
    left: 1px;
    position: absolute;
    opacity: 0;
}
.remember input:checked+label {
      background: #888;
  }
.remember input:checked+label::before{
    opacity: 1;
    transform: all 0.5s;
}

.remember span{
    margin-left: 10px;
    font-size: 12px;
    color: #888;
    cursor: pointer;
}

.login h3{
  width: 100%;
  text-align: center;
  color: #3db8b5;
}

.username {
  width: 100%;
  height: 40px;
  margin-top: 20px;
  text-align: center;
}

.username input{
  width: 80%;
  height: 30px;
  padding: 0 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
}

.password {
   width: 100%;
  height: 40px;
  margin-top: 10px;
  text-align: center;
}

.password input{
  width: 80%;
  height: 30px;
  padding: 0 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
}

.sign{
  width: 100%;
  height: 40px;
  margin-top: 10px;
  text-align: center;
}

.sign input{
  width: 80%;
  height: 30px;
  color: #fff;
  border: 0px;
  background-color: #3db8b5;
  cursor: pointer;
}

.m3nu{
  width: 80%;
  height: 35px;
  margin: auto;


}

.m3nu .a{
  font-size: 12px;
  cursor: pointer;
  color: #3db8b5;
  text-decoration: none;
}

</style>