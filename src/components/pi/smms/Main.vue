<template>
 <el-container>
  <el-main>
    <el-row class="imgs">
        <el-col :span="22" :offset="1">
          <el-upload
            class="upload_list"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture">
            <el-button class="uploadBtn" type="primary" icon="el-icon-upload" circle ></el-button>
          </el-upload>
        </el-col>
    </el-row>

     <el-row class="details" v-show="curImag.storename">
        <!-- <div> -->
            <el-row>
              <el-col :span="23" offset="1">
                markdown：![{{curImag.filename}}]({{curImag.url}})
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" offset="1">
                云端名称：{{curImag.storename}}
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10" offset="1">
                图片名称：{{curImag.filename}}
              </el-col>
            </el-row>
            
            <el-row>
                <el-col :span="10" offset="1">
                  云端路径：{{curImag.path}}
                </el-col>
            </el-row>

            <el-row>
              <el-col :span="10" offset="1">
                图片大小：{{curImag.size}}
              </el-col>
            </el-row>

              <el-row>
                <el-col :span="23" offset="1">
                宽 XX 高：{{curImag.width}} * {{curImag.height}}
              </el-col>
            </el-row>
          </el-row>
        <!-- </div> -->
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
      fileList:null,
      curImag:{},
    }
  },
  methods:{
    handlePreview(file){
      console.log(file);
      this.curImag = file;
    },
    handleRemove(file, fileList){
      console.log(file);
      console.log(fileList)
    }
  },
  created(){
    HttpApi.get(
      'https://sm.ms/api/v2/upload_history',
      {
        headers:{"Authorization":remote.getGlobal('cache').token}
      }
    )
    .then(response=>{
      if(response.success){
        let data = response.data;
        data.forEach(element => {
          element.name = element.filename;
        });
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
  height: 80%;
  overflow:scroll;
  overflow-x:hidden;
  border-bottom: 1px solid #ccc;
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
  height: 20%;

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
