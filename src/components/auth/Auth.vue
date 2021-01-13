<template>
<div class="main">
  <div class="title-bar" :style="{color:$store.getters.getTitleBarFontColor}">
    <div class="info"> 
      <div :style="{float:isRight}">{{ time }}</div>
      <div :style="{float:isRight}">
        <span :class="['iconfont',net]" style="font-size:18px"></span>
      </div>
      <div :style="{float:isRight}">
        <span :class="['iconfont',power]" style="font-size:22px"></span>
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
      updateProcessBarVisible:false,
      percentage:0,
      releaseNote:[],
      time: dayjs(new Date()).format('HH:mm'),
      timeId:null,
      isMac:is.macos,
      isRight:is.macos?"right":"left",
      net:navigator.onLine?"icon-iosworld":"icon-iosworldoutline",
      power:'icon-ios-battery-charging1'
    }
  },
  render:function(c){
    return c(M3nu);
  },
  methods:{
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

    window.addEventListener('online', () => {
      if(navigator.onLine){
        this.net = "icon-iosworld"
      }
    })
    window.addEventListener('offline', () => {
       if(!navigator.onLine){
        this.net = "icon-iosworldoutline"
      }
    })

    ipcRenderer.on("update-available",(event,arg) => {
      this.$store.commit("setSettingsBadgeHidden",false);
    });

    ipcRenderer.on("power-monitor",(event,status) => {
      if(status === "ac"){
        this.power = "icon-ios-battery-charging1"
      }else if(status === "battery"){
        this.power = "icon-ios-battery-full"
      }
    });
    
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
.cmm div:nth-child(odd):hover{
  background-color: #f45454;
  color: #fff;
}
.cmm div:nth-child(even):hover{
  background-color: #888;
}

</style>
