<template>
<div class="main">
  <div class="frame">
    <div class="close iconfont icon-guanbi1"  @click="close"></div>
    <div class="min iconfont icon-jianhao" @click="minimize"></div>
  </div>

   <pi></pi>
</div>


</template>


<script>

import "../../assets/fonts/iconfont.css"
const remote = require('electron').remote
export default {
  name: 'Pi',

  data:function(){
    return {
      componentName:'./smms/Main'
    }
  },
  components:{
    "pi": () => {
      switch(remote.getGlobal('cache').pi){
        case "./smms/Main" : return import('./smms/Main');
        case "./postimage/Main" : return import('./postimage/Main')
      }
    }
  },
  methods:{
    close(){
      remote.getCurrentWindow().close();
    },
    minimize(){
      remote.getCurrentWindow().minimize();
    }
  },
  created(){
    this.componentName = remote.getGlobal('cache').pi
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
