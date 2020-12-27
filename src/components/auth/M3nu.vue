<template>
<el-container>
  <el-main>
    <el-row :gutter="20" class="rows">
      <el-col :span="8">
        <router-link to="/smms">
          <div class="grid-content">
              <el-row style="margin-bottom:5px">
                <el-col :span="9" :offset="1">
                  <div class="logo">
                    <img src="../../assets/images/smms.webp" alt="" class="logo-img">
                  </div>
                </el-col>

                <el-col :span="11">
                  <div  class="title">sm.ms</div>                  
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11" :offset="1">
                  <span class="url">https://sm.ms</span>
                </el-col>
              </el-row>
          </div>
        </router-link>
      </el-col>

      <el-col :span="8">
        <router-link to="/postimage">
          <div class="grid-content">
              <el-row style="margin-bottom:5px">
                <el-col :span="9" :offset="1">
                  <div class="logo">
                    <img src="../../assets/images/postimage.png" alt="" class="logo-img">
                  </div>
                </el-col>

                <el-col :span="11">
                  <div  class="title">post.image</div>                  
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11" :offset="1">
                  <span class="url">https://postimages.org</span>
                </el-col>
              </el-row>
          </div>
        </router-link>
      </el-col>

      <el-col :span="8">
        
        <router-link to="/">
          <div class="grid-content">
           <div class="deving">coming soon</div>
              <el-row style="margin-bottom:5px">
                <el-col :span="9" :offset="1">
                  <div class="logo">
                    <img src="../../assets/images/imgbb.png" alt="" class="logo-img">
                  </div>
                </el-col>

                <el-col :span="11">
                  <div  class="title">imgbb.com</div>                  
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11" :offset="1">
                  <span class="url">https://imgbb.com</span>
                </el-col>
              </el-row>
          </div>
        </router-link>
      </el-col>

    </el-row>

    <el-row :gutter="20" class="rows">
      <el-col :span="8">
        <router-link to="/">
          <div class="grid-content">
            <div class="deving">coming soon</div>
              <el-row style="margin-bottom:5px">
                <el-col :span="9" :offset="1">
                  <div class="logo">
                    <img src="../../assets/images/qiniuyun.png" alt="" class="logo-img">
                  </div>
                </el-col>

                <el-col :span="11">
                  <div  class="title">七牛云</div>                  
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11" :offset="1">
                  <span class="url">https://portal.qiniu.com</span>
                </el-col>
              </el-row>
          </div>
        </router-link>
      </el-col>

      <el-col :span="8">
        <router-link to="/">
          <div class="grid-content">
            <div class="deving">coming soon</div>
              <el-row style="margin-bottom:5px">
                <el-col :span="9" :offset="1">
                  <div class="logo">
                    <img src="../../assets/images/oss.png" alt="" class="logo-img">
                  </div>
                </el-col>

                <el-col :span="11">
                  <div  class="title">OSS</div>                  
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="11" :offset="1">
                  <span class="url">https://aliyun.com</span>
                </el-col>
              </el-row>
          </div>
        </router-link>
      </el-col>

    </el-row>
      <br>
      <br>
      <br>
      <el-divider content-position="left">自建服务器</el-divider>
      <el-row :gutter="20" class="rows">
      <el-col :span="8">
        <router-link to="/minio">
          <div class="grid-content">
              <el-row style="margin-bottom:5px">
                <el-col :span="9" :offset="1">
                  <div class="logo">
                    <img src="../../assets/images/minio.svg" alt="" class="logo-img">
                  </div>
                </el-col>

                <el-col :span="11">
                  <div  class="title">minio</div>                  
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="23" :offset="1">
                  <span class="url">https://min.io</span>
                </el-col>
              </el-row>
          </div>
        </router-link>
      </el-col>
    </el-row>

  </el-main>
</el-container>
</template>


<script>
export default {
  name: 'M3nu',

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
  top: 40%;
  /* right: -10px; */
  transform: rotate(50deg);
  z-index: 999;
}

.rows{
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  background: #DCDFE6;
  border-radius: 5px;
  min-height: 100px;
  position: relative;
  overflow: hidden;
}
.grid-content:hover{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.logo{
  margin-top: 5px;
  
}
.logo-img{
    width: 55px;
    height: 55px;
    border-radius: 5px;
}

.title{
  margin-top: 20px;
  color: #606266;
  font-size: 16px;
}

.url{
  color:#606266;
  font-size: 14px;
}

.el-divider__text{
  background-color: #F5F5F5;
}

</style>
