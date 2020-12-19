<template>
   <pi></pi>
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
  },
  created(){
    this.componentName = remote.getGlobal('cache').pi
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
