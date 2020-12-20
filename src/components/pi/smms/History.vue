<template>
<div>
   <el-table
    :data="tableData"
    :default-sort="{prop:'created_at',order:'descending'}"
    stripe
    style="width: 100%">
    <!-- <el-table-column
      prop="filename"
      label="名称">
    </el-table-column> -->
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
      width="60">
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
      width="130">
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleDetail(scope.$index, scope.row)">详情</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-drawer
  :visible.sync="drawer"
  :with-header="false">
    <br>
    <br>
       <el-input readonly v-bind:value="curImage.filename">
        <template slot="prepend">filename</template>
      </el-input>
    
    <br>
    <br>
      <el-input readonly v-bind:value="curImage.url">
        <template slot="prepend">URL</template>
      </el-input>

      <br>
    <br>
      <el-input readonly v-bind:value="curImage | markdown">
        <template slot="prepend">markdown</template>
      </el-input>
</el-drawer>
</div>
  
</template>

<script>
import HttpApi from '../../../util/http.js'
const remote = require('electron').remote
export default {
  name: 'History',
  data:function(){
    return {
      tableData:[],
      curImage:{},
      drawer:false
    }
  },
 filters:{
    markdown:function(curImag){
      return "!["+ curImag.storename +"]("+ curImag.url +")";
    },
  },
  methods:{
    handleDetail(index,row){
      this.curImage = row;
      this.drawer = true;
    },
    handleDelete(index, row){
      HttpApi.get(
        'https://sm.ms/api/v2/delete/' + row.hash,
      )
      .then(response=>{
        if(response.success){
          const index = this.tableData.indexOf(row);
          if(index > -1){
            this.tableData.splice(index, 1)
          }
           this.$notify({
              title: '成功',
              message: '图片删除成功',
              type: 'success'
            });
        }else{
          throw response.message;
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
        time = new Date(time * 1000);
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
  created(){
    this.auth = {"Authorization" : remote.getGlobal('cache').token} ;
    HttpApi.get(
      'https://sm.ms/api/v2/upload_history',
      {
        headers:this.auth
      }
    )
    .then(response=>{
      if(response.success){
        this.loading = false;
        this.tableData = response.data;
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
.el-table{
  font-size: 14px;
}

</style>
