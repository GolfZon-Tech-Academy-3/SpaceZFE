<template>
  <div id="app">
    <Navbar />
    <div style="width: 100%; height: 3.75em;" />
    <router-view />
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
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 400;
  min-width: 335px;
  -webkit-user-drag: none;
}
body {
  margin: 0px;
}
select {
  font-family: 'Noto Sans KR', sans-serif;
  color: #757575;
}
select:focus {
  outline: none;
}
textarea {
  font-family: 'Noto Sans KR', sans-serif;
}
input {
  font-family: 'Noto Sans KR', sans-serif;
}
input:focus {
  outline: none;
}
button {
  font-family: 'Noto Sans KR', sans-serif;
}
img {
  -webkit-user-drag: none;
}
a {
  text-decoration: none;
}
</style>
