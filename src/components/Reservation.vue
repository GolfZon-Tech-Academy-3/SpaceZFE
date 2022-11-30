<template>
  <div style="padding: 4.5%; height: 100vh">
    <h1 style="color: rgb(4, 20, 97, 1)">예약자 정보</h1>
    <div style="width: 45%; float: left">
      <p class="inputExpl">예약자 이름</p>
      <input
        class="resInput"
        v-model="resName"
        type="text"
        placeholder="체크인시 필요한 정보입니다"
      />
      <p class="inputExpl">휴대폰 번호</p>
      <input
        class="resInput"
        v-model="phoneNum"
        type="tel"
        placeholder="체크인시 필요한 정보입니다"
      />
      <button class="certiBtn" @click="phoneCerti">인증번호 보내기</button>
      <p class="phoneCerti" v-show="correctNum">휴대폰 번호를 확인해주세요</p>
      <p class="inputExpl">인증번호</p>
      <input
        v-model="phoneRes"
        type="text"
        placeholder="인증번호 입력"
        class="insertCerti"
      />
      <button class="certiDone" @click="certi">인증</button>
      <p class="phoneCerti">{{ resMessage }}</p>
      <p class="payWay">결제 방법</p>
      <select class="how2pay">
        <option value="신용/체크카드" selected>신용/체크카드</option>
        <option value="카카오 페이">카카오 페이</option>
        <option value="토스.삼성 페이">토스.삼성 페이</option>
      </select>
      <p>
        <input type="checkbox" v-model="allSelected" @click="selectAll" /><b
          >전체동의</b
        >
      </p>
      <p>
        <input type="checkbox" v-model="a" @click="selectA" />장소이용규칙 및
        취소/환불규정 동의<a style="color: red">(필수)</a>
      </p>
      <p>
        <input type="checkbox" v-model="b" @click="selectB" />개인정보 수집 및
        이용 동의<a style="color: red">(필수)</a>
      </p>
      <p>
        <input type="checkbox" v-model="c" @click="selectC" />개인정보 제 3자
        제공 동의<a style="color: red">(필수)</a>
      </p>
      <p>
        <input type="checkbox" v-model="d" @click="selectD" />만 14세 이상
        확인<a style="color: red">(필수)</a>
      </p>
    </div>
    <div
      style="width: 45%; float: right; background-color: #fafafa; padding: 3%"
    >
      <p style="margin-bottom: 1%">장소이름</p>
      <a style="font-size: 1.5rem">{{ resInfos.spaceName }} </a>
      <table class="typePriceTable" style="width: 90%">
        <tr>
          <th class="typePrice">타입</th>
          <th class="typePrice">가격</th>
        </tr>
        <tr>
          <td class="tdTypePrice">{{ resInfos.type }}</td>
          <td class="tdTypePrice" v-show="resInfos.type != '오피스'">
            {{ price }}원/시간
          </td>
          <td class="tdTypePrice" v-show="resInfos.type == '오피스'">
            {{ price }}원/일
          </td>
        </tr>
      </table>
      <p style="margin-bottom: 1%">시작 날짜 및 시간</p>
      <select
        v-show="resInfos.type != '오피스'"
        class="timeSelect"
        v-model="startSelected"
        @change="timeSelector"
      >
        <option selected disabled value="">시작시간</option>
        <option v-for="num in runningTime" :key="num">
          {{ time[num - 1] }}:00
        </option>
      </select>

      <div v-show="resInfos.type == '오피스'">
        <button
          @click="showStartDates"
          style="background-color: white; border: 1px solid white"
        >
          시작날짜
        </button>
        <a class="dayShow" v-show="showingStart">
          {{ startingDay }}일 00:00부터</a
        >
        <div v-show="showingSTartDates" style="padding: 3%">
          <button
            v-for="num in rentDays"
            :key="num"
            class="resDate"
            @click="startDate"
            :value="startDates[num - 1]"
          >
            {{ startDates[num - 1] }}
          </button>
        </div>
      </div>

      <p style="margin-bottom: 1%">종료 날짜 및 시간</p>
      <button
        v-show="resInfos.type == '오피스'"
        @click="showEndDates"
        style="background-color: white; border: 1px solid white"
      >
        종료날짜
      </button>
      <a class="dayShow" v-show="showingEnd"> {{ endingDay }}일 23:59까지 </a>
      <div v-show="showingEndDates" style="padding: 3%">
        <button
          v-for="num in rentDays"
          :key="num"
          class="resDate"
          @click="endDate"
          :value="endDates[num - 1]"
        >
          {{ endDates[num - 1] }}
        </button>
      </div>
      <select
        v-show="resInfos.type != '오피스' && endTimeShow"
        class="timeSelect"
        v-model="endSelected"
        @change="showCoast"
      >
        <option selected disabled value="">종료시간</option>
        <option v-for="num1 in minusEndTime" :key="num1">
          {{ restTimes[num1 - 1] }}:00
        </option>
      </select>
      <hr />
      <div v-show="showTotalCoast">
        <p style="margin-bottom: 1.5%; font-size: 1.4rem">총 결제 금액</p>
        <p
          style="
            margin-bottom: 1.5%;
            font-size: 1.4rem;
            color: #d14a58;
            font-weight: bolder;
          "
        >
          {{ totalCoast }}원
        </p>
        <label style="color: #4d6aed; font-weight: bolder">마일리지</label>
        <input
          type="number"
          v-model="mileage"
          style="width: 11%; margin-left: 2.5%; margin-right: 2.5%"
        />
        <button class="mileageBtn" @click="milCalcul">
          <a style="font-size: inherit">사용</a></button
        ><span style="font-size: 0.9rem; opacity: 0.4"
          >보유:{{ totalMileage }}점</span
        >
        <ul v-show="resInfos.type != '오피스'">
          <li>
            선결제 예약 시 보증금을 포함한 전 금액을 지불하고, 결제 금액의 5%가
            적립됩니다.
          </li>
          <li>보증금으로 예약 시 전 금액의 20% 가 결제됩니다.</li>
        </ul>
        <ul v-show="resInfos.type == '오피스'">
          <li>오피스 예약은 후불로 이루어지며, 선결제가 불가합니다.</li>
        </ul>
        <div v-show="resInfos.type != '오피스'">
          <button class="nOfficePayBtn" @click="prePay">선결제</button>
          <button class="nOfficePayBtn" @click="depositPay">보증금 결제</button>
        </div>
        <div v-show="resInfos.type == '오피스'">
          <button class="officePayBtn" @click="officePayBtn">후불 결제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Datepicker from "vue3-datepicker";
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";
import axios from "@/axios";
import { useStore } from "vuex";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const id = ref(route.query.id);

    const phoneRes = ref();
    const phoneNum = ref();
    const certiNum = ref();
    const resMessage = ref("");

    const allSelected = ref(false);
    const a = ref(false);
    const b = ref(false);
    const c = ref(false);
    const d = ref(false);
    const e = ref(false);
    const resName = ref("");

    const time = ref([]);
    const restTimes = ref([]);

    const startDates = ref([]);
    const endDates = ref([]);

    const correctNum = ref(false);
    const showTotalCoast = ref(true);

    const resInfos = ref({});

    const total = ref(0);

    const price = ref("");
    const totalCoast = ref("");

    const endTimeShow = ref(false);
    const minusEndTime = ref(0);
    const startSelected = ref("");
    const endSelected = ref("");
    const mileage = ref(0);
    const totalMileage = ref(0);
    let now = ref("");

    const showingSTartDates = ref(false);
    const showingEndDates = ref(false);
    const showingStart = ref(false);
    const showingEnd = ref(false);
    const startingDay = ref("");
    const endingDay = ref("");
    const rentDays = ref(30);
    const runningTime = ref([]);

    const inevitable = ref(0);

    const startingTime = ref([]);

    // const dates = ref([]);
    // const yearMonth = ref("");
    // let dateBoard = ref("");

    const date = new Date();
    now = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    //예약할 장소의 정보 불러오기
    const getResInfos = async () => {
      const res = await axios.get(`reservation/details/${id.value}`, {
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
      resInfos.value = { ...res.data };
      totalMileage.value = res.data.mileage;
      console.log(resInfos.value);
      console.log(resInfos.value.breakOpen);
      console.log(resInfos.value.breakClose);
      // console.log(store.state.memberId);

      //운영시간 구하기
      let open = parseInt(resInfos.value.openTime);
      let close = parseInt(resInfos.value.closeTime);
      let openB = parseInt(resInfos.value.breakOpen);
      let closeB = parseInt(resInfos.value.breakClose);

      for (let i = open; i <= close; i++) {
        if (i < openB || i > closeB) {
          runningTime.value.push(i);
        }
      }
      console.log(runningTime.value);
      // if (resInfos.value.breakClose && resInfos.value.breakOpen) {
      runningTime.value.slice(
        parseInt(resInfos.value.breakOpen),
        parseInt(resInfos.value.breakClose)
      );
      // }

      //단위 변완기
      price.value = resInfos.value.price
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    getResInfos();

    //정보제공 전체 동의 버튼
    const selectAll = () => {
      // console.log(e.target);
      // if (e.target.value == "on") {
      // }
      allSelected.value = !allSelected.value;
      a.value = true;
      (b.value = true), (c.value = true), (d.value = true);
    };
    const selectA = () => {
      allSelected.value = false;
      a.value = !a.value;
    };
    const selectB = () => {
      allSelected.value = false;
      b.value = !b.value;
    };
    const selectC = () => {
      allSelected.value = false;
      c.value = !c.value;
    };
    const selectD = () => {
      allSelected.value = false;
      d.value = !d.value;
    };

    //시간 만드는 함수
    const timeMaker = () => {
      let t;
      for (let i = 1; i < 25; i++) {
        t = i;
        if (i < 10) {
          t = "0" + i;
        }
        time.value.push(t);
      }
      //   console.log(time.value);
    };
    timeMaker();

    //종료시간 만드는 함수
    const timeSelector = () => {
      let closeTime = parseInt(resInfos.value.closeTime);
      endTimeShow.value = true;
      minusEndTime.value =
        closeTime - parseInt(startSelected.value.slice(0, 2));
      restTimes.value = time.value.slice(
        parseInt(startSelected.value.slice(0, 2))
      );
    };

    //비용 계산기
    const showCoast = () => {
      showTotalCoast.value = true;

      if (resInfos.value.type != "오피스") {
        const startTime = parseInt(startSelected.value.slice(0, 2));
        const endTime = parseInt(endSelected.value.slice(0, 2));

        total.value = (endTime - startTime) * resInfos.value.price;
      } else if (resInfos.value.type == "오피스") {
        //구한 날짜를 일수로 변환하는 함수
        const getDateDiff = (d1, d2) => {
          const date1 = new Date(d1);
          const date2 = new Date(d2);
          const diffDate = date1.getTime() - date2.getTime();
          return Math.abs(diffDate / (1000 * 60 * 60 * 24));
        };
        //db에 저장한 공간의 대여료 곱하기 위에서 구한 일수
        total.value =
          getDateDiff(endingDay.value, startingDay.value) *
          resInfos.value.price;
        total.value =
          getDateDiff(endingDay.value, startingDay.value) *
          resInfos.value.price;
      }
      totalCoast.value = total.value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    //마일리지 계산기
    const milCalcul = () => {
      if (mileage.value > totalMileage.value) {
        alert("사용가능한 마일리지를 초과했습니다");
        mileage.value = 0;
        return;
      }
      totalMileage.value -= mileage.value;
      // totalCoast.value = (total.value - mileage.value)
      //   .toString()
      //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      total.value -= mileage.value;
      totalCoast.value = total.value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    //휴대폰 인증 send
    const phoneCerti = async () => {
      if (!phoneNum.value) {
        correctNum.value = true;
      }
      const res = await axios.get(
        `/reservation/phoneCheck?phone=${phoneNum.value}`
      );
      certiNum.value = res.data;
    };

    //휴대폰 인증확인
    const certi = async () => {
      if (!phoneRes.value) {
        correctNum.value = true;
      } else if (phoneRes.value != certiNum.value) {
        resMessage.value = "인증번호가 다릅니다 다시 확인해주세요";
        phoneRes.value = "";
      } else if (phoneRes.value == certiNum.value) {
        resMessage.value = "인증성공";
      }
    };

    //보증금 결제
    const depositPay = async () => {
      if (
        !resName.value ||
        !total.value ||
        // !store.state.memberId ||
        !localStorage.getItem("memberId") ||
        !startSelected.value ||
        !endSelected.value ||
        !a.value ||
        !b.value ||
        !c.value ||
        !d.value
        // resMessage.value != "인증성공" (휴대폰 인증이 유료인 관계로 제한)
      ) {
        alert("입력을 다시 확인해주세요.");
        window.location.reload(true);
      } else {
        IMP.init("imp76177137");
        IMP.request_pay(
          {
            pg: "kakaopay.TCSUBSCRIP",
            pay_method: "card", // 기능 없음.
            merchant_uid: resInfos.value.merchant_uid, // 상점에서 관리하는 주문 번호
            name: resInfos.value.spaceName,
            amount: (total.value + mileage.value) * 0.2, // 빌링키 발급과 함께 40원 결제승인을 시도합니다. price의 20%만 계산해서 넣는다. //후결제인 경우, 0으로 넣는다.
            customer_uid: localStorage.getItem("memberId"), // 필수 입력
            buyer_email: "",
            buyer_name: "",
            buyer_tel: "",
          },
          async function (rsp) {
            if (rsp.success) {
              try {
                await axios
                  .post(
                    "reservation/post",
                    {
                      impUid: rsp.imp_uid,
                      prepayUid: rsp.merchant_uid,
                      reservationName: resName.value,
                      companyId: resInfos.value.companyId,
                      price: total.value,
                      spaceId: resInfos.value.spaceId,
                      mileage: mileage.value,
                      memberId: localStorage.getItem("memberId"),
                      payStatus: "003",
                      prepay: "001",
                      startDate: now + " " + startSelected.value,
                      // endDate: now + " " + endSelected.value,
                    },
                    {
                      headers: {
                        Authorization: localStorage.getItem("access_token"),
                      },
                    }
                  )
                  .then((res) => {
                    console.log(res);
                    if (res.status < 300 && res.status >= 200) {
                      alert("예약에 성공하였습니다.");
                      router.push({
                        name: "Home",
                      });
                    }
                  });
              } catch (error) {
                if (
                  error.response.status < 500 &&
                  error.response.status >= 400
                ) {
                  alert("입력을 다시 확인해주세요.");
                  window.location.reload(true);
                } else if (error.response.status >= 500) {
                  alert(
                    "일시적인 서버장애 오류입니다 나중에 다시 확인해주세요"
                  );
                  window.location.reload(true);
                }
              }
            }
          }
        );
      }
    };

    //선결제
    const prePay = async () => {
      if (
        !resName.value ||
        !total.value ||
        !parseInt(localStorage.getItem("memberId")) ||
        !startSelected.value ||
        !endSelected.value ||
        !a.value ||
        !b.value ||
        !c.value ||
        !d.value
        // resMessage.value != "인증성공" (휴대폰 인증이 유료인 관계로 제한)
      ) {
        alert("입력을 다시 확인해주세요.");
        window.location.reload(true);
      } else {
        IMP.init("imp76177137");
        IMP.request_pay(
          {
            pg: "kakaopay.TC0ONETIME",
            pay_method: "card", // 기능 없음.
            merchant_uid: resInfos.value.merchant_uid, // 상점에서 관리하는 주문 번호
            name: resInfos.value.spaceName,
            amount: total.value, // 빌링키 발급과 함께 40원 결제승인을 시도합니다. price의 20%만 계산해서 넣는다. //후결제인 경우, 0으로 넣는다.
            customer_uid: localStorage.getItem("memberId"), // 필수 입력
            buyer_email: "",
            buyer_name: "",
            buyer_tel: "",
          },
          async function (rsp) {
            if (rsp.success) {
              try {
                axios
                  .post(
                    "reservation/post",
                    {
                      impUid: rsp.imp_uid,
                      prepayUid: rsp.merchant_uid,
                      memberId: parseInt(localStorage.getItem("memberId")),
                      reservationName: resName.value,
                      companyId: resInfos.value.companyId,
                      payStatus: "002",
                      price: total.value,
                      prepay: "000",
                      spaceId: resInfos.value.spaceId,
                      startDate: now + " " + startSelected.value,
                      endDate: now + " " + endSelected.value,
                      mileage: mileage.value,
                    },
                    {
                      headers: {
                        Authorization: localStorage.getItem("access_token"),
                      },
                    }
                  )
                  .then((res) => {
                    console.log(res);
                    if (res.status < 300 && res.status >= 200) {
                      alert("예약에 성공하였습니다.");
                      router.push({
                        name: "Home",
                      });
                    }
                  });
              } catch (error) {
                if (
                  error.response.status < 500 &&
                  error.response.status >= 400
                ) {
                  alert("입력을 다시 확인해주세요.");
                  window.location.reload(true);
                } else if (error.response.status >= 500) {
                  alert(
                    "일시적인 서버장애 오류입니다 나중에 다시 확인해주세요"
                  );
                  window.location.reload(true);
                }
              }
            }
          }
        );
      }
    };

    //버튼들에 날짜 보여주는 함수
    const showingDates = () => {
      let currentYear = date.getFullYear();
      let currentMonth = date.getMonth() + 1;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }

      if (currentMonth < 10) {
        currentMonth = "0" + currentMonth;
      }

      let days = new Date(currentYear, currentMonth, 0).getDate();

      const today = date.getDate();
      let dates = [];

      //일수 만큼 배열에 추가
      for (let i = 1; i <= days; i++) {
        dates.push(i);
      }
      //당일 이전 날짜들 제거
      dates = dates.slice(today - 1);
      //30일 맞추기 위해 또 30일 만큼 추가
      for (let i = 1; i < 30; i++) {
        dates.push(i);
        //31일 이상 들어가면 마지막 요소 제거
        if (dates.length > 30) {
          dates.pop();
        }
      }
      //2월의 경우 총일수가 30미만일때
      if (days < 30) {
        console.log(1);
        //30일을 채우기 위한 반복문
        for (let j = 1; j + today == 30; j++) {
          dates.push(j);
        }
      }
      //배열에 들어간 일수 만큼 출력
      for (let i = 0; i < dates.length; i++) {
        //1일이 있으면 달 증가
        if (dates[i] === 1) {
          currentMonth++;
          //달이 12월이 넘으면 1월로 변경
          if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
          }
        }
        //일이 10미만일때 앞에 0붙여줌
        if (dates[i] > 0 && dates[i] < 10) {
          dates[i] = `0${dates[i]}`;
          // dates[i] = dates[i].replace(1, "");
          // console.log(dates[i]);
        }
        startDates.value.push(`${currentYear}/${currentMonth}/${dates[i]}`);
        // startDates.value[0] = "오늘";
      }
    };
    showingDates();

    //클릭하면 버튼목록 지우고 클릭한 날짜 띄우는 함수
    const startDate = (e) => {
      showingStart.value = true;
      showingSTartDates.value = !showingSTartDates.value;
      startingDay.value = e.target.value;
    };
    const endDate = (e) => {
      showingEnd.value = true;
      showingEndDates.value = !showingEndDates.value;
      endingDay.value = e.target.value;
      showCoast();
    };

    //버튼들 보여주는 함수
    const showStartDates = () => {
      showingSTartDates.value = !showingSTartDates.value;
      // if (startingDay.value) {
      //   startingDay.value = "";
      // }
      // console.log(startingDay.value);
    };

    //종료날짜 버튼에 띄우는 함수
    const showEndDates = () => {
      showingEndDates.value = !showingEndDates.value;
      //시작일의 문자열을 잘라서 사용
      let day = parseInt(startingDay.value.slice(8, 10));
      let resYear = startingDay.value.slice(0, 4);
      let resMonth = startingDay.value.slice(5, 7);
      // if (resMonth > 12) {
      //   resMonth = 1;
      //   resYear++;
      // }

      let dates = [];
      let days = new Date(resYear, resMonth, 0).getDate();

      //dates배열을 해당 월수 만큼 늘리기
      for (let i = 1; i <= days; i++) {
        dates.push(i);
      }
      //배열에 예약일(오늘) 이전 날짜들 삭제
      dates = dates.slice(day);
      //만약 말일을 선택하면 배열이 0이 되니까 월 변경
      if (dates.length < 1) {
        resMonth++;
      }
      //삭제하고 다시 배열의 길이가 30이 되도록 추가
      for (let i = 1; i < 31; i++) {
        dates.push(i);
        //31일로 30일 초과면 마지막거 삭제
        if (dates.length > 30) {
          dates.pop();
        }
      }
      //2월(윤년포함)은
      if (days < 30) {
        //배열의 길이가 30이 될때까지 추가
        for (let j = 1; j + day == 30; j++) {
          dates.push(j);
        }
      }
      //계산한 일수들을 배열에 입력
      for (let i = 0; i < dates.length; i++) {
        //1일이 되면 자동으로 월바꿔주고 12월 넘으면 1월이 되면서 연도 증가
        if (dates[i] === 1 && dates[0] !== 1) {
          resMonth++;
          if (resMonth > 12) {
            resMonth = 1;
            resYear++;
          }
          //10월 이전들은 보기 안좋으니까 0추가
          if (resMonth < 10) {
            resMonth = "0" + resMonth;
          }
        }
        //일도 10일 이전은 0추가
        if (dates[i] > 0 && dates[i] < 10) {
          dates[i] = `0${dates[i]}`;
        }
        //배열에 입력하기 전에 월을 바꾸면 오류가 날수 있어서 여기서도 1일이되면 달추가
        if (dates[i] === 1 && dates[0] !== 1) {
          resMonth++;
        }
        endDates.value.push(`${resYear}/${resMonth}/${dates[i]}`);
      }
    };

    //오피스 결제
    const officePayBtn = () => {
      if (
        !resName.value ||
        !total.value ||
        !parseInt(localStorage.getItem("memberId")) ||
        !startingDay.value ||
        !endingDay.value ||
        !a.value ||
        !b.value ||
        !c.value ||
        !d.value
        // resMessage.value != "인증성공" (휴대폰 인증이 유료인 관계로 제한)
      ) {
        alert("입력을 다시 확인해주세요.");
        window.location.reload(true);
      } else {
        IMP.init("imp76177137");
        IMP.request_pay(
          {
            pg: "kakaopay.TCSUBSCRIP",
            pay_method: "card", // 기능 없음.
            merchant_uid: resInfos.value.merchant_uid, // 상점에서 관리하는 주문 번호
            name: resInfos.value.spaceName,
            amount: 0, // 빌링키 발급과 함께 40원 결제승인을 시도합니다. price의 20%만 계산해서 넣는다. //후결제인 경우, 0으로 넣는다.
            customer_uid: localStorage.getItem("memberId"), // 필수 입력
            buyer_email: "",
            buyer_name: "",
            buyer_tel: "",
          },
          async function (rsp) {
            if (rsp.success) {
              try {
                axios
                  .post(
                    "reservation/post",
                    {
                      impUid: rsp.imp_uid,
                      reservationName: resName.value,
                      prepayUid: rsp.merchant_uid,
                      memberId: parseInt(localStorage.getItem("memberId")),
                      companyId: resInfos.value.companyId,
                      payStatus: "001",
                      price: total.value,
                      prepay: "002",
                      spaceId: resInfos.value.spaceId,
                      startDate: startingDay.value + " " + "00:00",
                      endDate: endingDay.value + " " + "23:59",
                      mileage: mileage.value,
                    },
                    {
                      headers: {
                        Authorization: localStorage.getItem("access_token"),
                      },
                    }
                  )
                  .then((res) => {
                    if (res.status < 300 && res.status >= 200) {
                      alert("예약에 성공하였습니다.");
                      router.push({
                        name: "Home",
                      });
                    }
                  });
              } catch (error) {
                if (
                  error.response.status < 500 &&
                  error.response.status >= 400
                ) {
                  alert("입력을 다시 확인해주세요.");
                  window.location.reload(true);
                } else if (error.response.status >= 500) {
                  alert(
                    "일시적인 서버장애 오류입니다 나중에 다시 확인해주세요"
                  );
                  window.location.reload(true);
                }
              }
            }
          }
        );
      }
    };

    return {
      inevitable,
      phoneRes,
      resName,
      phoneNum,
      certiNum,
      resMessage,
      phoneCerti,
      certi,
      total,
      showTotalCoast,
      showCoast,
      totalCoast,
      price,
      restTimes,
      minusEndTime,
      timeMaker,
      correctNum,
      a,
      time,
      b,
      c,
      d,
      selectA,
      selectB,
      selectC,
      selectD,
      timeSelector,
      //   selectList,
      endTimeShow,
      startSelected,
      endSelected,
      allSelected,
      selectAll,
      resInfos,
      mileage,
      totalMileage,
      milCalcul,
      depositPay,
      prePay,
      // dates,
      // yearMonth,
      // dateBoard,
      startDates,
      endDates,
      startDate,
      endDate,
      showStartDates,
      showingSTartDates,
      showingEndDates,
      showingStart,
      showingEnd,
      startingDay,
      endingDay,
      rentDays,
      showEndDates,
      officePayBtn,
      runningTime,
    };
  },
};
</script>

<style scoped>
.inputExpl {
  margin-bottom: 1%;
  margin-top: 3%;
  font-weight: 600;
  font-size: 1.3rem;
}
.resInput {
  width: 40%;
  height: 6vh;
  border-radius: 7px;
  border: 1px solid gray;
  padding-left: 2%;
}
.certiBtn {
  margin-left: 5%;
  opacity: 0.7;
  height: 6vh;
  background-color: white;
  border-radius: 7px;
  border: 1px solid gray;
}
.insertCerti {
  width: 25%;
  height: 6vh;
  border-radius: 7px;
  border: 1px solid gray;
  padding-left: 1%;
}
.certiDone {
  margin-left: 1%;
  opacity: 0.7;
  height: 6vh;
  width: 13%;
  background-color: white;
  border-radius: 7px;
  border: 1px solid gray;
}
.phoneCerti {
  font-size: 1rem;
  margin-top: 1%;
  margin-bottom: 1%;
  color: #ccb9e9;
}
.payWay {
  margin-bottom: 1%;
  margin-top: 20%;
  font-weight: 600;
  font-size: 1.3rem;
}
.how2pay {
  width: 30%;
  height: 5vh;
  border-radius: 8px;
  margin-bottom: 5%;
}
.typePrice {
  font-weight: 400;
  text-align: left;
}
.tdTypePrice {
  font-size: 1.3rem;
}
.typePriceTable {
  margin-top: 5%;
  margin-bottom: 5%;
}
.timeSelect {
  width: 30%;
  height: 6vh;
  border-radius: 7px;
  margin-bottom: 5%;
  opacity: 0.6;
}
.mileageBtn {
  height: 1.3rem;
  font-size: 0.7rem;
  background-color: white;
  border: 1px solid gray;
  opacity: 0.7;
  border-radius: 10px;
  margin-right: 2%;
}
.nOfficePayBtn {
  width: 40%;
  height: 10vh;
  background-color: #041461;
  color: white;
  margin: 3%;
  font-size: 1.3rem;
}
.officePayBtn {
  width: 80%;

  height: 10vh;
  background-color: #041461;
  color: white;
  margin: 3%;
  font-size: 1.3rem;
}
/* calender */
.rap {
  max-width: 820px;
  padding: 0 1.4rem;
  margin-top: 0.3rem;
  background-color: white;
}
.resDate {
  width: 20%;
  height: 7vh;
  color: #4d6aed;

  border: 1px solid white;
}
.resDate:hover {
  background-color: #4d6aed;
  color: white;
}
.dayShow {
  color: #4d6aed;
}

/* .dateHead {
  margin-bottom: 0.4rem;
}

.dateHead div {
  background: white;
  color: black;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 5px;
}

.grid div {
  padding: 0.6rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.dateBoard div {
  color: #222;
  font-weight: bold;
  min-height: 6rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.6rem;
  border: 1px solid #eee;
}

.noColor {
  background: #eee;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.btn {
  display: block;
  width: 20px;
  height: 20px;
  border: 3px solid #000;
  border-width: 3px 3px 0 0;
  cursor: pointer;
}

.prevDay {
  transform: rotate(-135deg);
}

.nextDay {
  transform: rotate(45deg);
}

.dateBoard div p {
  font-weight: normal;
  margin-top: 0.2rem;
} */
</style>
