<template>
<div class="main">
  <div class="title-bar" :style="{color:fc}">
    <div class="info"> 
      <div>{{ time }}</div>
      <div>
        <span class="iconfont icon-wifi"></span>
      </div>
      <div>
        <span class="iconfont icon-battery-"></span>
      </div>
    </div>
    
    <div class="cmm" v-if="!isMac">
      <div class="el-icon-close" @click="hide"></div>
      <div class="el-icon-minus" @click="minimize"></div>
    </div>
    
  </div>
  <transition name="zoom"
        enter-active-class="zoomIn"
        leave-active-class="zoomOut" mode="out-in">
    <router-view style="animation-duration: 0.5s"/>
  </transition>

  <el-dialog
    title="更新提示"
    :visible.sync="dialogVisible"
    width="70%">
    <div v-for="(note,index) in releaseNote" :key="index">{{ note }}</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="agreeUpdate">确 定</el-button>
    </span>
  </el-dialog>

  <el-dialog
    title="下载中"
    :visible.sync="updateProcessBarVisible"
    width="28%">
      <el-progress type="circle" :percentage="percentage"></el-progress>
  </el-dialog>
</div>
</template>

<script>
import M3nu from './M3nu'
import 'vue2-animate/dist/vue2-animate.min.css'
import "../../assets/fonts/iconfont.css"
import dayjs from 'dayjs'
const {ipcRenderer,remote} = require('electron')
const {is} = require('electron-util');

export default {
  name: 'Auth',
  data(){
    return {
      dialogVisible:false,
      updateProcessBarVisible:false,
      percentage:0,
      releaseNote:[],
      time: dayjs(new Date()).format('HH:mm'),
      timeId:null,
      fc:"#fff",
      isMac:is.macos,
    }
  },
  render:function(c){
    return c(M3nu);
  },
  methods:{
    agreeUpdate(){
      this.dialogVisible = false;
      ipcRenderer.send("agree-update")
    },
    hide(){
      remote.getCurrentWindow().hide();
    },
    minimize(){
      remote.getCurrentWindow().minimize();
    },
  },
  created(){
    this.timeId = setInterval(() => {
      this.time = dayjs(new Date()).format("HH:mm");
    },1000 * 10)
    ipcRenderer.once("update-available",(event,arg) => {
      this.releaseNote = arg.releaseNote;
      this.dialogVisible = true;
    });
    ipcRenderer.once("start-update",(event,arg) => {
      this.updateProcessBarVisible = true;
    });
    ipcRenderer.on("update-processbar",(event,arg) => {
      this.percentage = parseInt(arg.percent);
    });
    ipcRenderer.once("update-downloaded",(event,arg) => {
      this.updateProcessBarVisible = false;
      this.$confirm('下载完成，现在退出安装?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ipcRenderer.send("start-install")
        }).catch(() => {
        });
    })
  },
  beforeDestroy(){
    if(this.timeId){
      clearInterval(this.timeId);
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  width: 100%;
  height: 100%;
  background: url('../../assets/images/bg13.jpg') no-repeat center center;
  background-size: cover;
  background-attachment:fixed;
}
.title-bar{
  width: 100%;
  height: 28px;
  z-index: 999;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  position: absolute;
  top: 0;
}

.cmm div{
  width: 28px;
  text-align: center;
  line-height: 28px;
  float: right;
  -webkit-app-region: no-drag;
}
.info{
  margin: 0 10px;
  font-size: 14px;
}
.info div{
  line-height: 28px;
  float: left;
  margin-right: 6px;
}

.title-bar div:nth-child(odd):hover{
  background-color: #f45454;
  color: #fff;
}
.title-bar div:nth-child(even):hover{
  background-color: #888;
}

</style>
