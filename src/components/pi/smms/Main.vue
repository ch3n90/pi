<template>
 <el-container>
  <el-aside width="200px">
    <el-row>
      <el-col :span="24">
        <el-menu
          default-active="Upload"
          @select="rightCom">
          <el-menu-item index="Upload">
            <i class="el-icon-upload"></i>
            <span slot="title">上传</span>
          </el-menu-item>
          <el-menu-item index="History">
            <i class="el-icon-document"></i>
            <span slot="title">历史</span>
          </el-menu-item>
          <el-menu-item index="Profile">
            <i class="el-icon-setting"></i>
            <span slot="title">我的</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>

    <el-row>
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
    <el-row class="content">
      <el-col class="content">
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
import History from './History'
import Upload from './Upload'
import Profile from './Profile'
const remote = require('electron').remote
const {ipcRenderer} = require('electron')
export default {
  name: 'SMMS',
    data() {
      return {
         rightComName: Upload,
      };
    },
  methods:{
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      rightCom(index,indexPath){
          this.rightComName = index;
      },
      exit(){
        ipcRenderer.send("m3nu-win");
      }
  },
  created(){
   
  },
  components:{
        //right
        Upload,
        History,
        Profile,
     
    },
}
</script>
<style scoped>
.el-container{
  height: 100%;
}
.el-aside{
  height: 100%;
  font-size: 14px;
  border-right: 1px solid #ccc;
}
.el-menu{
  border: none;
}
.content {
   height: 100%;
   background-color: #F5F5F5;
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
