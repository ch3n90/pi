<template>
  <div id="app">
    <div class="menu">
       <div class="close iconfont icon-guanbi1"  @click="close"></div>
      <div class="min iconfont icon-jianhao" @click="minimize"></div>
    </div>

        <transition  name="flip"
            enter-active-class="flipInY"
            leave-active-class="flipOutY" mode="out-in">
        <router-view style="animation-duration: 0.5s"/>
      </transition>
  </div>
</template>

<script>

import 'vue2-animate/dist/vue2-animate.min.css'
import "./assets/fonts/iconfont.css"
const remote = require('electron').remote
export default {
  name: 'App',
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

<style scoped>
.menu{
  background-color: #e9ebec;
  width: 100%;
  height: 35px;
  position: absolute;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  z-index: 999;

}
.menu div{
  width: 35px;
  height: 100%;
   -webkit-app-region: no-drag;
  /* background: blue; */
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
.max:hover{
    background-color: #888;
}
#app{
  border-radius: 10px;
}
</style>
