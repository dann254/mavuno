<template>
  <div id="nav" class="container" v-if="auth === 'true'">
    <div class="n-brand h1">mavuno</div>
    <div class="n-links">
      <router-link :to="{ name: 'Farmers' }">Home</router-link>
      <router-link :to="{ name: 'Statistics' }">Statistics</router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'Nav',
  components: {
  },
  data() {
    return {
      auth: localStorage.getItem('loggedIn')
    }
  },
}
</script>

<style lang="scss" scoped>
#nav {
  display: flex;
  justify-content: space-between;
  padding-top: 80px;
  padding-bottom: 80px;

  .n-links {
    a {
      padding: 5px;
      margin-right: 10px;
      margin-left: 10px;
      display: inline-block;
      height: 100%;
      line-height: 48px;
      text-align: center;
      vertical-align: middle;
      text-decoration: none;
      font-size: 24px;
    }
  }
}
</style>
