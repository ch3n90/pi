<template>
  <div id="app">
    <div class="menu">
       <div class="close">c</div>
      <div class="max">b</div>
      <div class="min">a</div>
    </div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style scoped>
.menu{
  background-color: lightblue;
  width: 100%;
  height: 35px;
  -webkit-app-region: drag;
  -webkit-user-select: none;
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
