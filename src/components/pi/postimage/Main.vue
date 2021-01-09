<template>
 <el-container>
  <div class="title-bar" >
      <div class="el-icon-close" @click="hide"></div>
      <div class="el-icon-minus" @click="minimize"></div>
  </div>
  <el-aside width="200px">
    <el-row class="menu-name-warp">
      <el-col :span="18" :offset="2">
        <span class="menu-name">菜单</span>
      </el-col>
    </el-row>

    <el-row class="menu-item-warp">
      <el-col :span="24">
        <el-menu
          default-active="Upload"
          @select="rightCom">
          <el-menu-item index="Upload">
            <i class="el-icon-upload"></i>
            <span slot="title">上传</span>
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
import Upload from './Upload'
const {ipcRenderer,remote} = require('electron')
export default {
  name: 'SMMS',
    data() {
      return {
         rightComName: Upload,
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
        //right
        Upload,
     
    },
}
</script>
<style scoped>
.el-container{
  height: 100%;
  background-color: #F3F3F8;
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
.title-bar div{
  width: 28px;
  text-align: center;
  line-height: 28px;
  float: right;
  -webkit-app-region: no-drag;
}
.title-bar div:nth-child(odd):hover{
  background-color: #f45454;
  color: #fff;
}
.title-bar div:nth-child(even):hover{
  background-color: #888;
}
.el-aside{
  height: 100%;
  font-size: 14px;
  border-right: 1px solid #ccc;
}

.menu-name-warp{
  padding: 28px 0 18px 0;
}
.menu-name{
  color: #000;
  font-size: 24px;
  font-weight: bold;
}
.menu-item-warp{
  padding: 0 10px;
  border-radius: 10px;
}

.el-menu{
  border-radius: 10px;
  border: none;
}
.menu-exit-warp{
  padding: 0 10px;
  margin-top: 40px;
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
