<template>
<div class="main">
    <div class="container">
      <router-link to="/smms" class="item">
            <div class="item-inner">
              <div class="item-hd">
                <div class="log">
                  <img src="../../assets/images/smms.webp" alt="">
                </div>
                <div class="title">
                    <span>SM.MS</span>
                </div>
              </div>
              <div class="item-ft">
                https://sm.ms
              </div>
            </div>
        </router-link>

        <div class="item">
          <div class="item-inner">
              <div class="item-hd">
                <div class="log">
                  <img src="../../assets/images/postimage.png" alt="">
                </div>
                <div class="title">
                    <span>Post Image</span>
                </div>
              </div>
              <div class="item-ft">
                https://postimages.org
              </div>
          </div>
      </div>

    </div>
  </div>
</template>


<script>


export default {
  name: 'M3nu',

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.main{
  width: 100%;
  height: 100%;
}

.container{
  width: 95%;
  height: 90%;
  position: absolute;
  left: 2.5%;
  top: 35px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content:flex-start;
  padding-top: 5px;
}

.item{
  width: 180px;
  height: 100px;
  /* background-color: #fdfdfd; */
  border-radius: 5px;
  margin-bottom: 10px;
  border:1px solid #ccc;
  background-image: -webkit-linear-gradient(top,#fff,#f9f9f9);
  position: relative;
}

.item:hover{
  box-shadow: 2px 4px 6px #999;
}

.item-inner{
  /* background-color: pink; */
  width: 90%;
  height: 90%;
  position: absolute;
  left: 5%;
  top: 5%;
}

.item-hd{
  /* background-color: lightblue; */
  width: 100%;
  height: 60%;
}

.item-hd .log{
  width: 33%;
  height: 100%;
  /* background-color: pink; */
  float: left;
}

.item-hd .log img{
  height: 100%;
  width: 100%;
  border-radius: 5px;
}

.item-hd .title {
  padding-left: 60px;
  /* float: left60px; */
}

.item-ft{
  /* background-color: goldenrod; */
  width: 100%;
  height: 40%;
  line-height: 35px;
  color: #444;
}
</style>
