<template>
<div class="history"
  v-loading="loading">
   <el-table
    :data="tableData"
    :default-sort="{prop:'created_at',order:'descending'}"
    stripe
    style="width: 100%">
    <el-table-column
      prop="url"
      label="缩略图">
        <template slot-scope="scope">
            <el-image 
            :src="scope.row.url"
            style="width: 100px; height: 50px"></el-image>
        </template>
    </el-table-column>
    <el-table-column
      prop="size"
      label="大小"
      width="80">
    </el-table-column>

     <el-table-column
      prop="width"
      label="宽"
      width="60">
    </el-table-column>

     <el-table-column
      prop="height"
      label="高"
       width="60">
    </el-table-column>

     <el-table-column
      prop="created_at"
      :formatter = "dateFormat"
      label="上传日期"
      sortable
      width="140">
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
         <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>

        <el-button
          size="mini"
          @click="handleDetail(scope.$index, scope.row)">详情</el-button>
      </template>
    </el-table-column>
  </el-table>

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
</div>
</template>

<script>
import HttpApi from '../../../util/http.js'
import dayjs from 'dayjs'
const {remote,clipboard} = require('electron')
const fmt =  "YYYY/MM/DD HH:mm";
export default {
  name: 'History',
  data:function(){
    return {
      tableData:[],
      curImage:{},
      drawer:false,
      loading:false,
    }
  },
 filters:{
    markdown:function(curImag){
      return "!["+ curImag.storename +"]("+ curImag.url +")";
    },
    bbcode:function(curImag){
      return "[url="+curImag.url+"][img]"+curImag.url+"[/img][/url]"
    },
    html:function(curImag){
      return "<img src='"+curImag.url+"' alt='"+curImag.storename+"'/>"
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
      this.loading = true;
      HttpApi.get(
        'https://sm.ms/api/v2/delete/' + row.hash,
      )
      .then(response=>{
        if(response.success){
          const index = this.tableData.indexOf(row);
          if(index > -1){
            this.tableData.splice(index, 1)
          }
          this.loading =false;
          this.$notify({
              title: '成功',
              message: '图片删除成功',
              type: 'success'
            });
        }else{
          throw response.message;
        }
      }).catch(err => {
        this.loading =false;
        this.$notify.error({
          title: '错误',
          message: err,
          offset:15
        });
      });
      
    },
    dateFormat:function(row, column) {
      let time = row[column.property];
      return dayjs(time * 1000).format(fmt)
    }
  },
  created(){
    this.loading = true;
    this.auth = {"Authorization" : remote.getGlobal('cache').token} ;
    HttpApi.get(
      'https://sm.ms/api/v2/upload_history',
      {
        headers:this.auth
      }
    )
    .then(response=>{
      if(response.success){
        this.tableData = response.data;
        this.loading = false;
      }else{
        throw response.message;
      }
    }).catch(err => {
      this.loading = false;
      this.$notify.error({
          title: '错误',
          message: err,
          offset:15
        });
    });
    
  }
}
</script>
<style scoped>
.history{
  height: 100%;
}
.el-table{
  font-size: 14px;
  border-radius: 10px;
}
.detail{
  padding: 15px;
}
</style>
