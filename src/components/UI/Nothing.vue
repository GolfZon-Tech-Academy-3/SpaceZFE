<template>
  <div class="noContents">
    <p class="ment">앗;; {{ what }} 없습니다!!</p>
    <img class="swag" src="@/assets/swag.png" />
  </div>
</template>

<script>
export default {
  props: {
    what: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.noContents {
  text-align: center;
  padding-left: 5%;
}
.ment {
  width: fit-content;
  position: relative;
  background: gray;
  color: white;
  padding: 2%;
  border-radius: 10px;
  margin-left: 40%;
}

.ment:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-top-color: gray;
  border-bottom: 0;
  border-left: 1px solid black;
  border-left: 0;
  margin-left: -10px;
  margin-bottom: -20px;
  border-bottom-left-radius: 0.1px;
}
.swag {
  position: relative;
  width: auto;
}
</style>
