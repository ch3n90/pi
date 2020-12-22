<template>
<div>
  <el-container>
    <el-main>
    <el-row>
      <el-col :span="24">
            <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <el-link @click.stop="next('')"  type="primary">{{curBucket}}</el-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="prefix in prefixs" :key="prefix">
                <el-link @click.stop="next(prefix)"  type="primary"> {{prefix}} </el-link>
            </el-breadcrumb-item>
            </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
          <el-table
    :data="tableData"
    :default-sort="{prop:'date',order:'ascending'}"
    stripe
    style="width: 100%">
    <el-table-column
      prop="name"
      label="名称"
      cell-click="next">
      <template slot-scope="scope">
        <el-link v-if="scope.row.type === 0" style="margin-left: 10px" @click.stop="next(scope.row.name)"  type="primary">{{ scope.row.name }}</el-link>
        <span v-else style="margin-left: 10px">{{ scope.row.name }}</span>
      </template>
    </el-table-column>

    <el-table-column
      prop="size"
      label="大小">
    </el-table-column>

     <el-table-column
      prop="date"
      :formatter = "dateFormat"
      label="上传日期"
      sortable>
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
      </el-col>

    </el-row>
    </el-main>
  </el-container>
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
const remote = require('electron').remote
const Minio = require('minio')
export default {
  name: 'List',
  props:{
    objectList:Array,
    bucket:String,
    paths:Array,
  },
  data:function(){
    return {
      tableData:this.objectList,
      curBucket:this.bucket,
      curImage:{},
      drawer:false,
      prefixs:this.paths,
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
    next(prefix){
      this.$emit("func",prefix);
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
.el-table{
  font-size: 14px;
  margin-top: 10px;
}

.el-main{
  padding: 10px;
}
</style>
