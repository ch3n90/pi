<template>
<div class="main">
  <div class="frame">
    <div class="close iconfont icon-guanbi1"  @click="close"></div>
    <div class="min iconfont icon-jianhao" @click="minimize"></div>
  </div>

  <transition  name="flip"
        enter-active-class="flipInX"
        leave-active-class="flipOutX" mode="out-in">
    <router-view style="animation-duration: 0.5s"/>
  </transition>
</div>


</template>


<script>
import M3nu from './M3nu'
import 'vue2-animate/dist/vue2-animate.min.css'
import "../../assets/fonts/iconfont.css"
const remote = require('electron').remote

export default {
  name: 'Auth',
   render:function(c){
        return c(M3nu);
    },
  methods:{
    close(){
      remote.getCurrentWindow().close();
    },
    minimize(){
      remote.getCurrentWindow().minimize();
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  width: 100%;
  height: 100%;
}

.frame{
  background-color: #e9ebec;
  width: 100%;
  height: 35px;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  z-index: 999;
}
.frame div{
  width: 35px;
  height: 100%;
  -webkit-app-region: no-drag;
  float:right;
  line-height: 35px;
  text-align: center;
}
.close:hover{
  background-color: #f45454;
}

.min:hover{
  background-color: #888;
}

</style>
