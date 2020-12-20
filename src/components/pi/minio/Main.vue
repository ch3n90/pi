<template>
 <el-container>
  <el-aside width="200px">

    <el-row>
      <el-col :span="24">
        <el-menu
          @select="rightCom">
          <el-menu-item index="Upload">
            <i class="el-icon-plus"></i>
            <span slot="title">新建</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-menu
          default-active="List"
          @select="rightCom">
          <el-menu-item index="List" v-for="bucket in buckets" :key="bucket.name">
            <i class="el-icon-upload"></i>
            <span slot="title">{{bucket.name}}</span>
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
  <el-main>
    <el-row>
      <el-col>
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
import List from './List'
import Upload from './Upload'
import Profile from './Profile'
const remote = require('electron').remote
const {ipcRenderer} = require('electron')
const Minio = require('minio')
export default {
  name: 'Minio',
    data() {
      return {
         minioClient: null,
         buckets:[],
         rightComName: List,
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
    let token =  remote.getGlobal('cache').token;
    this.minioClient = new Minio.Client({
          endPoint: token.endPoint,
          port: token.port,
          useSSL: token.useSSL,
          accessKey: token.accessKey,
          secretKey: token.secretKey
      });
    this.minioClient.listBuckets((err, buckets) => {
        if (err){
          console.log(err)
           this.$notify.error({
              title: '错误',
              message: err
            });
        }else{
          this.buckets = buckets;
        }
        
      });
  },
  components:{
        //right
        Upload,
        List,
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
}

.el-main{
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
