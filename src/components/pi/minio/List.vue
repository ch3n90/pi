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
          :default-sort="{prop:'size',order:'ascending'}"
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
        <el-collapse-item title="markdown" name="3">
          <el-input readonly v-bind:value="curImage | markdown">
          </el-input>
        </el-collapse-item>
        
        <el-collapse-item title="名称" name="filename">
          <el-input readonly v-bind:value="curImage.name">
          </el-input>
        </el-collapse-item>

        <el-collapse-item title="url" name="2">
          <el-input readonly v-bind:value="curImage.url">
          </el-input>
        </el-collapse-item>
      
    </el-collapse>
    </div>
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
    }
  },
 filters:{
    markdown:function(curImag){
      return "![图片]("+ curImag.url +")";
    },
  },
  methods:{
    handleDetail(index,row){
      this.curImage = row;
      this.drawer = true;
    },
    handleDelete(index, row){
      //{"id":1,"jsonrpc":"2.0","params":{"bucketName":"oss","objects":["user/avatar/ac5748ce585e4a0eab3581f7e8eab44b.png"]},"method":"Web.RemoveObject"}
      
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

</style>
