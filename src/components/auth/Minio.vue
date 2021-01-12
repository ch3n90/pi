<template>
  <el-container>
    <router-link  to="/m3nu" class="back el-icon-arrow-left"></router-link>
    
  <el-main>
    <el-row >
      <el-col :span="22" :offset="1">
        <div class="login">
          <el-row >
            <el-col :span="24">
              <div class="title">MINIO</div>
            </el-col>
          </el-row>

          <el-row class="rows">
            <el-col :span="15" :offset="1">
              <div>
                <el-input placeholder="Host" v-model="host" spellcheck="false">
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

            <el-col :span="6">
              <div>
                 <el-input
                    spellcheck="false"
                    placeholder="host"
                    v-model.number="port">
                  </el-input>
              </div>
            </el-col>
          </el-row>

          <el-row class="rows">
            <el-col :span="22" :offset="1">
              <div>
                 <el-input
                    spellcheck="false"
                    placeholder="access key"
                    prefix-icon="el-icon-user"
                    v-model="accessKey">
                  </el-input>
              </div>
            </el-col>
          </el-row>

          <el-row class="rows">
            <el-col :span="22" :offset="1">
              <div class="password">
                 <el-input
                    spellcheck="false"
                    placeholder="secret key"
                    prefix-icon="el-icon-lock"
                    v-model="secretKey"
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
export default {
  name: 'Mnio',
  data(){
    return {
      protocol:"http://",
      host:null,
      port:null,
      accessKey: null,
      secretKey: null,
      remember: false,
    }
  },
  methods:{
    sign(){
      let url = this.protocol+this.host+":"+this.port+"/minio/webrpc";
      HttpApi.post(
        url,
        {
          "id":1,
          "jsonrpc":"2.0",
          "method":"Web.Login",
          "params":{"username": this.accessKey, "password": this.secretKey}
        }
      ).then(resp => {
        if(resp.error){
          throw resp.error.message;
        }

        if(this.remember){
            let access = {
              typ3:"minio",
              protocol:this.protocol,
              host:this.host,
              port:this.port,
              accessKey: this.accessKey,
              secretKey:this.secretKey,
              remember: this.remember,
              default:false,
            }
            addAccess(access);
          }else{
            removeAccess("minio");
          }

        let token = {
          protocol:this.protocol,
          host:this.host,
          port:this.port,
          url:url,
          jwt:resp.result.token
        }

        remote.getGlobal('cache').token = token;
        remote.getGlobal('cache').pi = './minio/Main';
        ipcRenderer.send("pi-win");
      }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err,
            offset:15
          });
      });
    }
  },
  created(){
    this.$store.commit("setTitleBarFontColor","#000");
    queryAccess("minio")
    .then(access => {
      if(access){
        this.protocol = access.protocol;
        this.host = access.host;
        this.port = access.port
        this.accessKey = access.accessKey
        this.secretKey = access.secretKey
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
  -webkit-user-select: none;
}
.back{
  position: absolute;
  left: 10px;
  top: 38px;
  z-index: 999;
  color: #000;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
}
.el-page-header >>>.el-page-header__left::after{
  content: none;
}

.el-select  {
    width: 80px;
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
.flag{
  text-align: center;
  line-height: 40px;
}

</style>