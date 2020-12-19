<template>
<el-container>
  <el-main>
    <el-row :gutter="20" class="rows">
      <el-col :span="8">
        <router-link to="/smms">
          <div class="grid-content bg-purple">
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
          <div class="grid-content bg-purple">
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
  .rows{
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }

  .bg-purple {
    background: #DCDFE6;
  }
   .bg-purple:hover{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }

  .grid-content {
    border-radius: 4px;
    min-height: 100px;
  }

  .logo{
    margin-top: 5px;
  }
  .logo-img{
     width: 55px;
     height: 55px;
  }

  .title{
    margin-top: 20px;
    color: #000;
  }

  .url{
    color:#000
  }

</style>
