<template>
<div class="main">
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
const {remote} = require('electron')

export default {
  name: 'Auth',
   render:function(c){
        return c(M3nu);
    },
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
