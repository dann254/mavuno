<template>
  <div id="app">
    <Nav/>
    <router-view/>
  </div>
</template>

<script>
import Nav from './components/Nav.vue'

export default {
  components: {
    Nav
  },
  data() {
    return {
      auth: localStorage.getItem('loggedIn')
    }
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
