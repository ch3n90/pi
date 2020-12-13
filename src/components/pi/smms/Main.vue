<template>
  <div class="main">
    <div class="container">
      <div class="images">
          <div class="item">
            <div class="image">
              <img src="" alt="">
            </div>
            <div class="name">
              <span>abc</span>
            </div>
            <div class="operate">
              <input type="button" name="a" value="a">
              <input type="button" name="b" value="b">
            </div>
          </div>

            <div class="item">
            <div class="image">
              <img src="" alt="">
            </div>
            <div class="name">
              <span>abc</span>
            </div>
            <div class="operate">
              <input type="button" name="a" value="a">
              <input type="button" name="b" value="b">
            </div>
          </div>


            <div class="item">
            <div class="image">
              <img src="" alt="">
            </div>
            <div class="name">
              <span>abc</span>
            </div>
            <div class="operate">
              <input type="button" name="a" value="a">
              <input type="button" name="b" value="b">
            </div>
          </div>

            <div class="item">
            <div class="image">
              <img src="" alt="">
            </div>
            <div class="name">
              <span>abc</span>
            </div>
            <div class="operate">
              <input type="button" name="a" value="a">
              <input type="button" name="b" value="b">
            </div>
          </div>
      </div>
      <div class="uploader"></div>
      <div class="result"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SMMS',
}
</script>

<style scoped>

.main{
  width: 100%;
  height: 100%;
  padding: 2%;
  background-color: #ccc;
}

.container{
  width: 96%;
  height: 96%;
  background-color: #999;
  margin: auto;
}
.images{
  width: 100%;
  height: 50%;
  background-color: #666;
}

.uploader{
  width: 100%;
  height: 10%;
  background-color: #555;
}

.result{
  width: 100%;
  height: 40%;
  background-color: #444;
}

.item{
  width: 25%;
  height: 100%;
  background-color: #888;
  /* padding: 0 2px; */
  float: left;
}
.item .image{
  width: 100%;
  height: 70%;
  background-color: #777;
}

.item .name{
  width: 100%;
  height: 15%;
  background-color: #222;
}

.item .operate{
  width: 100%;
  height: 15%;
  background-color: #100;
}
</style>
