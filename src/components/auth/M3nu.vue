<template>
<el-container>
  <el-main>
    <el-row :gutter="20" class="rows">
      <el-col :span="6">
        <router-link to="/smms">
          <el-row>
            <el-col :span="24">
              <div class="logo">
                <img src="../../assets/images/smms.jpg" alt="" class="logo-img">
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24" class="app-name">
              <span>sm.ms</span>
            </el-col>
          </el-row>
        </router-link>
      </el-col>

      <el-col :span="6">
        <router-link to="/postimage">
          <el-row>
            <el-col :span="24">
              <div class="logo">
                <img src="../../assets/images/postimage.png" alt="" class="logo-img">
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24" class="app-name">
              <span>postimage</span>
            </el-col>
          </el-row>
        </router-link>
      </el-col>

      <el-col :span="6">
        <router-link to="/">
          <el-row>
            <el-col :span="24">
              <div class="logo">
                <div class="deving">deving</div>
                <img src="../../assets/images/imgbb.png" alt="" class="logo-img">
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24" class="app-name">
              <span>imgbb</span>
            </el-col>
          </el-row>
        </router-link>
      </el-col>

      <el-col :span="6">
        <router-link to="/">
              <el-row>
                <el-col :span="24">
                  <div class="logo">
                    <div class="deving">deving</div>
                    <img src="../../assets/images/qiniuyun.png" alt="" class="logo-img">
                  </div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24" class="app-name">
                  <span>七牛云</span>
                </el-col>
              </el-row>
        </router-link>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="rows">
      <el-col :span="6">
        <router-link to="/">
          <el-row>
            <el-col :span="24">
              <div class="logo">
                <div class="deving">deving</div>
                <img src="../../assets/images/oss.png" alt="" class="logo-img">
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24" class="app-name">
              <span>oss</span>
            </el-col>
          </el-row>
        </router-link>
      </el-col>

      <el-col :span="6">
        <router-link to="/minio">
              <el-row>
                <el-col :span="24">
                  <div class="logo">
                    <img src="../../assets/images/minio.png" alt="" class="logo-img">
                  </div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24" class="app-name">
                  <span>minio</span>
                </el-col>
              </el-row>
        </router-link>
      </el-col>

      
      <el-col :span="6">
        <router-link to="/">
              <el-row>
                <el-col :span="24">
                  <el-badge value="1" :hidden='$store.getters.getSettingsBadgeHidden'>
                    <div class="logo">
                      <img src="../../assets/images/settings.png" alt="" class="logo-img">
                    </div>
                  </el-badge>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24" class="app-name">
                  <span>设置</span>
                </el-col>
              </el-row>
        </router-link>
      </el-col>

    </el-row>
  </el-main>
</el-container>
</template>


<script>
export default {
  name: 'M3nu',
  created(){
    this.$store.commit("setTitleBarFontColor","#fff");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.deving{
  color: yellow;
  text-decoration: none;
  background-color: #bbb;
  width: 100%;
  text-align: center;
  position: absolute;
  line-height: 20px;
  font-size: 14px;
  top: 10%;
  right: -30%;
  transform: rotate(50deg);
  z-index: 999;
}
.el-container{
  width: 100%;
  height: 100%;
  padding-top: 28px;
}
.rows{
  margin-bottom: 20px;
  -webkit-user-select: none;
}
.logo{
  width: 63px;
  height: 63px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.logo-img{
  width: 63px;
  height: 63px;
  border-radius: 10px;
}

.app-name{
  color:#fff;
  font-size: 14px;
  text-align: center;
}
.el-col >>> .el-badge__content {
  border: none;
  background-color: #F94739;
  border-radius: 50%;
}
</style>
