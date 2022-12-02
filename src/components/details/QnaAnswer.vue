<template>
  <div>
    <div
      class="offcanvas offcanvas-top"
      tabindex="-1"
      id="offcanvasTop"
      aria-labelledby="offcanvasTopLabel"
    >
      <div class="offcanvas-header">
        <form class="answer">
          <p>호스트답변</p>
          <p>{{ qnaAnswer.answers }}</p>
        </form>
      </div>
      <div class="offcanvas-body"></div>
      <div class="offcanvas-footer"></div>
    </div>
    <div class="offcanvas-wrapper"></div>
  </div>
</template>

<script>
export default {
  props: {
    qnaAnswer: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style scoped>
.offcanvas-top {
  top: 0;
  right: 0;
  left: 0;
  height: auto;
  position: relative;
  background: white;
  z-index: 1;
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.2); */
}
.offcanvas-header {
  height: 40%;
}
.answer {
  height: 60%;
  background-color: rgba(215, 215, 215, 0.482);
  padding: 2%;
  border-radius: 5px;
  word-break: break-all;
}
p {
  opacity: 0.6;
}
.offcanvas-wrapper {
  position: absolute;
  z-index: 100;
  top: inherit;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
