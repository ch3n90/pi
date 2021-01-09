<template>
  <div class="content">
      <div class="title-bar" >
        <div class="el-icon-close"></div>
        <div class="el-icon-minus"></div>
      </div>
      <el-container v-loading="loading">
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
                <el-button slot="append" icon="el-icon-copy-document"  @click="copy"></el-button>
              </el-input>
            </el-collapse-item>
        </el-collapse>
        </div>
      </el-drawer>
      <el-button type="danger" icon="el-icon-back" circle class="exit" @click="exit"></el-button>
      </el-main>
      </el-container>
  </div>
  
</template>

<script>
import HttpApi from '../../../util/http.js'
import qs from 'qs'
const md5 = require('md5')
const xml2js = require('xml2js');
const {ipcRenderer,remote,clipboard} = require('electron')
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
                message: err,
                offset:15
              });
              })
            }).catch(err => {
              this.loading = false;
              this.fileList.splice(this.fileList.length - 1,0);
              this.$notify.error({
                title: '错误',
                message: err,
                offset:15
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

.title-bar div{
  width: 28px;
  text-align: center;
  line-height: 28px;
  float: right;
  -webkit-app-region: no-drag;
}

.title-bar div:nth-child(odd):hover{
  background-color: #f45454;
  color: #fff;
}
.title-bar div:nth-child(even):hover{
  background-color: #888;
}
.el-container {
  height: 100%;
  padding:28px 10px 10px 10px;
}
.el-main{
  border-radius: 10px;
  background-color: #fff;
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
</style>
