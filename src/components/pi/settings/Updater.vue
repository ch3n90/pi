<template>
  <el-container
    v-loading="loading"
    element-loading-text="正在检查更新"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
  <el-main >
    <el-row class="release-info">
        <el-col :span="3">
          <div class="logo">
            <img src="../../../assets/images/icon.png" alt="" class="logo-img">
          </div>
        </el-col>

        <el-col :span="18">
          <el-row>
              <span style="font-weight: bold">{{arg.version}}</span>
          </el-row>
          <el-row v-if="updating===1">
            <el-progress :percentage="percentage"></el-progress>
          </el-row>
         
        </el-col>
    </el-row>

    <el-row class="release-note">
       <el-row v-if="hasNewVersion">
              <div v-for="(note,index) in arg.releaseNote" :key="index">{{note}}</div>
          </el-row>
           <el-row v-else>
              <div> 最新版本 </div>
          </el-row>
    </el-row>

    <el-row class="start-update-warp" v-if="hasNewVersion" >
      <el-col :span="24">
         <el-button v-if="updating===0" size="medium" style="width:100%" @click="startDownload">
           开始更新
         </el-button>
         <el-button  v-else-if="updating===1" disabled size="medium" style="width:100%" >
            开始更新
         </el-button>
          <el-button v-else-if="updating===2" size="medium" style="width:100%" @click="installNow">
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
      this.arg.version = 'Dev Env'
      this.loading = false;
    }else{
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
}
</script>

<style scoped>
.el-container{
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #f3f3f8;
 
}
.el-main{
  font-size: 14px;
}
.logo,.logo-img{
  width: 63px;
  height: 63px;
}
.release-info {
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
}

.release-note {
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 0 0 10px 10px;
  margin-bottom: 40px;
}

.el-button{
  border: none;
  text-align: left;
}
.el-button--medium{
  padding: 10px;
}
</style>