<template>
  <el-container>
    <router-link  to="/m3nu" class="back" >
      <el-page-header content="postimage"></el-page-header>
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
            <el-col :span="4" :offset="3">
              <div class="remember">
                  <el-checkbox v-model="remember">记住我</el-checkbox>
              </div>
            </el-col>
            <el-col :span="1" >
              <el-tooltip effect="dark" content="https://postimages.org/login/api 获取Api Key" placement="right">
                   <i class="el-icon-info"></i>
                </el-tooltip>
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
              <div >
                  <el-link type="warning"  @click.stop="temp">试用</el-link>
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
const {queryAccess,addAccess,removeAccess} = require('../../repsitory/access')
const {ipcRenderer} = require('electron')
const remote = require('electron').remote
export default {
  name: 'Smms',
  data(){
    return {
      apiKey: null,
      remember: false,
    }
  },
  methods:{
    sign(){
      if(this.remember){
            let access = {
              typ3:"postimage",
              apiKey:this.apiKey,
              remember: this.remember,
              default:false,
            }
            addAccess(access);
          }else{
            removeAccess("postimage");
          }
      remote.getGlobal('cache').token = this.apiKey;
      remote.getGlobal('cache').pi = './postimage/Main';
      ipcRenderer.send("pi-win");
    },
    temp(){
      remote.getGlobal('cache').pi = './postimage/Temp';
      ipcRenderer.send("pi-win");
    }
  },
  created(){
    queryAccess("postimage")
    .then(access => {
      if(access){
        this.apiKey = access.apiKey;
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