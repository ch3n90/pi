<template>
  <el-container>
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
              <div>
                 <el-input
                    placeholder="Api Key"
                    prefix-icon="el-icon-lock"
                    v-model="apiKey"
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
          
           <el-row>
            <el-col :span="2" :offset="3">
              <div>
                  <router-link  to="/m3nu">
                    <el-link type="primary">菜单</el-link>
                  </router-link>
              </div>
            </el-col>
          </el-row>

           <el-row style="margin-top:30px">
            <el-col :span="2" :offset="21">
              <div >
                  <el-link type="warning">试用</el-link>
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
const {ipcRenderer} = require('electron')
const remote = require('electron').remote
export default {
  name: 'Smms',
  data(){
    return {
      apiKey:'8ca0b57a6bb9c4c33cd9e7ab8e6a7f05',
      rememberMe: false,
    }
  },
  methods:{
    sign(){
      remote.getGlobal('cache').token = this.apiKey;
      remote.getGlobal('cache').pi = './postimage/Main';
      ipcRenderer.send("pi-win");
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
</style>