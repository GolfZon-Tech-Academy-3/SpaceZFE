<template>
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
    <div>
      <table class="table" v-show="!allClick">
        <th>날짜</th>
        <th>업체</th>
        <th>마일리지</th>
        <th>상태</th>
        <!-- <hr /> -->
        <tr v-for="num in mileages.length" :key="num">
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
    <div class="total">
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
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
export default {
  setup() {
    const allClick = ref(false);
    const earnedClick = ref(true);
    const usedClick = ref(true);
    const canceledClick = ref(true);
    const refundedClick = ref(true);

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

    const getMileInfo = async () => {
      const res = await axios.get("mypage/mileage?type=" + "전체", {
        headers: { Authorization: localStorage.getItem("access_token") },
      });
      totalMileage.value = res.data.totalScore;
      totalGet.value = res.data.rewardScore;
      totalCancel.value = res.data.canceledScore;
      totalUse.value = res.data.usedScore;
      totalRefund.value = res.data.refundScore;
      // console.log(res.data);
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
    };
    getMileInfo();

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
    };
  },
};
</script>

<style scoped>
.form {
  width: 100%;
  float: right;
  text-align: center;
  padding-right: 10%;
  padding-bottom: 2%;
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
  margin-left: 0.5%;
  margin-right: 0.5%;
  width: 5%;
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
.table th {
  border-top: 0;
  border-bottom: 1px solid #dee2e6;
  font-size: 1.2rem;
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
</style>
