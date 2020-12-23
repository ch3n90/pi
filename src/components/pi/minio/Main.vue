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
                      @func="func"
                      :key='incrementKey'></component>
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
const Minio = require('minio')
export default {
  name: 'Minio',
    data() {
      return {
         buckets:[],
         bucket:"",
         paths:[],
         rightComName: List,
         objectList:[],
         incrementKey:0,
         prefix:"",

         //------
         token:null,
      };
    },
  methods:{
      rightCom(index,indexPath){
        this.bucket = index;
        this.objectList = [];
        this.paths = [];
        this.listObject(index,"");
        this.incrementKey++;
      },
      func(prefix){
        this.objectList = [];
        this.listObject(this.bucket,prefix);
        let index = this.paths.indexOf(prefix);
        if(index >= 0){
          this.paths = this.paths.slice(0,index + 1);
        }else if(prefix === ''){
          this.paths=[];
        }else{
          this.paths.push(prefix);
        }
        this.incrementKey++;
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
              // "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edg/87.0.664.60"
            }
          }
        ).then(resp => {
          if(resp.error){
            throw resp.error.message;
          }
          console.log(resp);
          this.objectList = resp.result.objects;
        }).catch(err => {
            this.$notify.error({
              title: '错误',
              message: err
            });
        })
        // let stream = this.minioClient.listObjectsV2(bucket,prefix);
        // stream.on('data', (obj) => {
        //   let type = 1;
        //   if(obj.size === 0){
        //     type = 0;
        //   }
        //   let img = {
        //     name: type === 0 ? obj.prefix:obj.name,
        //     size: obj.size,
        //     date: obj.lastModified,
        //     type: type
        //   }
        //   this.objectList.unshift(img);
        // })
        // stream.on('error', function(err) { console.log(err) } )
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
        console.log(resp);
        this.buckets = resp.result.buckets;
        if(buckets && buckets.length > 0){
          this.bucket = buckets[0];
          //TODO
          this.listObject(this.bucket.name,'');
          this.paths.push(this.bucket)
        }
      }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err
          });
      })
    // this.minioClient = new Minio.Client({
    //       endPoint: token.endPoint,
    //       port: token.port,
    //       useSSL: token.useSSL,
    //       accessKey: token.accessKey,
    //       secretKey: token.secretKey
    //   });
    // this.minioClient.listBuckets((err, buckets) => {
    //     if (err){
    //        this.$notify.error({
    //           title: '错误',
    //           message: err
    //         });
    //     }else{
    //       this.buckets = buckets;
    //       if(buckets && buckets.length > 0){
    //         this.bucket = buckets[0].name;
    //         this.listObject(this.bucket,'');
    //         this.paths.push(this.bucket)
    //       }
    //     }
        
    //   });
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
