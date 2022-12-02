<template>
  <div class="form">
    <p class="qnaHeader">문의 내용 확인</p>
    <div class="frame">
      <tr class="nav">
        <td style="border-top-left-radius: 10px" class="head">장소 이름</td>
        <td class="head">문의 날짜</td>
        <td style="border-top-right-radius: 10px" class="head">답변 유무</td>
      </tr>
      <table v-for="num in qnas.length" :key="num">
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
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import axios from "axios";
import QnaAnswers from "@/components/myPage/QnaAnswers.vue";

export default {
  components: {
    QnaAnswers,
  },
  setup() {
    const qnaAnswer = ref({});
    const qnas = ref([]);
    let find;

    const getQnas = async () => {
      const res = await axios.get("mypage/inquiry/total", {
        headers: {
          Authorization: `${localStorage.getItem("access_token")}`,
        },
      });
      qnas.value = res.data;
      console.log(qnas.value);
      for (let i = 0; i < qnas.value.length; i++) {
        qnas.value[i].showMyqna = false;
        qnas.value[i].showMyAnswer = false;
      }
    };
    getQnas();

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
      console.log(find.showMyAnswer);
    };
    return {
      qnas,
      showContent,
      showAnwer,
      qnaAnswer,
      find,
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
</style>
