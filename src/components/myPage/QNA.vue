<template>
  <div class="form">
    <h1 style="font-family: 'Italiana'; font-style: normal; font-weight: 500">
      문의 내용 확인
    </h1>
    <div class="frame">
      <tr class="nav">
        <td style="border-top-left-radius: 10px" class="head">Space</td>
        <td class="head">문의 날짜</td>
        <td style="border-top-right-radius: 10px" class="head">답변 유무</td>
      </tr>
      <table v-for="num in dumy.qnas" :key="num">
        <tr>
          <td>
            <b>{{ num.spaceName }}</b>
          </td>
          <td style="color: rgba(133, 133, 137, 1)">{{ num.date }}</td>
          <td v-if="num.answered === true"><b>완료</b></td>
          <td v-if="num.answered !== true"><b>미완료</b></td>
          <button class="btns" v-show="!num.show" @click="showContent(num)">
            펼치기
          </button>
          <button class="btns" v-show="num.show" @click="showContent(num)">
            접기
          </button>
        </tr>
        <tr v-show="num.show">
          <td colspan="3">
            <QnaAnswers :qnaAnswer="qnaAnswer" v-show="num.show" />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import QnaAnswers from "@/components/myPage/QnaAnswers.vue";
export default {
  components: {
    QnaAnswers,
  },
  setup() {
    const content = ref(false);
    const dumy = ref({
      qnas: [
        {
          qnaId: 1,
          memberId: "최슈",
          date: "2022-11-16",
          spaceName: "기다림에 익숙해진 내모습 뒤에",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents:
            "ㅏㅑㅓㅕㅗㅛnvcmnvcnvzxcnvncvxmvlsdvxcvdsvxvajwblsnfewiohfu2b3fsjdbfugbwkjfbsofobfwejkfbwauefoweabfwefbusdbfkjasbdfibweafubasdjkfbweuabfkjasdbfibweaufbslkadnㅜㅠㅐㅔㅢ",
          answered: false,
        },
        {
          qnaId: 2,
          memberId: "최슈",
          date: "2022-11-16",
          spaceName: "언제나 눈물이 흐르고 있어",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "abdefghijklmnopqrstuvwxyz",
          answered: true,
        },
        {
          qnaId: 3,
          memberId: "최슈",
          date: "2022-11-16",
          spaceName: "오늘밤 내방에 파티가 열렸지",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "123456789",
          answered: true,
        },
        {
          qnaId: 4,
          memberId: "최슈",
          date: "2022-11-16",
          spaceName: "그대를 위해 준비한 꽃은 어느새 시들고",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "qwertyuiop",
          answered: false,
        },
        {
          qnaId: 5,
          memberId: "최슈",
          date: "2022-11-16",
          spaceName: "술잔을 비우며 힘없이 울었지",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "asdfghjkl",
          answered: true,
        },
        {
          qnaId: 6,
          memberId: "최슈",
          date: "2022-11-16",
          spaceName: "또 다시 상상속으로 그댈 초대하는거야",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "zxcvbnm",
          answered: true,
        },
        {
          qnaId: 7,
          memberId: "최슈",
          date: "2022-11-16",
          spaceName: "워워어예에~~~",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "qazwsxdec",
          answered: false,
        },
      ],
    });

    const qnaAnswer = ref({});

    //qna배열에 담긴 정보 객체들에 접근해서 qna띄움
    const showContent = (num) => {
      num.show = !num.show;
      qnaAnswer.value = num;
    };
    return { dumy, content, showContent, qnaAnswer };
  },
};
</script>
<style scoped>
.form {
  width: 85%;
  /* float: right; */
  text-align: center;
  padding: 2%4%04%;
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
  margin-left: 15%;
  /* margin: auto; */
  width: 90%;
  padding: 5%;
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
  /* padding: 0.5%; */
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
</style>
