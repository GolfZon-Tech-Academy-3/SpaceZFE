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
              <p>내리뷰</p>
              <p>
                <span
                  v-for="num in reviewer.rating"
                  :key="num"
                  style="color: gold; font-size: 1.5rem"
                  >★
                </span>
              </p>
              <p>{{ reviewer.content }}</p>
              <!-- <p>{{ reviewer }}</p> -->
            </td>
            <td>
              <div class="buttons">
                <button id="edit" @click="change">수정</button>
                <button id="del" @click="del">삭제</button>
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
import axios from "axios";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
export default {
  props: {
    reviewer: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const router = useRouter();
    const store = useStore();
    const write = ref(false);
    const reviewId = ref(props.reviewer);

    const change = (e) => {
      context.emit("editOrDel", e.target.id);
      context.emit("reviewId", reviewId.value.reviewId);

      console.log(reviewId.value.reviewId);
    };

    const del = async () => {
      let con = confirm("정말 삭제하시겠습니까?");
      if (con == true) {
        try {
          await axios
            .delete(`${[proxy]}review/delete/${reviewId.value.reviewId}`, {
              headers: { Authorization: store.state.accessToken },
            })
            .then((res) => {
              if (res.status === 200) {
                alert("삭제가 완료되었습니다");
                router.go();
              }
            });
        } catch (error) {
          if (error.response.status < 500 && error.response.status >= 400) {
            alert("삭제가 완료되지 않았습니다.");
          } else if (error.response.status >= 500) {
            alert("일시적인 서버장애 오류입니다 나중에 다시 확인해주세요");
          }
        }
      } else {
        // router.go();
        return;
      }
    };

    return { reviewId, write, change, del };
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
