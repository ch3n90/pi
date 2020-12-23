<template>
  <el-container>
    <router-link  to="/m3nu" class="back" >
      <el-button type="warning" icon="el-icon-arrow-left" circle></el-button>
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
            <el-col :span="13" :offset="3">
              <div class="username">
                <el-input placeholder="Host" v-model="host">
                  <el-select v-model="protocol" slot="prepend">
                    <el-option label="http" value="http://"></el-option>
                    <el-option label="https" value="https://"></el-option>
                  </el-select>
                </el-input>
              </div>
            </el-col>

             <el-col :span="1" >
               <div class="flag">:</div>
            </el-col>

            <el-col :span="4">
              <div class="username">
                 <el-input
                    placeholder="host"
                    v-model="port">
                  </el-input>
              </div>
            </el-col>
          </el-row>

          <el-row class="rows">
            <el-col :span="18" :offset="3">
              
              <div class="username">
                 <el-input
                    placeholder="access key"
                    prefix-icon="el-icon-user"
                    v-model="accessKey">
                  </el-input>
              </div>
            </el-col>
          </el-row>

          <el-row class="rows">
            <el-col :span="18" :offset="3">
              <div class="password">
                 <el-input
                    placeholder="secret key"
                    prefix-icon="el-icon-lock"
                    v-model="secretKey"
                    show-password>
                  </el-input>
              </div>
            </el-col>
          </el-row>


           <el-row class="rows">
            <el-col :span="18" :offset="3">
              <div class="remember">
                  <el-checkbox v-model="rememberMe">记住我</el-checkbox>
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
        </div>
      </el-col>
    </el-row>
  </el-main>
</el-container>
</template>


<script>
// const axios = require('../../util/http')
import HttpApi from '../../util/http.js'
const {ipcRenderer} = require('electron')
const remote = require('electron').remote
const Minio = require('minio')
import qs from 'qs'
export default {
  name: 'Mnio',
  data(){
    return {
      protocol:"http://",
      host:'192.168.1.118',
      port:9000,
      accessKey: "minioadmin",
      secretKey:"minioadmin",
      rememberMe: false,
    }
  },
  methods:{
    sign(){
     
      HttpApi.post(
        this.protocol+this.host+":"+this.port+"/minio/webrpc",
        {
          "id":1,
          "jsonrpc":"2.0",
          "method":"Web.Login",
          "params":{"username": this.accessKey, "password": this.secretKey}
        },
        {
          "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.60"
        }
      ).then(resp => {
        console.log(resp);
        if(resp.error){
          throw resp.error.message;
        }
        remote.getGlobal('cache').token = resp.result.token;
        remote.getGlobal('cache').pi = './minio/Main';
        ipcRenderer.send("pi-win");
      }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err
          });
      })
    }
  },
  
}
</script>

<style scoped>
 .el-select  {
    width: 80px;
  }
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
}

.flag{
  text-align: center;
  line-height: 40px;
}
</style>