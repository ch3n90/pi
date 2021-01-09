<template>
  <div v-loading="loading" class="uploader">
    <el-row>
      <el-col>
        <el-upload
          action="https://sm.ms/api/v2/upload"
          :on-remove="handleRemove"
          :on-success="uploadSuccess"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :headers="auth"
          :multiple=true
          :on-exceed="fileExceed"
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
  </div>

</template>

<script>
import HttpApi from '../../../util/http.js'
const {remote,clipboard} = require('electron')
export default {
  name: 'Upload',
  data:function(){
    return {
      fileList:[
        {name: 'a.jpeg', url: 'https://'}, 
      ],
      curImage:{},
      auth: null,
      drawer:false,
      loading:false,
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
    handleDetail(file){
      this.curImage = file;
      this.drawer = true;
    },
    uploadSuccess(response,file,fileList){
      if(!response.success){
        //upload fail
        const index = fileList.indexOf(file);
        if(index > -1){
          fileList.splice(index, 1)
        }
        this.$notify.error({
          title: '错误',
          message: response.message,
          offset:20
        });
      }else{
        //upload success
        file.url = response.data.url;
        this.fileList.splice(1,0,file);
      }
      this.loading = false;
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
    }
  },
  created(){
    this.auth = {"Authorization":remote.getGlobal('cache').token}
  }
}
</script>
<style scoped>

.uploader{
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
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
</style>
