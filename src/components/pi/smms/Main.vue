<template>
 <el-container>
  <el-main>
    <el-row>
        <el-col :span="22" :offset="1">
          <div class="imgs">
                <!-- <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture">
          </el-upload> -->

          </div>
      
        </el-col>
    </el-row>

     <el-row>
      <el-col>
        <div class="details"></div>
      </el-col>
    </el-row>
  </el-main>
  
  <!-- <el-button type="primary" icon="el-icon-upload" circle></el-button> -->
</el-container>

  
</template>

<script>
export default {
  name: 'SMMS',
}
</script>
<style scoped>
.el-container,.el-main{
  height: 100%;
}

.el-main .imgs{
  height: 70px;
  background-color: #888;
}

.el-main .details{
  height: 30%;
  background-color: #777;
}
/* .uploadBtn{
  position: absolute;
  bottom: 10px;
  right: 0px;
} */


</style>
