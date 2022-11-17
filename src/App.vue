<template>
  <div id="app">
    <Navbar />
    <div class="router">
      <router-view />
    </div>
  </div>  
  
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  components: {
    Navbar,
  }
}
</script>

<style>
#app {
  font-family: Inter;
  min-width: 1000px;
  height: 100%;
  min-height: 600px;
}
body {
  margin: 0px;
}
.router {
  height: 100%;
}
</style>
