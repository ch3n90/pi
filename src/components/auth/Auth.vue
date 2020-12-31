<template>
<div class="main">
  <transition  name="flip"
        enter-active-class="flipInX"
        leave-active-class="flipOutX" mode="out-in">
    <router-view style="animation-duration: 0.5s"/>
  </transition>

  <el-dialog
    title="更新提示"
    :visible.sync="dialogVisible"
    width="70%">
    <div v-for="(note,index) in releaseNote" :key="index">{{ note }}</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="agreeUpdate">确 定</el-button>
    </span>
  </el-dialog>

  <el-dialog
    title="下载中"
    :visible.sync="updateProcessBarVisible"
    width="28%">
      <el-progress type="circle" :percentage="percentage"></el-progress>
  </el-dialog>
</div>
</template>

<script>
import M3nu from './M3nu'
import 'vue2-animate/dist/vue2-animate.min.css'
const {ipcRenderer} = require('electron')

export default {
  name: 'Auth',
  data(){
    return {
      dialogVisible:false,
      updateProcessBarVisible:false,
      percentage:0,
      releaseNote:[],
    }
  },
  render:function(c){
        return c(M3nu);
  },
  methods:{
    agreeUpdate(){
      this.dialogVisible = false;
      ipcRenderer.send("agree-update")
    }
  },
  created(){
    ipcRenderer.once("update-available",(event,arg) => {
      this.releaseNote = arg.releaseNote;
      this.dialogVisible = true;
    });
    ipcRenderer.once("start-update",(event,arg) => {
      this.updateProcessBarVisible = true;
    });
    ipcRenderer.on("update-processbar",(event,arg) => {
      this.percentage = parseInt(arg.percent);
    });
    ipcRenderer.once("update-downloaded",(event,arg) => {
      this.updateProcessBarVisible = false;
      this.$confirm('下载完成，现在退出安装?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ipcRenderer.send("start-install")
        }).catch(() => {
        });
    })
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  width: 100%;
  height: 100%;
  background-color: #F5F5F5;
}
</style>
