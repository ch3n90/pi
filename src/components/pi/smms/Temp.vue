<template>
  <div class="content" >
    <div class="title-bar" >
     <div class="cmm" v-if="!isMac">
      <div class="el-icon-close" @click="hide"></div>
      <div class="el-icon-minus" @click="minimize"></div>
    </div>
    </div>
    <el-container v-loading="loading">
      <el-main>
        <el-row>
        <el-col>
          <el-upload
                action="https://sm.ms/api/v2/upload"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload"
                :on-exceed="fileExceed"
                :file-list="fileList"
                :multiple=true
                accept="image/*"
                name="smfile"
                list-type="picture-card">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}" >
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                  >
                  <span class="el-upload-list__item-actions" @click="handleDetail(file)">
                    <span
                      class="el-upload-list__item-delete"
                      @click.stop="handleRemove(file)">
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
        </el-col>
      </el-row>

      <el-drawer
      :visible.sync="drawer"
      size="60%"
      :with-header="false">
      <div class="detail">
        <div class="preview">
          <img :src="curImage.url" alt="" class="preview-img">
        </div>
        <el-collapse accordion>
          <el-collapse-item title="链接" name="url">
            <el-input readonly v-bind:value="curImage.url">
              <el-button slot="append" icon="el-icon-copy-document"  @click="copy"></el-button>
            </el-input>
          </el-collapse-item>
          <el-collapse-item title="论坛" name="bbcode">
              <el-input readonly v-bind:value="curImage | bbcode">
                <el-button slot="append" icon="el-icon-copy-document"  @click="copy"></el-button>
              </el-input>
          </el-collapse-item>

          <el-collapse-item title="Markdown" name="markdown">
            <el-input readonly v-bind:value="curImage | markdown">
              <el-button slot="append" icon="el-icon-copy-document"  @click="copy"></el-button>
            </el-input>
          </el-collapse-item>

          <el-collapse-item title="HTML" name="html">
            <el-input 
              readonly 
              v-bind:value="curImage | html">
              <el-button slot="append" icon="el-icon-copy-document" @click="copy"></el-button>
            </el-input>
          </el-collapse-item>
      </el-collapse>
      </div>
    </el-drawer>
    </el-main>
      <el-button type="danger" icon="el-icon-back" circle class="exit" @click="exit"></el-button>
    </el-container>
  </div>
  
</template>

<script>
import HttpApi from '../../../util/http.js'
const {ipcRenderer,remote} = require('electron')
const {is} = require('electron-util');
export default {
  name: 'Temp',
  data:function(){
    return {
      fileList:[
        {name: 'a.jpeg', url: 'https://'}, 
      ],
      curImage:{},
      drawer:false,
      loading:false,
      isMac:is.macos,
    }
  },
  filters:{
    markdown:function(curImag){
      return "!["+ curImag.name +"]("+ curImag.url +")";
    },
    bbcode:function(curImag){
      return "[url="+curImag.url+"][img]"+curImag.url+"[/img][/url]"
    },
    html:function(curImag){
      return "<img src='"+curImag.url+"' alt='"+curImag.name+"'/>"
    }
  },
  methods:{
    copy(event){
      let input = event.currentTarget.parentElement.previousElementSibling
      input.select();
      clipboard.writeText(input.value, 'pi');
       this.$message({
         message: '已复制',
         duration:800
       });
    },
    exit(){
      ipcRenderer.send("m3nu-win");
    },
    handleDetail(file){
      this.curImage = file;
      this.drawer = true;
    },
    uploadSuccess(response,file,fileList){
      if(!response.success){
        const index = fileList.indexOf(file);
        if(index > -1){
          fileList.splice(index, 1)
        }
        this.loading = false;
        this.$notify.error({
          title: '错误',
          message: response.message,
          offset:15
        });
      }else{
        file.url = response.data.url;
        this.fileList.splice(1,0,file);
        this.loading = false;
      }
    },
    handleRemove(file, fileList){
      const index = this.fileList.indexOf(file);
      if(index > -1){
        this.fileList.splice(index, 1)
      }
    },
    beforeUpload(){
      this.loading = true;
    },
    fileExceed(files, fileList){
      this.$message("一次最多上传10张图片");
    },
    hide(){
      remote.getCurrentWindow().hide();
    },
    minimize(){
      remote.getCurrentWindow().minimize();
    }
  },
}
</script>
<style scoped>
.content{
  height: 100%;
  -webkit-user-select: none;
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
.el-container {
  height: 100%;
  padding:28px 10px 10px 10px;
}
.el-main{
  background-color: #fff;
  border-radius: 10px;
}
.exit{
  position: absolute;
  left: 20px;
  bottom: 20px;
}
.detail{
  padding: 15px;
}
.el-col >>> .el-upload--picture-card{
  position: absolute;
  left: 0;
  top: 0;
}
.el-col >>> .el-upload-list__item-actions{
  cursor: pointer;
}
.preview{
  width: 80%;
  height: 50%;
  margin: auto;
}
.preview-img{
  width: 100%;
  height: 100%;
} 
</style>
