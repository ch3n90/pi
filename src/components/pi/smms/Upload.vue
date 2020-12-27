<template>
  <div class="uploader"
    v-loading="loading">
    <el-row>
      <el-col>
        <el-upload
              class="upload_list"
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
        <el-collapse-item title="markdown" name="markdown">
          <el-input readonly v-bind:value="curImage | markdown">
          </el-input>
        </el-collapse-item>
        
        <el-collapse-item title="名称" name="filename">
          <el-input readonly v-bind:value="curImage.name">
          </el-input>
        </el-collapse-item>

        <el-collapse-item title="url" name="url">
          <el-input readonly v-bind:value="curImage.url">
          </el-input>
        </el-collapse-item>
    </el-collapse>
    </div>
  </el-drawer>

  </div>

</template>

<script>
import HttpApi from '../../../util/http.js'
const remote = require('electron').remote
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
  },
  methods:{
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
          message: response.message
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
