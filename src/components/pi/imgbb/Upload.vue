<template>
  <div  v-loading="loading"  class="uploader">
    <el-row>
      <el-col>
        <el-upload
              action=""
              :on-remove="handleRemove"
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
            <el-button slot="append" icon="el-icon-copy-document"  @click="copy"></el-button>
          </el-input>
        </el-collapse-item>
    </el-collapse>
    </div>
  </el-drawer>

  </div>

</template>

<script>
import HttpApi from '../../../util/http.js'
import qs from 'qs'
const md5 = require('md5')
const {remote,clipboard} = require('electron')
export default {
  name: 'Upload',
  data:function(){
    return {
      fileList:[
        {name: 'a.jpeg', url: 'https://'}, 
      ],
      curImage:{},
      drawer:false,
      key:null,
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
    uploader(request){
      this.loading = true;
      let file = request.file;
      if (file) {
        let ext = file.type.substring(file.type.indexOf("/") + 1);
        //将文件以Data URL形式读入页面
        let reader = new FileReader();
        reader.readAsDataURL(file);
          reader.onload = (e) => {
            let imgBase64 = reader.result;
            imgBase64 = imgBase64.substring(imgBase64.indexOf(",") + 1);
            const form = {
              key:this.key,
              m:md5str,
              key:this.key,
              image:imgBase64,
              version:"1.0.1",
              name:file.name,
              portable:1,
              type: ext
            }

            // -----------------

            HttpApi.post(
              'https://api.imgbb.com/1/upload',
              qs.stringify(
                form
              ),
            )
            .then(response=>{
              response =response.replace(/&(?!(?:apos|quot|[gl]t|amp);|#)/g, '&amp;')
              xml2js.parseStringPromise(response ,{explicitArray : false})
              .then( result => {
                if(result.data.$.status === "200"){
                  this.loading = false;
                  let img = {
                    name:result.data.image.name,
                    url:result.data.links.hotlink
                  }
                  this.fileList.splice(1,0,img);
                }
              })
              .catch(function (err) {
                throw err;
              });
            }).catch(err => {
              this.loading = false;
              this.$notify.error({
                title: '错误',
                message: err,
                offset:15,
              });
            });

          }
        }
     
    },
    handleDetail(file){
      this.curImage = file;
      this.drawer = true;
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
  },
  created(){
     this.key = remote.getGlobal('cache').token;
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
