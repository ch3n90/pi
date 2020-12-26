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
  
  <el-dropdown class="uploader"  @command="uploadCommand">
    <span class="el-dropdown-link">
      <el-button type="danger" icon="el-icon-plus" circle ></el-button>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item icon="el-icon-folder-add" command="path">文件夹</el-dropdown-item>
      <el-dropdown-item icon="el-icon-picture-outline" command="image">文件</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
   </el-container>
</template>

<script>
import HttpApi from '../../../util/http'
import List from './List'
import Upload from './Upload'
import Profile from './Profile'
const remote = require('electron').remote
const {ipcRenderer,Menu,MenuItem} = require('electron')
export default {
  name: 'Minio',
    data() {
      return {
         buckets:[],
         bucket:{},
         paths:[],
         rightComName: List,
         objectList:[],
         loading:false,

         //------
         token:null,
      };
    },
  methods:{
    uploadCommand(command){
      if(command === "path"){
        this.$prompt('文件夹', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let tempPrefix ="";
          if(this.paths && this.paths.length>0){
            let lastEle = this.paths[this.paths.length-1];
            tempPrefix = lastEle.prefix;
          }
          let temp = {
            contentType:"",
            lastModified:new Date(),
            name:value,
            prefix: tempPrefix + value + "/",
            size:0
          }
          this.objectList.unshift(temp);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      }else if(command === "image"){
        let path = "";
        if(this.paths && this.paths.length > 0){
          path = this.paths[this.paths.length - 1].prefix
        }
        new Promise((resolve) => {
          let input = document.createElement('input');
          input.value = '选择文件';
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = event => {
              let file = event.target.files[0];
              resolve(file);
          };
          input.click();
        }).then(file => {
          HttpApi.put(
            this.token.protocol 
            + this.token.host 
            + ":" 
            + this.token.port 
            + "/minio/upload/"
            + this.bucket.name 
            +"/"
            + path
            + file.name,
          file,
          {
            headers:{
              'Content-Type':file.type,
              "Authorization":"Bearer "+ this.token.jwt,
              }
          }
          ).then(resp => {
            this.listObject(this.bucket.name,path);
          });
        }).catch(err => {
          this.$notify.error({
                title: '错误',
                message: err
              });
          });
      }
    },
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
        this.loading = true;
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
        });
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
  background-color:#f5f5f5;
  border-right: 1px solid #ccc;
}
.el-menu{
  border: none;
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

.el-dropdown{
  position: absolute;
  right: 0;
}
.el-icon-more{
  transform: rotate(90deg);
  font-size: 14px;
}

.uploader{
  position: absolute;
  right: 20px;
  bottom: 20px;
}
</style>
