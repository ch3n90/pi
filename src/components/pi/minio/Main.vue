<template>
 <el-container>
    <div class="title-bar" >
      <div class="cmm" v-if="!isMac">
        <div class="el-icon-close" @click="hide"></div>
        <div class="el-icon-minus" @click="minimize"></div>
      </div>
    </div>
  <el-aside width="200px">
    <el-row class="menu-name-warp">
      <el-col :span="18" :offset="2">
        <span class="menu-name">菜单</span>
      </el-col>
    </el-row>

    <el-row class="menu-new-warp">
      <el-col :span="24">
        <el-menu
          @select="newBucket">
          <el-menu-item index="Upload">
            <i class="el-icon-plus"></i>
            <span slot="title">新建</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>

    <el-row class="menu-item-warp">
      <el-col :span="24">
        <el-menu
          default-active="List"
          @select="rightCom">
          <el-menu-item :index="bucket.name" v-for="bucket in buckets" :key="bucket.name">
            <i class="el-icon-upload"></i>
            <span slot="title">{{bucket.name}}</span>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-delete" :command="bucket.name">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
                      :bucket="bucket"
                      :token="token"></component>
        </transition>
      </el-col>
    </el-row>
  </el-main>
</el-container>
</template>

<script>
import HttpApi from '../../../util/http'
import List from './List'
const {ipcRenderer,remote} = require('electron')
const {is} = require('electron-util');
export default {
  name: 'Minio',
    data() {
      return {
         buckets:[],
         bucket:{},
        //  paths:[],
         rightComName: List,
         token:null,
         isMac:is.macos,
      };
    },
methods:{
  handleCommand(command){
    HttpApi.post(
        this.token.url,
        {id: 1, jsonrpc: "2.0", params: {bucketName: command}, method: "Web.DeleteBucket"},
        {
          headers:{
            "Authorization":"Bearer "+ this.token.jwt,
          }
        }
      ).then(resp => {
        if(resp.error){
          throw resp.error.message;
        }
        for(let i=0;i<this.buckets.length;i++){
          if(this.buckets[i].name === command){
            this.buckets.splice(i,1);
            break;
          }
        }
      }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err,
            offset:15
          });
      })
    },
    newBucket(){
      this.$prompt('名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        HttpApi.post(
          this.token.url,
          {"id":1,"jsonrpc":"2.0","params":{"bucketName":value},"method":"Web.MakeBucket"},
          {
            headers:{
              "Authorization":"Bearer "+ this.token.jwt,
            }
          }
        ).then(resp => {
          if(resp.error){
            throw resp.error.message;
          }
          this.buckets.push({name:value});
        }).catch(err => {
            this.$notify.error({
              title: '错误',
              message: err,
              offset:15
            });
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
    },
    rightCom(index,indexPath){
      this.bucket = {name:index};
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
    this.token =  remote.getGlobal('cache').token;
    HttpApi.post(
        this.token.url,
        {"id":1,"jsonrpc":"2.0","params":{},"method":"Web.ListBuckets"},
        {
          headers:{
            "Authorization":"Bearer "+ this.token.jwt,
          }
        }
      ).then(resp => {
        if(resp.error){
          throw resp.error.message;
        }
        let buckets = resp.result.buckets;
        if(buckets && buckets.length > 0){
          this.buckets = buckets;
          this.bucket = buckets[0];
        }
      }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err,
            offset:15
          });
      });
  },
  components:{
        List,
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
.menu-name-warp{
  padding: 28px 0 18px 0;
}
.menu-name{
  color: #000;
  font-size: 24px;
  font-weight: bold;
}

.el-aside{
  height: 100%;
  font-size: 14px;
  border-right: 1px solid #ccc;
}
.menu-new-warp{
  padding: 0 10px;
  border-radius: 10px;
  margin-bottom: 10px;
}
.menu-item-warp{
  padding: 0 10px;
  border-radius: 10px;
  height: 65%;
  overflow-y: auto;
}
.menu-item-warp .el-menu-item{
  border-bottom: 1px solid #e9e9e9;
  overflow: hidden; 
  text-overflow: ellipsis
}
.menu-item-warp .el-menu-item:last-child{
  border-bottom: none;
}
.el-menu{
  border-radius: 10px;
  border: none;
}
.menu-exit-warp{
  padding: 0 10px;
  margin-top: 30px;
}
.content {
  margin-top: 28px;
  padding: 0 10px;
  height: 95%;
}
.smms-row,.smms-col{
  height: 100%;
}
.el-main::-webkit-scrollbar-track, .menu-item-warp::-webkit-scrollbar-track{
	background-color: #f5f5f5;
}
.el-main::-webkit-scrollbar, .menu-item-warp::-webkit-scrollbar{
	width: 0px;
}
.el-main::-webkit-scrollbar-thumb, .menu-item-warp::-webkit-scrollbar-thumb{
  border-radius: 0px;
}
.el-dropdown{
  position: absolute;
  right: 0;
}
.el-icon-more{
  transform: rotate(90deg);
  font-size: 14px;
}


</style>
