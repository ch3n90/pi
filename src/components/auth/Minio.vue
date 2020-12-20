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
                 <el-input
                    placeholder="host"
                    prefix-icon="el-icon-cloudy"
                    v-model="host">
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
const {ipcRenderer} = require('electron')
const remote = require('electron').remote
const Minio = require('minio')
import qs from 'qs'
export default {
  name: 'Mnio',
  data(){
    return {
      host:'192.168.1.118',
      port:9000,
      accessKey: "minioadmin",
      secretKey:"minioadmin",
      rememberMe: false,
    }
  },
  methods:{
    sign(){
      let token = {
          endPoint: this.host,
          port: this.port,
          useSSL: false,
          accessKey: this.accessKey,
          secretKey: this.secretKey
      }
      let minioClient = new Minio.Client({
          endPoint: token.endPoint,
          port: token.port,
          useSSL: token.useSSL,
          accessKey: token.accessKey,
          secretKey: token.secretKey
      });
      minioClient.listBuckets((err, buckets) => {
        if (err){
          console.log(err)
           this.$notify.error({
              title: '错误',
              message: err
            });
        }else{
          remote.getGlobal('cache').token = token;
          remote.getGlobal('cache').pi = './minio/Main';
          ipcRenderer.send("pi-win");
        }
        
      });
    }
  },
  
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
}

.flag{
  text-align: center;
  line-height: 40px;
}
</style>