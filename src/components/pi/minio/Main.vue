<template>
 <el-container>
  <el-aside width="200px">
    <el-row>
      <el-col :span="24">
        <el-menu
          @select="newBucket"
          background-color="#f5f5f5">
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
          @select="rightCom"
          background-color="#f5f5f5">
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

    <el-row>
      <el-col :span="24">
        <el-menu
          @select="exit"
          background-color="#f5f5f5">
          <el-menu-item index="Exit">
            <i class="el-icon-toilet-paper"></i>
            <span slot="title">登出</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
      
  </el-aside>
  <el-main>
    <el-row >
      <el-col>
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
const remote = require('electron').remote
const {ipcRenderer} = require('electron')
export default {
  name: 'Minio',
    data() {
      return {
         buckets:[],
         bucket:{},
        //  paths:[],
         rightComName: List,
         token:null,
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
            message: err
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
              message: err
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
            message: err
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
}
.el-aside{
  height: 100%;
  font-size: 14px;
  background-color:#f5f5f5;
  border-right: 1px solid #ccc;
}
.el-menu{
  border: none;
}
.el-main{
   background-color: #F5F5F5;
}
.el-main > .el-row{
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

.el-dropdown{
  position: absolute;
  right: 0;
}
.el-icon-more{
  transform: rotate(90deg);
  font-size: 14px;
}


</style>
