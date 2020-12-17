<template>
 <el-container>
  <el-main>
    <el-row class="imgs">
        <el-col :span="22" :offset="1">
          <el-upload
            class="upload_list"
            action="https://sm.ms/api/v2/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="uploadSuccess"
            :file-list="fileList"
            :headers="auth"
            :multiple=true
            :on-exceed="fileExceed"
            v-loading="loading"
            accept="image/*"
            name="smfile"
            list-type="picture">
            <el-button class="uploadBtn" type="primary" icon="el-icon-upload" circle ></el-button>
          </el-upload>
        </el-col>
    </el-row>

     <el-row class="details" v-if="curImage.url">
       <el-tabs value="markdown"  type="card" >
          <el-tab-pane  label="Markdown" name="markdown">
            <el-input  readonly v-bind:value="curImage | markdown"></el-input>
          </el-tab-pane>
          <el-tab-pane label="Image URL" name="imageUrl">
            <el-input  readonly v-bind:value="curImage.url"></el-input>
          </el-tab-pane>
        </el-tabs>
     </el-row>
</el-main>
</el-container>
</template>

<script>
import HttpApi from '../../../util/http.js'
const remote = require('electron').remote
export default {
  name: 'SMMS',
  data:function(){
    return {
      fileList:[],
      curImage:{},
      auth: null,
      loading: true,
        dialogImageUrl: '',
        dialogVisible: false
    }
  },
  filters:{
    markdown:function(curImag){
      return "!["+ curImag.name +"]("+ curImag.url +")";
    },
  },
  methods:{
    handlePreview(file){
      this.curImage = file;
    },
    uploadSuccess(response,file,fileList){
      if(response.success){
        file.hash = response.data.hash;
        file.url = response.data.url;
      }else{
        const index = fileList.indexOf(file);
        if(index > -1){
          fileList.splice(index, 1)
        }
        this.$notify.error({
          title: '错误',
          message: response.message
        });
      }
    },
    handleRemove(file, fileList){
      if(file.hash === this.curImage.hash){
        this.curImage={};
      }
      HttpApi.get(
        'https://sm.ms/api/v2/delete/' + file.hash,
      )
      .then(response=>{
        if(response.success){
           this.$notify({
              title: '成功',
              message: '图片删除成功',
              type: 'success'
            });
        }else{
          throw response.message;
        }
      }).catch(err => {
         this.$notify.error({
          title: '错误',
          message: err
        });
      });
    },
    fileExceed(files, fileList){
      this.$message("一次最多上传10张图片");
    }
  },
  created(){
    this.auth = {"Authorization" : remote.getGlobal('cache').token} ;
    HttpApi.get(
      'https://sm.ms/api/v2/upload_history',
      {
        headers:this.auth
      }
    )
    .then(response=>{
      if(response.success){
        let data = response.data;
        data.forEach(element => {
          element.name = element.filename;
        });
        this.loading = false;
        this.fileList = data;
      }else{
        throw response.message;
      }
    }).catch(err => {
      let myNotification = new Notification('失败',{
              body: err,
              silent: true,
          });
    });
  }
}
</script>
<style scoped>
.el-container{
  height: 100%;
}

.el-main .imgs{
  height: 70%;
  overflow:scroll;
  overflow-x:hidden;
  border:1px solid #ccc;
}

.upload_list >>> .el-upload-list__item {
  height: 50px !important;
  padding-top: 0!important;
}

.upload_list >>> .el-upload-list__item-thumbnail{
  width: 50px !important;
  height: 50px !important;
}

.upload_list >>>  .el-upload-list__item-name {
  height: 50px!important;
  line-height: 50px!important;
}
.el-main .details{
  height: 30%;

  font-size: 12px;
  padding-top:5px ;
}
.uploadBtn{
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}

.imgs::-webkit-scrollbar-track
{
	background-color: #f5f5f5;
}
.imgs::-webkit-scrollbar
{
	width: 8px;
	background-color: #f5f5f5;
}
.imgs::-webkit-scrollbar-thumb
{
	background-color: #d2d2d2;
    border-radius: 8px;
}

</style>
