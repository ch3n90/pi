<template>
<div>
  <el-container>
    <el-main>
    <el-row>
      <el-col :span="24">
            <el-breadcrumb separator=">">
            <el-breadcrumb-item>
              <el-link @click.stop="next({prefix:''})" type="primary">{{bucket.name}}</el-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="path in paths" :key="path.name">
                <el-link @click.stop="next(path)"  type="primary"> {{path.name}} </el-link>
            </el-breadcrumb-item>
            </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
          <el-table
          :data="objectList"
          :default-sort="{prop:'size',order:'ascending'}"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
            cell-click="next">
            <template slot-scope="scope">
              <el-link v-if="scope.row.size === 0" style="margin-left: 10px" @click.stop="next(scope.row)"  type="primary">{{ scope.row.name }}</el-link>
              <span v-else style="margin-left: 10px">{{ scope.row.show}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="size"
            width="80"
            label="大小">
          </el-table-column>

          <el-table-column
            prop="lastModified"
            :formatter = "dateFormat"
            label="上传日期"
            width="140"
            sortable>
          </el-table-column>

          <el-table-column label="操作" width="145">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>

              <el-button v-if="scope.row.size != 0"
                size="mini"
                @click="handleDetail(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    </el-main>
    
  </el-container>
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
 
  <el-dropdown class="uploader"  @command="uploadCommand">
    <span class="el-dropdown-link">
      <el-button type="danger" icon="el-icon-plus" circle ></el-button>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item icon="el-icon-folder-add" command="path">文件夹</el-dropdown-item>
      <el-dropdown-item icon="el-icon-picture-outline" command="image">文件</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</div>
  
</template>

<script>
const {remote,clipboard} = require('electron')
import HttpApi from '../../../util/http'
export default {
  name: 'List',
  props:{
    bucket:Object,
    token:Object,
  },
  data:function(){
    return {
      curImage:{},
      drawer:false,
      objectList:[],
      paths:[],
    }
  },
  watch:{
    bucket:function(newVal,oldVal){
      this.paths = [];
      this.listObject(newVal.name,"");
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
    handleDetail(index,row){
      this.curImage = row;
      this.drawer = true;
    },
    handleDelete(index, row){
      let deleteObject = "";
      if(row.size === 0){
        deleteObject = row.prefix;
      }else{
        deleteObject = row.name;
      }
      HttpApi.post(
        this.token.url,
        {id: 1, jsonrpc: "2.0", params: {bucketName: this.bucket.name, objects: [deleteObject]}, method: "Web.RemoveObject"},
        {
          headers:{
            "Authorization":"Bearer "+ this.token.jwt,
          }
        }
      ).then(resp => {
        if(resp.error){
          throw resp.error.message;
        }
        let path = "";
        if(this.paths && this.paths.length > 0){
          path = this.paths[this.paths.length - 1].prefix
        }
        this.listObject(this.bucket.name,path)
      }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err
          });
      })
    },
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
    next(next){
      // let next = this.paths[index];
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
    listObject(bucket,prefix){
        // {"id":1,"jsonrpc":"2.0","params":{"bucketName":"oss","prefix":""},"method":"Web.ListObjects"}
      this.objectList = [];
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
              ele.show = ele.name.substring(ele.name.lastIndexOf("/")+1);
            }
          });
          this.objectList = objectList;
        }
      }).catch(err => {
          this.$notify.error({
            title: '错误',
            message: err
          });
      });
    },
    dateFormat:function(row, column) {
      let time = row[column.property];
      if(time){
        time = new Date(time);
      }else{
        return "";
      }
      let fmt =  "yyyy/MM/dd HH:mm";
      var o = {
                  "M+": time.getMonth() + 1, // 月份
                  "d+": time.getDate(), // 日
                  "H+": time.getHours(), // 小时
                  "m+": time.getMinutes(), // 分
                  "s+": time.getSeconds(), // 秒
                  "q+": Math.floor((time.getMonth() + 3) / 3), // 季度
                  "S": time.getMilliseconds() // 毫秒
              };
      if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    }
  },
}
</script>
<style scoped>
.el-container{
  height: 100%;
}
.el-table{
  font-size: 14px;
  margin-top: 10px;
}

.el-main{
  padding: 10px;
  height: 100%;
}

.detail{
  padding: 15px;
}
.uploader{
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>
