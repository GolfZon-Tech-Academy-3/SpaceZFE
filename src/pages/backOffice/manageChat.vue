<template>
  <div style="display: flex;flex-direction: column;">
    <MenuBar />
    <div style="width: 300px; height: 600px;box-shadow: 0 0 5px 0 gray;margin: 3em auto;border-radius: 1em;">
      <div style="width: 100%;height: 10%;background-color: gray;">
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from './menuBar.vue';
export default {
  components: {
    MenuBar,
  },
  setup() {

  }
}
</script>

<style>

</style>