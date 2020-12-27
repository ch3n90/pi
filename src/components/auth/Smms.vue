<template>
  <el-container>
    <router-link  to="/m3nu" class="back" >
      <el-page-header content="sm.ms"></el-page-header>
    </router-link>
    
  <el-main>
    <el-row >
      <el-col :span="20" :offset="2">
        <div class="login">
          <el-row >
            <el-col :span="24">
              <div class="title">登入</div>
            </el-col>
          </el-row>

          <el-row class="rows">
            <el-col :span="18" :offset="3">
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
            <el-col :span="18" :offset="3">
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
            <el-col :span="18" :offset="3">
              <div class="remember">
                  <el-checkbox v-model="remember">记住我</el-checkbox>
              </div>
            </el-col>
          </el-row>


           <el-row style="margin-bottom:10px">
            <el-col :span="18" :offset="3">
              <div class="sign">
                
                  <el-button type="primary" size="medium" @click.stop="sign">登入</el-button>
              </div>
            </el-col>
          </el-row>
          
           <el-row style="margin-top:30px">
            <el-col :span="2" :offset="20">
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
const Store = require('electron-store');
const {ipcRenderer} = require('electron')
const remote = require('electron').remote
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
        let myNotification = new Notification('失败',{
                body: err,
                silent: true,
            });
      });
    },
    temp(){
      remote.getGlobal('cache').pi = './smms/Temp';
      ipcRenderer.send("pi-win");
    }
  },
  created(){
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

.login{
   height: 400px;
   margin-top: 50px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
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

.back{
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 999;
  color: #000;
  text-decoration: none;
}
</style>