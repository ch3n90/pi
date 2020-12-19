<template>
  <div>
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
    :with-header="false">
      <br>
      <br>
        <el-input readonly v-bind:value="curImage | markdown">
          <template slot="prepend">Markdown</template>
        </el-input>
      <br>
      <br>
        <el-input readonly v-bind:value="curImage.url">
          <template slot="prepend">URL</template>
        </el-input>
  </el-drawer>

  </div>

</template>

<script>
import HttpApi from '../../../util/http.js'
import qs from 'qs'
const md5 = require('md5')
const xml2js = require('xml2js');
const remote = require('electron').remote
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
              type:file.type.substring(file.type.indexOf("/") + 1)
            }

            // -----------------

            HttpApi.post(
              'http://api.postimage.org/1/upload',
              qs.stringify(
                form
              ),
            )
            .then(response=>{
              xml2js.parseStringPromise(response /*, options */)
              .then( result => {
                if(result.data.$.status === "200"){
                  let img = {
                    name:result.data.image[0].name[0],
                    url:result.data.links[0].hotlink[0]
                  }
                  this.fileList.push(img);
                }
              })
              .catch(function (err) {
                throw err;
              });
            }).catch(err => {
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
    handleRemove(file, fileList){
      const index = this.fileList.indexOf(file);
      if(index > -1){
        this.fileList.splice(index, 1)
      }
    },
    fileExceed(files, fileList){
      this.$message("一次最多上传1张图片");
    }
  },
  created(){
     this.key = remote.getGlobal('cache').token;
  }
}
</script>
<style scoped>

.el-col >>> .el-upload--picture-card{
  position: absolute;
  left: 0;
  top: 0;
}
.el-col >>> .el-upload-list__item-actions{
  cursor: pointer;
}
</style>
