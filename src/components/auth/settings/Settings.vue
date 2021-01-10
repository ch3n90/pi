<template>
  <el-container>
    <router-link  to="/m3nu" class="back" >
      <el-page-header></el-page-header>
    </router-link>
  <el-main>
    <el-row class="setting-name-warp">
      <el-col :span="22" :offset="1">
        <div class="settings-name">设置</div>
      </el-col>
    </el-row>
      <el-row class="menu-item-warp">
          <el-col :span="24">
            <el-menu
              default-active="updater">
              <router-link to="/updater">
                <el-menu-item index="updater">
                  <i class="el-icon-menu"></i>
                  <span class="menu-name">软件更新</span>
                </el-menu-item>
              </router-link>
            </el-menu>
          </el-col>
      </el-row>
  </el-main>
</el-container>
</template>


<script>
const {ipcRenderer,remote} = require('electron')
export default {
  name: 'Settings',
  data(){
    return {
      apiKey: null,
      remember: false,
    }
  },
  methods:{
    
  },
  created(){
    this.$store.commit("setTitleBarFontColor","#000");
  }
}
</script>

<style scoped>
.el-container{
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #f3f3f8;
}
.back{
  position: absolute;
  left: 10px;
  top: 38px;
  z-index: 999;
  color: #000;
  text-decoration: none;
}
.el-page-header >>>.el-page-header__left::after{
  content: none;
}
.el-main{
  padding: 0;
  padding-top: 45px;
}
.setting-name-warp{
  /* height: 90%; */
  margin-top: 45px;
}
.settings-name{
  font-weight: bold;
  font-size: 20px;
}
.menu-item-warp{
  width: 100%;
  margin-top: 10px;
  height: 80%;
  text-decoration: none;
}
.menu-item-warp >>> .el-menu {
  border: none;
}
.menu-item-warp >>> .el-menu-item{
  padding-left: 10px!important;
  width: 100%;
  height: 35px;
  line-height: 35px;
}
.menu-name{
  text-decoration: none;
}
</style>