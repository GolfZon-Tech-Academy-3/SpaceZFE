<template>
  <div>
    <div
      class="offcanvas offcanvas-top"
      tabindex="-1"
      id="offcanvasTop"
      aria-labelledby="offcanvasTopLabel"
    >
      <div class="offcanvas-header">
        <table class="answer">
          <tr>
            <td>
              <p>내리뷰{{ reviewer }}</p>
              <p>
                <span style="color: gold; font-size: 1.5rem">★ </span>
                { qnaAnswer.answerDate }
              </p>
              <p>{ qnaAnswer.anwserContents }</p>
            </td>
            <td>
              <div class="buttons">
                <button id="edit" @click="change">수정</button>
                <button id="del" @click="change">삭제</button>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="offcanvas-body"></div>
      <div class="offcanvas-footer"></div>
    </div>
    <div class="offcanvas-wrapper"></div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    reviewer: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {
    const write = ref(false);

    const change = (e) => {
      context.emit("editOrDel", e.target.id);
    };

    return { write, change };
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
}
.offcanvas-header {
  height: 40%;
}
.answer {
  width: 95%;
  margin-right: none;
  height: 60%;
  border-radius: 5px;
  text-align: left;
}
p {
  opacity: 0.6;
}
button {
  background-color: white;
  border: 1px solid white;
}
.buttons {
  float: right;
  height: 100%;
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
