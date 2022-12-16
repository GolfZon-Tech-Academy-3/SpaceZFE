<template>
  <ErrorHandle
    :show="!!errorContent"
    title="Error"
    @home="errorHome"
    @refresh="errorRef"
  >
    <p>{{ errorContent }}</p>
  </ErrorHandle>
  <div class="form">
    <p class="qnaHeader">문의 내용 확인</p>
    <div class="frame">
      <tr class="nav">
        <td style="border-top-left-radius: 10px" class="head">장소 이름</td>
        <td class="head">문의 날짜</td>
        <td style="border-top-right-radius: 10px" class="head">답변 유무</td>
      </tr>
      <div style="width: 80%" v-if="qnas.length == 0">
        <p class="hogaek" @click="toMain">
          <b style="color: rgb(4, 20, 97, 1)">SPACEZ</b>에 궁금한거 물어보러
          가기!!! <span class="arrow">&rarr;</span>
          <span class="arrow2">GoGo!</span>
        </p>
        <Nothing what="Q&A가" />
      </div>
    </div>

    <table v-for="num in qnas.length < qna ? qnas.length : qna" :key="num">
      <tr>
        <td>
          <b>{{ qnas[num - 1].companyName }}</b>
        </td>
        <td style="color: rgba(133, 133, 137, 1)">
          {{ qnas[num - 1].inquiryTime }}
        </td>
        <td v-if="!qnas[num - 1].answers"><b>미완료</b></td>
        <td v-if="qnas[num - 1].answers"><b>완료</b></td>
        <button
          class="btns"
          v-show="!qnas[num - 1].showMyqna"
          @click="showContent(qnas[num - 1].inquiryId)"
        >
          펼치기
        </button>
        <button
          class="btns"
          v-show="qnas[num - 1].showMyqna"
          @click="showContent(qnas[num - 1].inquiryId)"
        >
          접기
        </button>
      </tr>
      <tr v-show="qnas[num - 1].showMyqna">
        <td colspan="3" style="text-align: left">
          <p>{{ qnas[num - 1].inquiries }}</p>
          <button
            class="qnaButton"
            @click="showAnwer(qnas[num - 1].inquiryId)"
            v-if="qnas[num - 1].answers !== ''"
          >
            답변보기
            <span style="color: black" v-show="!qnas[num - 1].showMyAnswer"
              >&#8744;</span
            >
            <span style="color: black" v-show="qnas[num - 1].showMyAnswer">
              &#8743;</span
            >
          </button>
          <button class="qnaButton" v-if="qnas[num - 1].answers === ''">
            답변보기
            <span style="color: black" v-show="!qnas[num - 1].showMyAnswer"
              >&#8744;</span
            >
            <span style="color: black" v-show="qnas[num - 1].showMyAnswer">
              &#8743;</span
            >
          </button>
          <QnaAnswers
            v-if="qnas[num - 1] !== null"
            :qnaAnswer="qnaAnswer"
            v-show="qnas[num - 1].showMyAnswer"
          />
        </td>
      </tr>
    </table>
    <div>
      <button
        class="showMore"
        :disabled="qnas.length < qna ? true : noMore"
        @click="showMore"
        v-if="qnas.length != 0"
      >
        더보기
      </button>
      <button class="toTop" v-show="qna > 4" @click="toTop">맨위로</button>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import ErrorHandle from "@/components/UI/BaseDialog.vue";
import QnaAnswers from "@/components/myPage/QnaAnswers.vue";
import Nothing from "@/components/UI/Nothing.vue";

export default {
  components: {
    QnaAnswers,
    ErrorHandle,
    Nothing,
  },
  setup() {
    const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
    const qnaAnswer = ref({});
    const qnas = ref([]);
    const errorContent = ref(null);

    const store = useStore();
    const router = useRouter();
    const qna = ref(4);
    const noMore = ref(false);

    let find;

    const getQnas = async () => {
      try {
        await axios
          .get(`${proxy}/mypage/inquiry/total`, {
            headers: {
              Authorization: store.state.accessToken,
            },
          })
          .then((res) => {
            qnas.value = res.data;
            console.log(qnas.value);
            for (let i = 0; i < qnas.value.length; i++) {
              qnas.value[i].showMyqna = false;
              qnas.value[i].showMyAnswer = false;
            }
          });
      } catch (error) {
        if (error.response.status < 500 && error.response.status >= 400) {
          alert("입력을 다시 확인해주세요.");
          router.go();
        } else if (error.response.status >= 500) {
          errorContent.value =
            "일시적인 서버장애 오류입니다 나중에 다시 확인해주세요";
        }
      }
    };
    getQnas();

    //get에러시 홈페이지로
    const errorHome = () => {
      errorContent.value = null;
      router.push({
        name: "Home",
      });
    };

    //get에러시 계속 호출
    const errorRef = () => {
      errorContent.value = null;
      getQnas();
    };

    //qna배열에 담긴 정보 객체들에 접근해서 qna띄움
    const showContent = (num) => {
      let i = num;
      find = qnas.value.find((num) => num.inquiryId === i);
      find.showMyqna = !find.showMyqna;
      qnaAnswer.value = find;
      console.log(find.showMyqna);
    };

    const showAnwer = (num) => {
      let i = num;
      find = qnas.value.find((num) => num.inquiryId === i);
      find.showMyAnswer = !find.showMyAnswer;
      qnaAnswer.value = find;
      //답변 열고 다른 답변을 열면 닫는 함수
      for (let i = 0; i < qnas.value.length; i++) {
        if (qnas.value[i].inquiryId != find.inquiryId) {
          qnas.value[i].showMyAnswer = false;
        }
      }
    };

    //더보기
    const showMore = () => {
      qna.value += 4;
      if (qna.value >= qnas.value.length) {
        qna.value = qnas.value.length;
        noMore.value = true;
        return;
      }
    };

    //맨위로
    const toTop = (e) => {
      let where = e.path.length - 4;
      e.path[where].scrollIntoView(true);
      e.path[where].scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      qna.value = 4;
      noMore.value = false;
    };

    const toMain = () => {
      router.push({
        name: "Main",
      });
    };

    return {
      qnas,
      showContent,
      showAnwer,
      qnaAnswer,
      find,
      errorContent,
      errorHome,
      errorRef,
      qna,
      noMore,
      showMore,
      toTop,
      toMain,
    };
  },
};
</script>
<style scoped>
.qnaHeader {
  font-family: "Italiana";
  font-style: normal;
  font-weight: 500;
  font-size: 2.5rem;
  text-align: center;
  width: fit-content;
  margin-top: 1%;
  margin-left: 25%;
}
.form {
  width: 85%;
  text-align: center;
  padding-top: 0%;
  margin-left: 15%;
  /* padding: 2%0%0%4%; */
}
.frame {
  margin: auto;
  padding-top: 2%;
}
.nav {
  margin-left: 15%;
  width: 90%;
}
table {
  width: 90%;
}
td {
  height: 7vh;
  border-bottom: 1px solid #dee2e6;
  font-size: 1.2rem;
  width: 17vw;
  padding: 1.5%;
}
.head {
  background: #d0d2e9;
  border-bottom: 3px solid black;
  font-weight: 600;
  font-size: 1.5rem;
  height: 7vh;
}
.btns {
  float: left;
  width: 5vw;
  margin-left: 5%;
  margin-top: 5%;
  font-size: 1.3rem;
  border-radius: 15px;
  /* background-color: white; */
  border: 1px solid white;
}
.qnaButton {
  color: #1e6ff4;
  font-weight: 800;
  background-color: white;
  border: 1px solid white;
  margin-bottom: 2.5%;
}
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: fit-content;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.4em;
  white-space: nowrap;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
.showMore {
  text-align: center;
  background: white;
  border: 1px solid white;
}
.showMore:hover {
  border-bottom: 1px solid black;
  transition: 0.1s;
}
.toTop {
  margin-left: 30%;
  background: white;
  border: 1px solid white;
}
.toTop:hover {
  border-top: 1px solid black;
  transition: 0.1s;
}
.hogaek {
  font-family: "Inter";
  font-style: normal;
  font-size: 1.2em;
}
.hogaek:hover > .arrow {
  color: red;
  font-weight: 700;
}
.arrow2 {
  color: white;
}
.hogaek:hover > .arrow2 {
  color: red;
  font-weight: 700;
}
</style>
