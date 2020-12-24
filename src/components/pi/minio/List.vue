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
          v-loading="loading"
          :data="objectList"
          :default-sort="{prop:'date',order:'ascending'}"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
            cell-click="next">
            <template slot-scope="scope">
              <el-link v-if="scope.row.size === 0" style="margin-left: 10px" @click.stop="next(scope.row)"  type="primary">{{ scope.row.name }}</el-link>
              <span v-else style="margin-left: 10px">{{ scope.row.name}}</span>
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
              <el-button v-if="scope.row.size != 0"
                size="mini"
                @click="handleDetail(scope.$index, scope.row)">详情</el-button>

              <el-button  v-if="scope.row.size != 0"
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
    size="45%"
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
export default {
  name: 'List',
  props:{
    objectList:Array,
    bucket:Object,
    paths:Array,
    loading:Boolean,
  },
  data:function(){
    return {
      curImage:{},
      drawer:false,
      // prefixs:this.paths,
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
    next(next){
      // let next = this.paths[index];
      this.$emit("func",next);
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
