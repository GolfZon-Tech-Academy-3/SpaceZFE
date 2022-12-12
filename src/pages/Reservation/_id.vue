<template>
  <div>
    <Reservation />
  </div>
</template>

<script>
import Reservation from "@/components/Reservation.vue";
export default {
  components: {
    Reservation,
  },
  setup() {},
};
</script>

<style scoped>
div {
  height: auto;
  overflow: hidden;
  /* display: flex; */
  min-height: 400px;
}
</style>
