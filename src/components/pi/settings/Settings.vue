<template>
 <el-container>
  <div class="title-bar" >
    <div class="cmm" v-if="!isMac">
      <div class="el-icon-close" @click="hide"></div>
      <div class="el-icon-minus" @click="minimize"></div>
    </div>
  </div>
  <el-aside width="200px">
    <el-row class="settings-name-warp">
      <el-col :span="18" :offset="2">
        <span class="settings-name">设置</span>
      </el-col>
    </el-row>

    <el-row class="menu-item-warp">
      <el-col :span="24">
        <el-menu
          default-active="Updater"
          @select="rightCom">
          <el-menu-item index="Updater">
            <i class="el-icon-upload"></i>
            <span slot="title">更新</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>

    <el-row class="menu-exit-warp">
      <el-col :span="24">
        <el-menu
          @select="exit">
          <el-menu-item index="Exit">
            <i class="el-icon-toilet-paper"></i>
            <span slot="title">登出</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
      
  </el-aside>
  <el-main class="content">
    <el-row class="smms-row">
      <el-col class="smms-col">
        <transition name="fade"
                  enter-active-class="fadeIn"
                  leave-active-class="fadeOut"
                  mode="out-in">
          <component :is="rightComName"
                      style="animation-duration: .2s;"
                      ></component>
        </transition>
      </el-col>
    </el-row>
  </el-main>
   </el-container>
</template>

<script>
import HttpApi from '../../../util/http.js'
import Updater from './Updater'
const {ipcRenderer,remote} = require('electron')
const {is} = require('electron-util');
export default {
  name: 'Settings',
    data() {
      return {
         rightComName: Updater,
         isMac:is.macos,
      };
    },
  methods:{
    rightCom(index,indexPath){
          this.rightComName = index;
      },
    exit(){
      ipcRenderer.send("m3nu-win");
    },
    hide(){
      remote.getCurrentWindow().hide();
    },
    minimize(){
      remote.getCurrentWindow().minimize();
    }
  },
  created(){
   
  },
  components:{
        Updater,
    },
}
</script>
<style scoped>
.el-container{
  height: 100%;
  background-color: #F3F3F8;
  -webkit-user-select: none;
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

.cmm div:nth-child(odd):hover{
  background-color: #f45454;
  color: #fff;
}
.cmm div:nth-child(even):hover{
  background-color: #888;
}
.settings-name-warp{
  padding: 28px 0 18px 0;
}
.settings-name{
  color: #000;
  font-size: 24px;
  font-weight: bold;
}

.el-aside{
  height: 100%;
  font-size: 14px;
  border-right: 1px solid #d8d8d8;
}
.menu-item-warp{
  padding: 0 10px;
  border-radius: 10px;
}

.menu-item-warp .el-menu-item:nth-child(-n+2){
  border-bottom: 1px solid #e9e9e9;
}

.menu-exit-warp{
  padding: 0 10px;
  margin-top: 40px;
}
.el-menu{
  border-radius: 10px;
  border: none;
}
.content {
  margin-top: 28px;
  padding: 0 10px;
  height: 95%;
}
.smms-row,.smms-col{
  height: 100%;
}
.el-main::-webkit-scrollbar-track
{
	background-color: #f5f5f5;
}
.el-main::-webkit-scrollbar
{
	width: 8px;
	background-color: #f5f5f5;
}
.el-main::-webkit-scrollbar-thumb
{
	background-color: #d2d2d2;
  border-radius: 8px;
}
</style>
