<template>
  <el-container
    v-loading="loading"
    element-loading-text="正在检查更新"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <router-link  to="/settings" class="back" >
      <el-page-header title="设置"></el-page-header>
    </router-link>
  <el-main>
    <el-row>
        <el-col :span="4">
          <div>
            <img src="../../../assets/images/icon.png" alt="" class="logo">
          </div>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-row>
              <span>{{arg.version}}</span>
          </el-row>
          <el-row v-if="updating===1">
            <el-progress :percentage="percentage"></el-progress>
          </el-row>
          <el-row v-if="hasNewVersion">
              <div v-for="(note,index) in arg.releaseNote" :key="index">{{note}}</div>
          </el-row>
           <el-row v-else>
              <div> 最新版本 </div>
          </el-row>
        </el-col>
    </el-row>

    <el-row class="start-update-warp" v-if="hasNewVersion">
      <el-col :span="24">
         <el-button type="primary" v-if="updating===0" size="medium" style="width:100%" @click="startDownload">
           开始更新
         </el-button>
         <el-button type="primary" v-else-if="updating===1" disabled size="medium" style="width:100%" >
           开始更新
         </el-button>
          <el-button type="primary" v-else-if="updating===2" size="medium" style="width:100%" @click="installNow">
            现在安装
         </el-button>
      </el-col>
      <!--  -->
    </el-row>
      
  </el-main>
</el-container>
</template>


<script>
const {ipcRenderer} = require('electron')
const {api,is} = require('electron-util');
export default {
  name: 'Updater',
  data(){
    return {
      loading: true,
      hasNewVersion:false,
      updating:0,
      percentage:0,
      arg:{},
    }
  },
  methods:{
    installNow(){
       ipcRenderer.send("start-install")
    },
    startDownload(){
      this.updating = 1;
      ipcRenderer.send("agree-download")
    }
  },
  created(){
    if(is.development){
      this.arg.version = 'dev env'
      this.loading = false;
    }
    ipcRenderer.send("check-update");

    ipcRenderer.once("update-available",(event,arg) => {
      this.loading = false;
      this.hasNewVersion = true;
      this.arg = arg;
    });

    ipcRenderer.once("update-not-available",(event,arg) => {
      this.loading = false;
      this.arg = {
        "version": api.app.getVersion(),
      }
    });
  
    ipcRenderer.on("update-processbar",(event,arg) => {
      this.percentage = parseInt(arg.percent);
    });
    ipcRenderer.once("update-downloaded",(event,arg) => {
        this.updating == 2;
    })
  }
}
</script>

<style scoped>
.el-container{
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #f3f3f8;
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
.el-main{
  margin-top: 70px;
  font-size: 14px;
}
.logo{
  width: 63px;
  height: 63px;
}

.start-update-warp{
  margin-top: 200px;
  background-color: #ccc;
}
</style>