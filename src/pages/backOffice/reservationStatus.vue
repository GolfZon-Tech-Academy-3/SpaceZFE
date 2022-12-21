<template>
  <div style="display: flex;flex-direction: column;">
    <MenuBar />
    <div class="content">
      <div style="width: 70% height: 2em;">
        <div class="status">
          <div class="reserved">
            금일 예약 {{ todayResv }} 건
          </div>
          <div class="canceled">
            <div style="font-weight: bold;white-space: nowrap;">
              금일 취소 {{ todayCancel }} 건
            </div>
          </div>
        </div>
      </div>

      <div class="condition">
        <span style="font-weight: bold">기간별 대여 금액 조회{{ money }}</span>
        <input class="date" type="date" v-model="startDate" />
        ~
        <input class="date" type="date" v-model="endDate" />
        <button class="search" @click="searchWithDateCondition">검색</button>
      </div>

      <div class="result">
        <table>
          <thead>
            <th>예약번호</th>
            <th>타입</th>
            <th>이름</th>
            <th>예약 날짜</th>
            <th>예약자 명</th>
            <th>예약 상태 처리</th>
          </thead>
          <tbody>
            <tr v-for="resv in reservations" :key="resv.reservationId">
              <td>{{ resv.reservationId }}</td>
              <td>{{ resv.type }}</td>
              <td>{{ resv.spaceName }}</td>
              <td>{{ resv.startDate }} ~ {{ resv.endDate }}</td>
              <td>{{ resv.reservationName }}</td>
              <td v-if="resv.status === '001'" style="color: #383ed8">
                예약 중<br />
                <button
                  class="button"
                  @click="cancelResv(resv.type, resv.reservationId)"
                >
                  취소
                </button>
                <button
                  class="button"
                  @click="completeResv(resv.reservationId)"
                >
                  완료 처리
                </button>
              </td>
              <td v-if="resv.status === '002'" style="color: #383ed8">
                예약 취소
              </td>
              <td v-if="resv.status === '004'" style="color: #383ed8">
                이용 완료
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import MenuBar from "./menuBar.vue";
import axios from "@/axios";
import { useStore } from "vuex";
export default {
  components: {
    MenuBar,
  },
  setup() {
    const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
    const store = useStore();
    const reservations = ref([]);
    const todayResv = ref(0);
    const todayCancel = ref(0);
    const startDate = ref("");
    const endDate = ref("");
    const money = ref("");

    //오늘 예약 수 얻기
    const getTodayResv = async () => {
      await axios
        .get(
          `${proxy}/back-office/reservation/count/${store.state.companyId}`,
          {
            headers: {
              Authorization: store.state.accessToken,
            },
          }
        )
        .then((res) => {
          todayResv.value = res.data;
        });
    };

    //오늘 예약 취소 수 얻기
    const getTodayCancel = async () => {
      await axios
        .get(`${proxy}/back-office/cancel/count/${store.state.companyId}`, {
          headers: {
            Authorization: store.state.accessToken,
          },
        })
        .then((res) => {
          todayCancel.value = res.data;
        });
    };

    getTodayResv();
    getTodayCancel();

    //예약 정보 얻기
    const getResvs = async () => {
      await axios
        .get(
          `${proxy}/back-office/reservation/total/${store.state.companyId}`,
          {
            headers: {
              Authorization: store.state.accessToken,
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          reservations.value = res.data;
        });
    };

    getResvs();

    //예약 취소하기
    const cancelResv = async (type, id) => {
      if (type === "오피스") {
        if (confirm("예약을 취소하시겠습니까?")) {
          await axios
            .put(`${proxy}/reservation/office-cancel/${id}`, null, {
              headers: {
                Authorization: store.state.accessToken,
              },
            })
            .then(() => {
              window.location.reload();
            });
        }
      } else {
        if (confirm("예약을 취소하시겠습니까?")) {
          await axios
            .put(`${proxy}/reservation/desk-cancel/${id}`, null, {
              headers: {
                Authorization: store.state.accessToken,
              },
            })
            .then(() => {
              window.location.reload();
            });
        }
      }
    };

    //이용 완료 처리하기
    const completeResv = async (id) => {
      if (confirm("이용 완료 처리하시겠습니까?")) {
        await axios
          .put(`${proxy}/back-office/reservation/done/${id}`, null, {
            headers: {
              Authorization: store.state.accessToken,
            },
          })
          .then(() => {
            window.location.reload();
          });
      }
    };

    //기간별 금액 조회
    const searchWithDateCondition = async () => {
      if (startDate.value > endDate.value) {
        alert("시작 날짜가 마지막 날짜보다 늦습니다");
        startDate.value = "";
        endDate.value = "";
        return;
      }
      if (startDate.value != "" && endDate.value != "") {
        await axios
          .post(
            `${proxy}/back-office/total-incomes/${store.state.companyId}`,
            {
              startDate: startDate.value,
              endDate: endDate.value,
            },
            {
              headers: {
                Authorization: store.state.accessToken,
              },
            }
          )
          .then((res) => {
            console.log(res.data);
            money.value =
              " : " +
              res.data.totalIncome
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
              "원";
            reservations.value = res.data.reservations;
          });
      }
    };

    return {
      reservations,
      cancelResv,
      completeResv,
      todayResv,
      todayCancel,
      getTodayResv,
      getTodayCancel,
      startDate,
      endDate,
      searchWithDateCondition,
      money,
    };
  },
};
</script>

<style scoped>
.reserved {
  width: 100px;
  height: 70%;
  background-color: #edf8e7;
  float: left;
  text-align: center;
  border-radius: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  white-space: nowrap;
}
.canceled {
  width: 100px;
  height: 70%;
  background-color: #fcdddd;
  float: right;
  text-align: center;
  border-radius: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  white-space: nowrap;
}
.content {
  width: 100%;
  height: calc(100vh - 3.75em);
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
}
.condition {
  width: 80%;
  height: 7%;
  margin: 1em auto;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}
.date {
  color: #9e9e9e;
  border: 1px #9e9e9e solid;
  padding: 0.7% 0.7%;
  border-radius: 2em;
  margin-left: 1em;
  margin-right: 1em;
}
.status {
  width: 60vw;
  height: 4em;
  margin: 1em auto;
}
.search {
  padding: 1% 3%;
  background-color: #041461;
  color: white;
  border: none;
  border-radius: 2em;
  cursor: pointer;
}
.button {
  padding: 1% 3%;
  background-color: #041461;
  color: white;
  border: none;
  border-radius: 2em;
  cursor: pointer;
}
.result {
  width: 80%;
  max-height: 70%;
  display: block;
  overflow-x: auto;
  overflow-y: auto;
  margin: 0 auto;
}
table {
  width: 100%;
  height: 80%;
  margin: 0 auto 3em auto;
  font-weight: bold;
  border-collapse: collapse;
  white-space: nowrap;
}
thead {
  height: 5%;
  min-height: 20px;
}
th {
  padding: 0.5em 0;
  border-bottom: 2px #a69a9a solid;
}
tr {
  height: 4em;
  border-bottom: 1px #a69a9a solid;
}
td {
  text-align: center;
  padding: 0.5em 0;
}
tbody {
  height: 95%;
}
</style>
