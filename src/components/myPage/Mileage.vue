<template>
  <ErrorHandle
    :show="!!errorContent"
    title="Error"
    @home="errorHome"
    @refresh="errorRef"
  >
    <p>{{ errorContent }}</p>
  </ErrorHandle>
  <Spinner v-if="loading" />
  <div class="form">
    <h1 style="margin-bottom: 2%; font-weight: 700">마일리지 조회</h1>
    <div style="margin-bottom: 2.5%">
      <button class="btn" @click="all" v-show="allClick">전체</button>
      <button
        style="background-color: rgb(4, 20, 97, 1); color: white"
        class="btn"
        v-show="!allClick"
        @click="all"
      >
        전체
      </button>
      <button class="btn" @click="earned" v-show="earnedClick">적립</button>
      <button
        style="background-color: rgb(4, 20, 97, 1); color: white"
        class="btn"
        v-show="!earnedClick"
        @click="earned"
      >
        적립
      </button>
      <button class="btn" @click="used" v-show="usedClick">사용</button>
      <button
        style="background-color: rgb(4, 20, 97, 1); color: white"
        class="btn"
        v-show="!usedClick"
        @click="used"
      >
        사용
      </button>
      <button class="btn" @click="canceled" v-show="canceledClick">취소</button>
      <button
        style="background-color: rgb(4, 20, 97, 1); color: white"
        class="btn"
        v-show="!canceledClick"
        @click="canceled"
      >
        취소
      </button>
      <button class="btn" @click="refunded" v-show="refundedClick">환급</button>
      <button
        style="background-color: rgb(4, 20, 97, 1); color: white"
        class="btn"
        v-show="!refundedClick"
        @click="refunded"
      >
        환급
      </button>
    </div>
    <div v-if="mileages.length > 0">
      <table class="table" v-show="!allClick">
        <th>날짜</th>
        <th>업체</th>
        <th>마일리지</th>
        <th>상태</th>
        <!-- <hr /> -->
        <tr
          v-for="num in mileages.length < totalMileages
            ? mileages.length
            : totalMileages"
          :key="num"
        >
          <td>{{ mileages[num - 1].mileageDate }}</td>
          <td>{{ mileages[num - 1].spaceName }}</td>
          <td>{{ Math.abs(mileages[num - 1].score) }}</td>
          <td v-show="mileages[num - 1].status === '사용'">
            <b style="color: red">사용</b>
          </td>
          <td v-show="mileages[num - 1].status === '적립'">
            <b style="color: blue">적립</b>
          </td>
          <td v-show="mileages[num - 1].status === '환급'">
            <b style="color: blue">환급</b>
          </td>
          <td v-show="mileages[num - 1].status === '취소'"><b>취소</b></td>
        </tr>
        <button
          v-show="mileages.length > 0"
          class="showAll"
          @click="showAll"
          :disabled="mileages.length < totalMileages ? true : noMore"
        >
          전체 보기
        </button>
      </table>
      <table class="table" v-show="!earnedClick">
        <th>날짜</th>
        <th>업체</th>
        <th>마일리지</th>
        <th>상태</th>
        <tr v-for="num in getMile.length" :key="num">
          <td>{{ getMile[num - 1].mileageDate }}</td>
          <td>{{ getMile[num - 1].spaceName }}</td>
          <td>{{ Math.abs(getMile[num - 1].score) }}</td>
          <td>
            <b style="color: blue">적립</b>
          </td>
        </tr>
      </table>
      <table class="table" v-show="!usedClick">
        <th>날짜</th>
        <th>업체</th>
        <th>마일리지</th>
        <th>상태</th>
        <!-- <hr /> -->
        <tr v-for="num in useMile.length" :key="num">
          <td>{{ useMile[num - 1].mileageDate }}</td>
          <td>{{ useMile[num - 1].spaceName }}</td>
          <td>{{ Math.abs(useMile[num - 1].score) }}</td>
          <td>
            <b style="color: red">사용</b>
          </td>
        </tr>
      </table>
      <table class="table" v-show="!canceledClick">
        <th>날짜</th>
        <th>업체</th>
        <th>마일리지</th>
        <th>상태</th>
        <tr v-for="num in cancelMile.length" :key="num">
          <td>{{ cancelMile[num - 1].mileageDate }}</td>
          <td>{{ cancelMile[num - 1].spaceName }}</td>
          <td>{{ Math.abs(cancelMile[num - 1].score) }}</td>
          <td v-show="cancelMile[num - 1].status === '취소'"><b>취소</b></td>
        </tr>
      </table>
      <table class="table" v-show="!refundedClick">
        <th>날짜</th>
        <th>업체</th>
        <th>마일리지</th>
        <th>상태</th>
        <tr v-for="num in refundMile.length" :key="num">
          <td>{{ refundMile[num - 1].mileageDate }}</td>
          <td>{{ refundMile[num - 1].spaceName }}</td>
          <td>{{ Math.abs(refundMile[num - 1].score) }}</td>
          <td>
            <b style="color: blue">환급</b>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      <p class="hogaek" @click="toMain">
        <b style="color: rgb(4, 20, 97, 1)">SPACEZ</b>로 공간 예약해서 마일리지
        쌓으러 가기 !!! <span class="arrow">&rarr;</span>
        <span class="arrow2">GoGo!</span>
      </p>
      <Nothing what="마일리지가" />
    </div>
    <button
      class="showTotal"
      v-show="windowSize < 361"
      @click="showTotalMaileage"
    >
      총 마일리지 보기
    </button>
    <div class="total" v-show="showTotal" v-if="mileages.length > 0">
      <table class="milUsage">
        <th style="text-align: left">총 마일리지</th>
        <th style="text-align: right">{{ totalMileage }}점</th>
        <tr>
          <td style="text-align: left">적립</td>
          <td style="text-align: right">{{ totalGet }}점</td>
        </tr>
        <tr>
          <td style="text-align: left">환급</td>
          <td style="text-align: right">{{ totalRefund }}점</td>
        </tr>
        <tr>
          <td style="text-align: left">사용</td>
          <td style="text-align: right">{{ totalUse }}점</td>
        </tr>
        <tr>
          <td style="text-align: left">취소</td>
          <td style="text-align: right">{{ totalCancel }}점</td>
        </tr>
      </table>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ErrorHandle from "@/components/UI/BaseDialog.vue";
import Spinner from "@/components/UI/Spinner.vue";
import Nothing from "@/components/UI/Nothing.vue";

export default {
  components: {
    ErrorHandle,
    Spinner,
    Nothing,
  },
  setup() {
    const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
    const allClick = ref(false);
    const earnedClick = ref(true);
    const usedClick = ref(true);
    const canceledClick = ref(true);
    const refundedClick = ref(true);

    const windowSize = computed(() => {
      return window.innerWidth;
    });
    const showTotal = ref(window.innerWidth > 360 ? true : false);

    const totalMileage = ref(0);
    const totalGet = ref(0);
    const totalRefund = ref(0);
    const totalUse = ref(0);
    const totalCancel = ref(0);

    const getMile = ref([]);
    const useMile = ref([]);
    const cancelMile = ref([]);
    const refundMile = ref([]);

    const mileages = ref([]);
    const store = useStore();
    const router = useRouter();

    const errorContent = ref(null);
    const loading = ref(false);

    const totalMileages = ref(17);
    const noMore = ref(false);

    const getMileInfo = async () => {
      loading.value = true;
      try {
        await axios
          .get(`${proxy}/mypage/mileage?type=${"전체"}`, {
            headers: { Authorization: store.state.accessToken },
          })
          .then((res) => {
            totalMileage.value = res.data.totalScore;
            totalGet.value = res.data.rewardScore;
            totalCancel.value = res.data.canceledScore;
            totalUse.value = res.data.usedScore;
            totalRefund.value = res.data.refundScore;
            for (let i = 0; i < res.data.mileages.length; i++) {
              mileages.value.push(res.data.mileages[i]);
            }
            //마일 상태에 따라 분류 및 마일 상태에 따른 합 계산
            for (let i = 0; i < mileages.value.length; i++) {
              if (mileages.value[i].status === "적립") {
                getMile.value.push(mileages.value[i]);
                totalGet.value = totalGet.value + mileages.value[i].score;
              } else if (mileages.value[i].status === "사용") {
                useMile.value.push(mileages.value[i]);
                totalRefund.value = totalRefund.value + mileages.value[i].score;
              } else if (mileages.value[i].status === "취소") {
                cancelMile.value.push(mileages.value[i]);
                totalUse.value = totalUse.value + mileages.value[i].score;
              } else if (mileages.value[i].status === "환급") {
                refundMile.value.push(mileages.value[i]);
                totalCancel.value = totalCancel.value + mileages.value[i].score;
              }
            }
          });
      } catch (error) {
        errorContent.value = `오류가 발생했습니다 홈페이지로 이동하시거나
          버튼을 눌러 응답을 받을때까지 시도해 보십시오`;
      }
      loading.value = false;
    };
    getMileInfo();

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
      getMileInfo();
    };

    const showAll = () => {
      totalMileages.value += 6;
      if (totalMileages.value >= mileages.value.length) {
        totalMileages.value = mileages.value.length;
        noMore.value = true;
      }
    };

    const showTotalMaileage = () => {
      showTotal.value = !showTotal.value;
      // console.log(showTotal.value);
    };

    //버튼 바꿔주는 함수들
    const all = () => {
      allClick.value = !allClick.value;
      usedClick.value = true;
      earnedClick.value = true;
      canceledClick.value = true;
      refundedClick.value = true;
    };
    const earned = () => {
      earnedClick.value = !earnedClick.value;
      usedClick.value = true;
      allClick.value = true;
      canceledClick.value = true;
      refundedClick.value = true;
    };
    const used = () => {
      usedClick.value = !usedClick.value;
      allClick.value = true;
      earnedClick.value = true;
      canceledClick.value = true;
      refundedClick.value = true;
    };
    const canceled = () => {
      canceledClick.value = !canceledClick.value;
      allClick.value = true;
      earnedClick.value = true;
      refundedClick.value = true;
      usedClick.value = true;
    };
    const refunded = () => {
      refundedClick.value = !refundedClick.value;
      canceledClick.value = true;
      allClick.value = true;
      earnedClick.value = true;
      usedClick.value = true;
    };

    const toMain = () => {
      router.push({
        name: "Main",
      });
    };
    return {
      totalMileage,
      mileages,
      status,
      all,
      earned,
      used,
      canceled,
      refunded,
      allClick,
      earnedClick,
      usedClick,
      canceledClick,
      refundedClick,
      getMile,
      useMile,
      cancelMile,
      refundMile,
      totalGet,
      totalRefund,
      totalUse,
      totalCancel,
      errorContent,
      loading,
      errorHome,
      errorRef,
      totalMileages,
      showAll,
      noMore,
      toMain,
      windowSize,
      showTotalMaileage,
      showTotal,
    };
  },
};
</script>

<style scoped>
.form {
  width: 100%;
  text-align: center;
  padding-bottom: 2%;
  margin-left: 2%;
}
.btn {
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #999999;
  background-color: #fafafa;
  border-radius: 30px;
  border: 1px solid #fafafa;
  padding: 1%;
  margin-left: 0.5%;
  margin-right: 0.5%;
  width: 8%;
}
.btn:hover {
  background-color: rgb(4, 20, 97, 1);
  color: white;
}
.table {
  /* margin: auto; */
  opacity: 0.6;
  margin-top: 2.5%;
  float: left;
  width: 60%;
}
.table tr {
  font-weight: 600;
}
.table th {
  border-top: 0;
  border-bottom: 1px solid #dee2e6;
  font-size: 1.2em;
}
.table td {
  border-color: white;
}
.milUsage th {
  font-size: 1.2rem;
  border-bottom: 1px solid #dee2e6;
  padding: 0.75rem;
}
.milUsage td {
  padding: 2%;
  font-weight: 600;
}
.total {
  float: right;
  margin-right: 10%;
  margin-top: 0.5%;
  padding: 2%;
  background-color: #f6f7f8;
  border-radius: 15px;
}
table {
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
}
.showAll {
  background: white;
  border: 1px solid white;
}
.showAll:hover {
  border: 1px solid black;
  border-radius: 10px;
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
@media all and (max-width: 768px) {
  .form {
    width: 100%;
    text-align: center;
    padding: 0%2%2%2%;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }
  .btn {
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #999999;
    background-color: #fafafa;
    border-radius: 30px;
    border: 1px solid #fafafa;
    padding: 1%;
    margin-left: 0.5%;
    margin-right: 0.5%;
    width: 17%;
  }
  .btn:hover {
    background-color: rgb(4, 20, 97, 1);
    color: white;
  }
  .table {
    opacity: 0.6;
    margin-top: 2.5%;
    /* float: left; */
    width: 95%;
  }
  .table tr {
    font-weight: 600;
    font-size: 1em;
  }
  .table th {
    border-top: 0;
    border-bottom: 1px solid #dee2e6;
    font-size: 1em;
  }
  .table td {
    border-color: white;
  }
  .milUsage th {
    font-size: 1.2rem;
    border-bottom: 1px solid #dee2e6;
    padding: 0.75rem;
  }
  .milUsage td {
    padding: 2%;
    font-weight: 600;
  }
  .total {
    /* float: right; */
    /* margin-right: 10%; */
    margin-top: 0.5%;
    padding: 2%;
    background-color: #f6f7f8;
    border-radius: 15px;
  }
  table {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
  }
  .showTotal {
    background: white;
    border: 1px solid white;
  }
  .showTotal:hover {
    font-weight: 800;
  }
  .showAll {
    background: white;
    border: 1px solid white;
  }
  .showAll:hover {
    border: 1px solid black;
    border-radius: 10px;
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
}
</style>
