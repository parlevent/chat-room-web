<template>
  <div id="app">
    <!--<Login/>-->
    <router-view/>

  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Login from './components/Login'

export default {
  name: 'app',
  components: {
    Login
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  height: 100%;
}
</style>
