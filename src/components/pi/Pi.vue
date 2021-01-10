<template>
   <pi></pi>
</template>

<script>
const {ipcRenderer,remote} = require('electron')
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
        case "./smms/Temp" : return import('./smms/Temp')
        case "./postimage/Main" : return import('./postimage/Main')
        case "./postimage/Temp" : return import('./postimage/Temp')
        case "./minio/Main" : return import('./minio/Main')
        case "./settings/Settings" : return import('./settings/Settings')
      }
    }
  },
  methods:{
  },
  created(){
    this.componentName = remote.getGlobal('cache').pi
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
