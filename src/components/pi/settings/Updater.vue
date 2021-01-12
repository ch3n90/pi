<template>
  <el-container
    v-loading="loading"
    element-loading-text="正在检查更新"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
  <el-main v-if="hasNewVersion">
    <el-row class="release-info">
        <el-col :span="3">
          <div class="logo">
            <img src="../../../assets/images/icon.png" alt="" class="logo-img">
          </div>
        </el-col>

        <el-col :span="18">
          <el-row>
              <p style="font-weight: bold">Version: {{arg.version}}</p>
              <p>Date: {{ arg.releaseDate }} </p>
              <p>Size: {{ parseInt(arg.files[0].size / 1024 / 1024) }}MB</p>
          </el-row>
          <el-row v-if="updating===1">
            <el-progress :percentage="percentage"></el-progress>
          </el-row>
        </el-col>
    </el-row>

      <el-row class="release-note">
        <div class="notes" v-html="arg.releaseNotes"></div>
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

  <el-main v-else>
    <el-row>
        <el-col :span="24">
          <div class="no-update">
            
          </div>
        </el-col>
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
      noNewVersion:"",
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
        this.anoNewVersion = "您的软件是最新版本"
      });
    
      ipcRenderer.on("update-processbar",(event,arg) => {
        this.percentage = parseInt(arg.percent);
      });

      ipcRenderer.once("update-downloaded",(event,arg) => {
          this.updating == 2;
      });

      ipcRenderer.once("update-error",(event) => {
        this.loading = false;
        this.$notify.error({
          title: '错误',
          message: "检查更新出错了",
          offset:15
        });
      });
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
.notes{
  padding-left: 20px;
}
p{
  padding: 5px 0;
}
.no-update{
  text-align: center;
}
.el-button{
  border: none;
  text-align: left;
}
.el-button--medium{
  padding: 10px;
}
</style>