<template>
  <el-container>
    <router-link  to="/m3nu" class="back" >
      <el-page-header></el-page-header>
    </router-link>
    
  <el-main>
    <el-row >
      <el-col :span="24">
        <div class="login">
          <el-row >
            <el-col :span="24">
              <div class="title">SM.MS</div>
            </el-col>
          </el-row>

          <el-row class="rows">
            <el-col :span="22" :offset="1">
              <div class="username">
                 <el-input
                    placeholder="ID"
                    prefix-icon="el-icon-user"
                    v-model="username">
                  </el-input>
              </div>
            </el-col>
          </el-row>

          <el-row class="rows">
            <el-col :span="22" :offset="1">
              <div class="password">
                 <el-input
                    placeholder="password"
                    prefix-icon="el-icon-lock"
                    v-model="password"
                    show-password>
                  </el-input>
              </div>
            </el-col>
          </el-row>


           <el-row class="rows">
            <el-col :span="22" :offset="1">
              <div class="remember">
                  <el-checkbox v-model="remember">记住我</el-checkbox>
              </div>
            </el-col>
          </el-row>


           <el-row style="margin-bottom:10px">
            <el-col :span="22" :offset="1">
              <div class="sign">
                
                  <el-button type="primary" size="medium" @click.stop="sign">登入</el-button>
              </div>
            </el-col>
          </el-row>
          
           <el-row style="margin-top:30px">
            <el-col :span="4" :offset="21">
              <div>
                  <el-link type="warning" @click.stop="temp">试用</el-link>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-main>
</el-container>
</template>


<script>
import HttpApi from '../../util/http.js'
const {queryAccess,addAccess,removeAccess} = require('../../repsitory/access')
const {ipcRenderer,remote} = require('electron')
import qs from 'qs'
import { accessSync } from 'fs';
export default {
  name: 'Smms',
  data(){
    return {
      username: null,
      password: null,
      remember: false,
    }
  },
  methods:{
    sign(){
      HttpApi.post(
        'https://sm.ms/api/v2/token',
        qs.stringify({
          username: this.username,
          password: this.password,
        }),
      )
      .then(response=>{
        if(response.success){
          if(this.remember){
            let access = {
              typ3:"smms",
              username:this.username,
              password:this.password,
              remember: this.remember,
              default:false,
            }
            addAccess(access);
          }else{
            removeAccess("smms");
          }
          remote.getGlobal('cache').token = response.data.token;
          remote.getGlobal('cache').pi = './smms/Main';
          ipcRenderer.send("pi-win");
        }else{
          throw response.message;
        }
      }).catch(err => {
        this.$notify.error({
            title: '错误',
            message: err,
            offset:15,
          });
      });
    },
    temp(){
      remote.getGlobal('cache').pi = './smms/Temp';
      ipcRenderer.send("pi-win");
    }
  },
  created(){
    this.$store.commit("setTitleBarFontColor","#000");
    queryAccess("smms")
    .then(access => {
      if(access){
        this.username = access.username;
        this.password = access.password;
        this.remember = access.remember
      }
    });
  }
  
}
</script>

<style scoped>
.el-container{
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #fff;
}
.back{
  position: absolute;
  left: 10px;
  top: 38px;
  z-index: 999;
  color: #000;
  text-decoration: none;
}
.el-page-header >>>.el-page-header__left::after{
  content: none;
}
.login{
  height: 400px;
  margin-top: 50px;
}

.title{
  text-align: center;
  color: #409eff;
  margin:20px 0 30px 0 ;
}
.rows{
  margin-bottom: 30px;
}
.sign .el-button{
  width: 100%;
}


</style>