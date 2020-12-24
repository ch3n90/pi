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
          <el-menu-item :index="bucket.name" v-for="bucket in buckets" :key="bucket.name">
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
                      :objectList="objectList"
                      :bucket="bucket"
                      :paths="paths"
                      :loading="loading"
                      @func="func"></component>
        </transition>
      </el-col>
    </el-row>
  </el-main>
   </el-container>
</template>

<script>
import HttpApi from '../../../util/http'
import List from './List'
import Upload from './Upload'
import Profile from './Profile'
const remote = require('electron').remote
const {ipcRenderer} = require('electron')
export default {
  name: 'Minio',
    data() {
      return {
         buckets:[],
         bucket:{},
         paths:[],
         rightComName: List,
         objectList:[],
         loading:true,

         //------
         token:null,
      };
    },
  methods:{
      rightCom(index,indexPath){
        this.bucket = {name:index};
        this.objectList = [];
        this.paths = [];
        this.listObject(index,"");
      },
      func(next){
        this.objectList = [];
        this.listObject(this.bucket.name,next.prefix);
        let index = this.paths.indexOf(next);
        if(index >= 0){
          this.paths = this.paths.slice(0,index + 1);
        }else if(next.prefix === ''){
          this.paths=[];
        }else{
          this.paths.push(next);
        }
      },
      exit(){
        ipcRenderer.send("m3nu-win");
      },
      listObject(bucket,prefix){
        // {"id":1,"jsonrpc":"2.0","params":{"bucketName":"oss","prefix":""},"method":"Web.ListObjects"}
        HttpApi.post(
          this.token.url,
          {"id":1,"jsonrpc":"2.0","params":{"bucketName":bucket,"prefix":prefix},"method":"Web.ListObjects"},
          {
            headers:{
              "Authorization":"Bearer "+ this.token.jwt,
            }
          }
        ).then(resp => {
          if(resp.error){
            throw resp.error.message;
          }
          let objectList = resp.result.objects;
          if(objectList){
            let imagePath = this.token.protocol+this.token.host+":"+this.token.port+"/"+this.bucket.name + "/"
            objectList.forEach(ele => {
              if(ele.size === 0){
                ele.prefix = ele.name;
                let name = ele.name.split("/");
                name = name[name.length - 2];
                ele.name = name;
              }else{
                ele.url = imagePath + ele.name;
              }
            });
             this.objectList = objectList;
          }
          this.loading = false;
        }).catch(err => {
            this.$notify.error({
              title: '错误',
              message: err
            });
        })
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
            // "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.60"
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
          this.listObject(this.bucket.name,'');
        }
      }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err
          });
      })
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
