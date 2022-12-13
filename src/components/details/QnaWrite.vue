<template>
  <div>
    <div
      class="offcanvas offcanvas-top"
      tabindex="-1"
      id="offcanvasTop"
      aria-labelledby="offcanvasTopLabel"
    >
      <div class="offcanvas-header">
        <div class="question">
          <p style="font-size: 1.3rem">
            {{ cName }}에 대해 궁금한 것이 있다면 물어보세요!
          </p>
          <textarea
            v-model="questions"
            cols="80"
            rows="5"
            style="font-size: 1rem"
          ></textarea>
          <img class="quesImg" src="@/assets/question.png" />
          <p>
            <button class="doneBtn" @click="qnaPost">작성 완료</button>
          </p>
        </div>
      </div>
      <div class="offcanvas-body"></div>
      <div class="offcanvas-footer"></div>
    </div>
    <div class="offcanvas-wrapper"></div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";
import axios from "axios";

const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
export default {
  props: {
    qnaAnswer: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const questions = ref("");
    const cid = ref(props.qnaAnswer.cid);
    const cName = ref(props.qnaAnswer.cName);

    const qnaPost = async (e) => {
      if (questions.value.length < 5) {
        alert("Q&A는 최소 5글자 이상 써주셔야합니다");
        questions.value = "";
      } else {
        try {
          await axios
            .post(
              `${proxy}inquiry/post/${cid.value}`,
              {
                inquiries: questions.value,
              },
              {
                headers: {
                  Authorization: store.state.accessToken,
                },
              }
            )
            .then((res) => {
              if (res.status === 200) {
                alert("문의사항이 등록되었습니다");
                router.go();
              }
            });
        } catch (error) {
          if (error.response.status < 500) {
            alert("작성 폼을 다시 확인해주세요");
            questions.value = "";
            router.go();
          } else {
            alert("일시적인 서버오류입니다 나중에 다시 작성해주세요");
            questions.value = "";
            router.go();
          }
        }
      }
    };

    return {
      questions,
      cid,
      qnaPost,
      cName,
    };
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
.question {
  height: 60%;
  background-color: white;
  padding: 2%;
  border-radius: 5px;
  word-break: break-all;
  text-align: left;
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
.doneBtn {
  background: white;
  border: 1px solid white;
  color: #041461;
  font-size: 1.4rem;
}
.doneBtn:hover {
  border-bottom: 1px solid #041461;
}
.quesImg {
  width: 4.5vw;
  height: 9vh;
}
</style>
