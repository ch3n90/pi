<template>
  <el-container class="content" v-loading="loading">
    <el-main>
      <el-row>
      <el-col>
        <el-upload
              action=""
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              :http-request="uploader"
              :file-list="fileList"
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
                    @click.stop="handleRemove(file)"
                  >
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
  <el-button type="danger" icon="el-icon-back" circle class="exit" @click="exit"></el-button>
    </el-main>
  </el-container>
</template>

<script>
import HttpApi from '../../../util/http.js'
import qs from 'qs'
const md5 = require('md5')
const xml2js = require('xml2js');
const {ipcRenderer,remote} = require('electron')
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
      key:"8ca0b57a6bb9c4c33cd9e7ab8e6a7f05",
    }
  },
  filters:{
    markdown:function(curImag){
      return "!["+ curImag.name +"]("+ curImag.url +")";
    },
  },
  methods:{
    uploader(request){
      let file = request.file;
      if (file) {
        let ext = file.type.substring(file.type.indexOf("/") + 1);
        let md5str = md5(this.key)
        //将文件以Data URL形式读入页面
        let reader = new FileReader();
        reader.readAsDataURL(file);
          reader.onload = (e) => {
            let imgBase64 = reader.result;
            imgBase64 = imgBase64.substring(imgBase64.indexOf(",") + 1);
            const form = {
              o:md5str,
              m:md5str,
              key:this.key,
              image:imgBase64,
              version:"1.0.1",
              name:file.name,
              portable:1,
              type: ext
            }
            HttpApi.post(
              'http://api.postimage.org/1/upload',
              qs.stringify(
                form
              ),
            )
            .then(response=>{
              response =response.replace(/&(?!(?:apos|quot|[gl]t|amp);|#)/g, '&amp;')
              xml2js.parseStringPromise(response ,{explicitArray : false})
              .then(result => {
                if(result.data.$.status === "200"){
                  let img = {
                    name:result.data.image.name,
                    url:result.data.links.hotlink
                  }
                  this.fileList.splice(1,0,img);
                  this.loading = false;
                }else{
                  throw result.data.error;
                }
              }).catch(err => {
                this.loading = false;
                this.fileList.splice(this.fileList.length - 1,0);
                this.$notify.error({
                title: '错误',
                message: err
              });
              })
            }).catch(err => {
              this.loading = false;
              this.fileList.splice(this.fileList.length - 1,0);
              this.$notify.error({
                title: '错误',
                message: err
              });
            });
          }
        }
    },
    handleDetail(file){
      this.curImage = file;
      this.drawer = true;
    },
    beforeUpload(){
      this.loading = true;
    },
    handleRemove(file, fileList){
      const index = this.fileList.indexOf(file);
      if(index > -1){
        this.fileList.splice(index, 1)
      }
    },
    fileExceed(files, fileList){
      this.$message("一次最多上传1张图片");
    },
    exit(){
      ipcRenderer.send("m3nu-win");
    },
  },
}
</script>
<style scoped>
.content {
  height: 100%;
}
.exit{
  position: absolute;
  left: 10px;
  bottom: 10px;
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
