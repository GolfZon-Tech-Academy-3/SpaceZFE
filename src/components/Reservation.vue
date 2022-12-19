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
  <div v-else class="entire">
    <div class="left">
      <h1 style="color: rgb(4, 20, 97, 1)">예약자 정보</h1>
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
      <select class="how2pay" @change="payWay" v-model="pay">
        <option disabled value="">결제방법을 골라주세요</option>
        <option value="SPACEZ 페이">SPACEZ 페이</option>
        <option value="신용/체크카드">신용/체크카드</option>
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
    <div class="right">
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

      <button
        v-show="resInfos.type != '오피스'"
        @click="showStartDates"
        class="dateBtn"
      >
        {{ startDay }}
      </button>
      <a
        class="showResedMent"
        v-show="
          showingStart &&
          resInfos.type != '오피스' &&
          restTimes.length > 0 &&
          closeResed
        "
        @mouseover="showResedTimes"
        @mouseleave="showResedTimes"
      >
        선택한 날짜({{ startDay }})의 예약 시간 보기
        <span class="arrow">&rarr;</span>
      </a>
      <a v-show="showResed">
        <span
          class="resed"
          v-for="num in restTimes.filter(Boolean).length"
          :key="num"
        >
          {{ restTimes.filter(Boolean)[num - 1] }}시
        </span>
      </a>
      <div
        v-show="showingSTartDates && resInfos.type != '오피스'"
        class="dateBtns"
      >
        <button
          class="goback"
          @click="goback"
          :disabled="buttons / 5 == 1"
          id="back"
        >
          &lt;
        </button>
        <button
          v-for="num in showingStartDates.length"
          :key="num"
          class="resDate"
          @click="startDate2"
          :value="showingStartDates[num - 1]"
        >
          {{ showingStartDates[num - 1].slice(5) }}
        </button>
        <button
          class="goback"
          @click="goback"
          :disabled="startDates.length == buttons"
          id="go"
        >
          &gt;
        </button>
      </div>
      <br />
      <select
        v-show="resInfos.type != '오피스'"
        class="timeSelect"
        v-model="startSelected"
        @click="closeResedTimes"
        @change="timeSelector"
      >
        <option selected disabled value="">시작시간</option>
        <option v-for="num in newRunningTime" :key="num">
          {{ time[num - 1] }}:00 시
        </option>
      </select>

      <a class="dayShow" v-show="showingStart && resInfos.type != '오피스'">
        {{ startingDay }}
        <span v-show="timeShow">{{ startSelected }}부터</span>
      </a>

      <div v-show="resInfos.type == '오피스'">
        <button @click="showStartDates" class="dateBtn">{{ startDay }}</button>
        <a class="dayShow" v-show="showingStart">
          {{ startingDay }} {{ resInfos.openTime }}시 부터</a
        >
        <div v-show="showingSTartDates" class="dateBtns">
          <button
            class="goback"
            @click="goback"
            :disabled="buttons / 5 == 1"
            id="back"
          >
            &lt;
          </button>
          <button
            v-for="num in showingOfficeStartDates.length"
            :key="num"
            class="resDate"
            @click="startDate"
            :value="showingOfficeStartDates[num - 1]"
          >
            {{
              showingOfficeStartDates[num - 1] == "<예약>"
                ? showingOfficeStartDates[num - 1]
                : showingOfficeStartDates[num - 1].slice(5)
            }}
          </button>
          <button
            class="goback"
            @click="goback"
            :disabled="startDates.length == buttons"
            id="go"
          >
            &gt;
          </button>
        </div>
      </div>

      <p style="margin-bottom: 1%">종료 시간</p>
      <button
        v-show="showingEnd && resInfos.type == '오피스'"
        @click="showEndDates"
        class="dateBtn"
      >
        {{ endDay }}
      </button>
      <a
        class="dayShow"
        v-show="showingDeskEnd && resInfos.type == '오피스' && endingDay != ''"
      >
        {{ endingDay }} {{ resInfos.closeTime }}시 까지
      </a>
      <div v-show="showingEndDates" class="dateBtns">
        <button
          class="goback"
          @click="goback"
          :disabled="buttons / 5 == 1"
          id="back"
        >
          &lt;
        </button>
        <button
          v-for="num in showingEndingDates.length"
          :key="num"
          class="resDate"
          @click="endDate"
          :value="showingEndingDates[num - 1]"
        >
          {{
            showingEndingDates[num - 1] == "<예약>"
              ? showingEndingDates[num - 1]
              : showingEndingDates[num - 1].slice(5)
          }}
        </button>
        <button
          class="goback"
          @click="goback"
          :disabled="startDates.length == buttons"
          id="go"
        >
          &gt;
        </button>
      </div>
      <br />
      <select
        v-show="endTimeShow"
        class="timeSelect"
        v-model="endSelected"
        @change="showCoast1"
      >
        <option selected disabled value="">종료시간</option>
        <option v-for="num1 in minusEndTime" :key="num1">
          {{ restTimes[num1 - 1] }}:00 시
        </option>
      </select>
      <a class="dayShow" v-show="showingDeskEnd && resInfos.type != '오피스'">
        {{ startingDay }} {{ endSelected }}까지
      </a>
      <hr />
      <div v-show="showTotalCoast">
        <p style="margin-bottom: 1.5%; font-size: 1.4rem">총 결제 금액</p>
        <p class="totalCoast">
          <span
            v-if="resInfos.type == '오피스'"
            v-show="startingDay != '' && endingDay != ''"
          >
            {{ totalCoast }}
          </span>
          <span v-else> {{ totalCoast }} </span>원
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
          <li>오피스 예약은 후불로 이루어지며, 선결제가 불가능합니다.</li>
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
import { useRoute, useRouter } from "vue-router";
import { ref, reactive } from "vue";
import axios from "@/axios";
import { useStore } from "vuex";

import ErrorHandle from "@/components/UI/BaseDialog.vue";
import Spinner from "@/components/UI/Spinner.vue";

import _ from "lodash";

export default {
  components: {
    ErrorHandle,
    Spinner,
  },
  name: "Reservation",
  setup() {
    const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
    const route = useRoute();
    const router = useRouter();
    const sid = ref(route.query.sid);
    const cid = ref(route.query.cid);
    const store = useStore();

    const phoneRes = ref();
    const phoneNum = ref();
    const certiNum = ref();
    const resMessage = ref("");
    const pay = ref("");
    const payWays = reactive({
      pre: "",
      nPre: "",
    });

    const allSelected = ref(false);
    const a = ref(false);
    const b = ref(false);
    const c = ref(false);
    const d = ref(false);
    const resName = ref("");

    const time = ref([]);
    const restTimes = ref([]);

    const startDates = ref([]);
    let buttons = ref(5);
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

    const showingSTartDates = ref(false);
    const showingEndDates = ref(false);
    const showingStart = ref(false);
    const timeShow = ref(false);
    const showingEnd = ref(false);
    const showingDeskEnd = ref(false);

    const startingDay = ref("");
    const startDay = ref("시작날짜");
    const endingDay = ref("");
    const endDay = ref("종료날짜");

    const rentDays = ref(30);
    const runningTime = ref([]);
    const showingStartDates = ref([]);
    const showingOfficeStartDates = ref([]);
    const showingEndingDates = ref([]);

    const usedTobeRunningTime = ref(runningTime.value);
    const newRunningTime = ref([]);
    let resTimes = [];
    const times = ref(true);
    let resedTime = 0;
    let resedFinTime = 0;

    const inevitable = ref(0);

    let reserved;
    let reservered = ref("");

    const errorContent = ref(null);
    const loading = ref(false);

    const showResed = ref(false);
    const closeResed = ref(true);
    const resedTimes = ref([]);

    const date = new Date();
    let now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    //예약할 장소의 정보 불러오기
    const getResInfos = async () => {
      loading.value = true;
      try {
        await axios
          .get(`${proxy}/reservation/details/${sid.value}`, {
            headers: {
              Authorization: store.state.accessToken,
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.status === 200) {
              resInfos.value = { ...res.data };
              totalMileage.value = res.data.mileage;
              console.log(resInfos.value);
              showingDates();

              //운영시간 구하기
              let open = parseInt(resInfos.value.openTime);
              let close = parseInt(resInfos.value.closeTime);
              let openB = parseInt(resInfos.value.breakOpen);
              let closeB = parseInt(resInfos.value.breakClose);

              for (let i = open; i <= close; i++) {
                if (i <= openB || i >= closeB) {
                  runningTime.value.push(i);
                }
              }

              //예약가능 날짜 구하기(오피스)
              reserved = resInfos.value.reservedTime;
              for (let i = 0; i < reserved.length; i++) {
                let found = startDates.value.find((e) => e == reserved[i]);
                for (let j = 0; j < startDates.value.length; j++) {
                  if (startDates.value[j] == found)
                    startDates.value[j] = "<예약>";
                }
              }

              //단위 변완기
              price.value = resInfos.value.price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
          });
      } catch (error) {
        errorContent.value = `오류가 발생했습니다 홈페이지로 이동하시거나
          버튼을 눌러 응답을 받을때까지 시도해 보십시오`;
      }

      loading.value = false;
    };
    getResInfos();

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
      getResInfos();
    };

    //정보제공 전체 동의 버튼
    const selectAll = () => {
      allSelected.value = !allSelected.value;
      if (allSelected.value) {
        a.value = true;
        (b.value = true), (c.value = true), (d.value = true);
      } else {
        a.value = false;
        (b.value = false), (c.value = false), (d.value = false);
      }
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

    //예약된 시간들 보여주기
    const showResedTimes = () => {
      showResed.value = !showResed.value;
    };

    //예약된 시간들 감추는 함수
    const closeResedTimes = () => {
      closeResed.value = false;
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
      console.log(time.value);
    };
    timeMaker();

    //시간 버튼들 움직이는 함수
    let x = 0;
    const goback = (e) => {
      if (e.target.id == "go") {
        buttons.value += 5;
        x += 5;
        showingStartDates.value = startDates.value.slice(x, buttons.value);
        showingOfficeStartDates.value = startDates.value.slice(
          x,
          buttons.value
        );
        showingEndingDates.value = endDates.value.slice(x, buttons.value);
        console.log(x, buttons.value);
      } else if (e.target.id == "back") {
        buttons.value -= 5;
        x -= 5;
        showingStartDates.value = startDates.value.slice(x, buttons.value);
        showingOfficeStartDates.value = startDates.value.slice(
          x,
          buttons.value
        );
        showingEndingDates.value = endDates.value.slice(x, buttons.value);
        console.log(x, buttons.value);
      }
      console.log(showingStartDates.value);
    };

    //마일리지 계산기
    const milCalcul = () => {
      if (mileage.value > totalMileage.value) {
        alert("사용가능한 마일리지를 초과했습니다");
        mileage.value = 0;
        return;
      }
      totalMileage.value -= mileage.value;
      total.value -= mileage.value;
      totalCoast.value = total.value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    //비용 계산기(비 오피스)
    const showCoast1 = (e) => {
      const breakFin = resInfos.value.breakClose.slice(0, 2);
      console.log(
        parseInt(e.target.value.slice(0, 2)),
        parseInt(startSelected.value.slice(0, 2)),
        resedTime,
        resedFinTime,
        breakFin
      );

      if (
        parseInt(startSelected.value.slice(0, 2)) < resedTime &&
        parseInt(e.target.value.slice(0, 2)) >= resedFinTime
      ) {
        alert(
          `선택하신 시간이 이미 예약된 시간(${resedTime}시 혹은 ${resedFinTime}시)을 포함하고 있습니다 다시 선택해 주세요`
        );
        endTimeShow.value = false;
        showingDeskEnd.value = false;
        endSelected.value = "";
        startSelected.value = "";
        timeShow.value = false;
        return;
      } else if (
        parseInt(startSelected.value.slice(0, 2)) < resedTime &&
        parseInt(e.target.value.slice(0, 2)) >= parseInt(breakFin)
      ) {
        alert(
          `선택하신 시간이 저희 장소 청소 및 휴게 시간(${resInfos.value.breakOpen.slice(
            0,
            2
          )}시~${breakFin}시)을 포함하고 있습니다 다시 선택해 주세요`
        );
        endTimeShow.value = false;
        showingDeskEnd.value = false;
        endSelected.value = "";
        startSelected.value = "";
        timeShow.value = false;
        return;
      }

      showTotalCoast.value = true;
      showingDeskEnd.value = !showingDeskEnd.value;
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

    //오피스용 비용계산기
    const showCoast = () => {
      showTotalCoast.value = true;
      // showingDeskEnd.value = !showingDeskEnd.value;
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
          return Math.abs(diffDate / (1000 * 60 * 60 * 24)) + 1;
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

    //휴대폰 인증 send
    const phoneCerti = async () => {
      if (!phoneNum.value) {
        correctNum.value = true;
      }
      const res = await axios.get(
        `${proxy}/reservation/phoneCheck?phone=${phoneNum.value}`
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
      if (!resName.value) {
        alert("예약자분 성함을 기재해 주세요");
      } else if (!total.value) {
        alert("예약 하실 날짜를 정해주세요");
      } else if (!store.state.memberId) {
        alert("로그인이 필요한 기능입니다");
      } else if (!startSelected.value) {
        alert("예약 시작 날짜를 정해주세요");
      } else if (!endSelected.value) {
        alert("예약 종료 날짜를 정해주세요");
      } else if (!payWays.pre) {
        alert("결제 수단을 선택해주세요");
      } else if (!a.value || !b.value || !c.value || !d.value) {
        alert("결제 관련 동의에 전부 체크해 주세요");
      }
      // else if (resMessage.value != "인증성공") {
      //   alert("휴대폰 인증이 유료인 관계로 제한");
      // }
      else if (pay.value === "SPACEZ 페이") {
        var clientKey = "test_ck_MGjLJoQ1aVZ5Rq9xWBd3w6KYe2RN";
        var customerKey = store.state.memberId; //memberId
        // BrandPay 객체 초기화
        var brandpay = BrandPay(clientKey, customerKey, {
          redirectUrl: `${window.location.origin}/payment/callback-auth`,
        });
        brandpay
          .requestPayment({
            amount: (total.value + mileage.value) * 0.2, // price의 20%만 계산해서 넣는다.
            orderId: resInfos.value.merchantUid, // 주문에 대한 고유한 ID 값 (merchant_uid)
            orderName: resInfos.value.spaceName, // 결제에 대한 주문명, spaceName
          })
          .then(function (rsp) {
            return axios.post(
              `${proxy}/reservation/toss-post`,
              {
                impUid: rsp.paymentKey,
                prepayUid: rsp.orderId,
                memberId: store.state.memberId,
                reservationName: resName.value,
                companyId: cid.value,
                price: total.value,
                payStatus: "003",
                prepay: "001",
                spaceId: resInfos.value.spaceId,
                startDate:
                  startingDay.value.slice(0, 10) + " " + startSelected.value,
                endDate:
                  startingDay.value.slice(0, 10) + " " + endSelected.value,
                mileage: mileage.value,
                toss: true,
                methodId: rsp.methodId,
                orderName: resInfos.value.spaceName,
              },
              {
                headers: {
                  Authorization: store.state.accessToken,
                },
              }
            );
          })
          .then(() => {
            alert("성공");
          });
      } else {
        try {
          await axios.post(
            `${proxy}/reservation/check`,
            {
              spaceId: resInfos.value.spaceId,
              startDate:
                startingDay.value.slice(0, 10) + " " + startSelected.value,
              endDate: startingDay.value.slice(0, 10) + " " + endSelected.value,
              prepay: "001",
            },
            {
              headers: {
                Authorization: store.state.accessToken,
              },
            }
          );
        } catch (error) {
          alert("예약 중복오류가 발생했습니다 나중에 다시 시도해 주세요");
          router.go();
          return;
        }

        IMP.init("imp76177137");
        IMP.request_pay(
          {
            pg: payWays.nPre,
            pay_method: "card", // 기능 없음.
            merchant_uid: resInfos.value.merchantUid, // 상점에서 관리하는 주문 번호
            name: resInfos.value.spaceName,
            amount: (total.value + mileage.value) * 0.2, // 빌링키 발급과 함께 결제승인을 시도합니다. price의 20%만 계산해서 넣는다. //후결제인 경우, 0으로 넣는다.
            customer_uid: store.state.memberId, // 필수 입력
            buyer_email: "",
            buyer_name: "",
            buyer_tel: "",
          },
          async function (rsp) {
            if (rsp.success) {
              try {
                await axios
                  .post(
                    `${proxy}/reservation/post`,
                    {
                      impUid: rsp.imp_uid,
                      prepayUid: rsp.merchant_uid,
                      reservationName: resName.value,
                      companyId: cid.value,
                      spaceId: resInfos.value.spaceId,
                      mileage: mileage.value,
                      memberId: store.state.memberId,
                      price: total.value,
                      payStatus: "003",
                      prepay: "001",
                      startDate:
                        startingDay.value.slice(0, 10) +
                        " " +
                        startSelected.value,
                      endDate:
                        startingDay.value.slice(0, 10) +
                        " " +
                        endSelected.value,
                    },
                    {
                      headers: {
                        Authorization: store.state.accessToken,
                      },
                    }
                  )
                  .then((res) => {
                    console.log(res);
                    if (res.status < 300 && res.status >= 200) {
                      alert(
                        "예약에 성공하였습니다. 예약 정보는 마이페이지의 나의 예약 정보를 확인해 주세요"
                      );
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
                  router.go();
                } else if (error.response.status >= 500) {
                  alert(
                    "일시적인 서버장애 오류입니다 나중에 다시 확인해주세요"
                  );
                  router.go();
                }
              }
            }
          }
        );
      }
    };

    //선결제
    const prePay = async () => {
      console.log(startingDay.value.slice(0, 10));
      if (!resName.value) {
        alert("예약자분 성함을 기재해 주세요");
      } else if (!total.value) {
        alert("예약 하실 날짜를 정해주세요");
      } else if (!store.state.memberId) {
        alert("로그인이 필요한 기능입니다");
      } else if (!startSelected.value) {
        alert("예약 시작 날짜를 정해주세요");
      } else if (!endSelected.value) {
        alert("예약 종료 날짜를 정해주세요");
      } else if (!payWays.pre) {
        alert("결제 수단을 선택해주세요");
      } else if (!a.value || !b.value || !c.value || !d.value) {
        alert("결제 관련 동의에 전부 체크해 주세요");
      }
      // else if (resMessage.value != "인증성공") {
      //   alert("휴대폰 인증이 유료인 관계로 제한");
      // }
      else if (pay.value === "SPACEZ 페이") {
        var clientKey = "test_ck_MGjLJoQ1aVZ5Rq9xWBd3w6KYe2RN";
        var customerKey = store.state.memberId; //memberId
        // BrandPay 객체 초기화
        var brandpay = BrandPay(clientKey, customerKey, {
          redirectUrl: `${window.location.origin}/payment/callback-auth`,
        });
        console.log(`${window.location.origin}/payment/callback-auth`);
        brandpay
          .requestPayment({
            amount: total.value, //결제될 금액(마일리지를 사용하여 실제 결제될 가격)
            orderId: resInfos.value.merchantUid, // 주문에 대한 고유한 ID 값 (merchant_uid)
            orderName: resInfos.value.spaceName, // 결제에 대한 주문명, spaceName
          })
          .then(function (rsp) {
            return axios.post(
              `${proxy}/reservation/toss-post`,
              {
                impUid: rsp.paymentKey,
                prepayUid: rsp.orderId,
                memberId: store.state.memberId,
                reservationName: resName.value,
                companyId: cid.value,
                price: total.value,
                payStatus: "002",
                prepay: "000",
                spaceId: resInfos.value.spaceId,
                startDate:
                  startingDay.value.slice(0, 10) + " " + startSelected.value,
                endDate:
                  startingDay.value.slice(0, 10) + " " + endSelected.value,
                mileage: mileage.value,
                toss: true,
                methodId: rsp.methodId,
                orderName: resInfos.value.spaceName,
              },
              {
                headers: {
                  Authorization: store.state.accessToken,
                },
              }
            );
          })
          .then(() => {
            alert("성공");
          });
      } else {
        try {
          await axios.post(
            `${proxy}/reservation/check`,
            {
              spaceId: resInfos.value.spaceId,
              startDate:
                startingDay.value.slice(0, 10) + " " + startSelected.value,
              endDate: startingDay.value.slice(0, 10) + " " + endSelected.value,
              prepay: "000",
            },
            {
              headers: {
                Authorization: store.state.accessToken,
              },
            }
          );
        } catch (error) {
          alert("예약 중복오류가 발생했습니다 나중에 다시 시도해 주세요");
          router.go();
          return;
        }
        IMP.init("imp76177137");
        IMP.request_pay(
          {
            pg: payWays.pre,
            pay_method: "card", // 기능 없음.
            merchant_uid: resInfos.value.merchantUid, // 상점에서 관리하는 주문 번호
            name: resInfos.value.spaceName,
            amount: total.value, // 빌링키 발급과 함께 40원 결제승인을 시도합니다. price의 20%만 계산해서 넣는다. //후결제인 경우, 0으로 넣는다.
            customer_uid: store.state.memberId, // 필수 입력
            buyer_email: "",
            buyer_name: "",
            buyer_tel: "",
          },
          async function (rsp) {
            if (rsp.success) {
              try {
                await axios
                  .post(
                    `${proxy}/reservation/post`,
                    {
                      impUid: rsp.imp_uid,
                      prepayUid: rsp.merchant_uid,
                      memberId: store.state.memberId,
                      reservationName: resName.value,
                      companyId: cid.value,
                      price: total.value,
                      prepay: "000",
                      spaceId: resInfos.value.spaceId,
                      startDate:
                        startingDay.value.slice(0, 10) +
                        " " +
                        startSelected.value,
                      endDate:
                        startingDay.value.slice(0, 10) +
                        " " +
                        endSelected.value,
                      mileage: mileage.value,
                    },
                    {
                      headers: {
                        Authorization: store.state.accessToken,
                      },
                    }
                  )
                  .then((res) => {
                    console.log(res);
                    if (res.status < 300 && res.status >= 200) {
                      alert(
                        "예약에 성공하였습니다. 예약 정보는 마이페이지의 나의 예약 정보를 확인해 주세요"
                      );
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
                  router.go();
                  console.log(error);
                } else if (error.response.status >= 500) {
                  alert(
                    "일시적인 서버장애 오류입니다 나중에 다시 확인해주세요"
                  );
                  router.go();
                }
              }
            }
          }
        );
      }
    };

    //버튼들에 날짜 보여주는 함수
    const showingDates = () => {
      if (resInfos.value.type == "오피스") {
        console.log(1);
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
          if (dates[0] != 1 && dates[i] === 1) {
            currentMonth++;
            //달이 12월이 넘으면 1월로 변경
            if (currentMonth > 12) {
              currentMonth = 1;
              currentYear++;
              if (currentMonth > 0 && currentMonth < 10) {
                currentMonth = "0" + currentMonth;
              }
            }
          }
          //일이 10미만일때 앞에 0붙여줌
          if (dates[i] > 0 && dates[i] < 10) {
            dates[i] = `0${dates[i]}`;
          }
          startDates.value.push(`${currentYear}-${currentMonth}-${dates[i]}`);
          // console.log(new Date(startDates[i]).getDay());
        }

        reserved = resInfos.value.reservedTime;

        for (let i = 0; i < reserved.length; i++) {
          let found = startDates.value.find((e) => e == reserved[i]);
          // console.log(found);
          for (let j = 0; j < startDates.value.length; j++) {
            if (startDates.value[j] == found) startDates.value[j] = "<예약>";
          }
        }

        const week = ["일", "월", "화", "수", "목", "금", "토"];
        for (let i = 0; i < startDates.value.length; i++) {
          if (startDates.value[i] != "<예약>") {
            let weeks = week[new Date(startDates.value[i]).getDay()];
            startDates.value[i] = `${startDates.value[i]} (${weeks})`;
          }
        }

        for (let i = 0; i < 5; i++) {
          showingOfficeStartDates.value.push(startDates.value[i]);
        }

        console.log(showingOfficeStartDates.value);

        return;
      } else {
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
          if (dates[0] != 1 && dates[i] === 1) {
            currentMonth++;
            //달이 12월이 넘으면 1월로 변경
            if (currentMonth > 12) {
              currentMonth = 1;
              currentYear++;
              if (currentMonth > 0 && currentMonth < 10) {
                currentMonth = "0" + currentMonth;
              }
            }
          }
          //일이 10미만일때 앞에 0붙여줌
          if (dates[i] > 0 && dates[i] < 10) {
            dates[i] = `0${dates[i]}`;
          }
          startDates.value.push(`${currentYear}-${currentMonth}-${dates[i]}`);
          // console.log(new Date(startDates[i]).getDay());
        }
        const week = ["일", "월", "화", "수", "목", "금", "토"];
        for (let i = 0; i < startDates.value.length; i++) {
          let weeks = week[new Date(startDates.value[i]).getDay()];
          startDates.value[i] = `${startDates.value[i]} (${weeks})`;
        }
        for (let i = 0; i < 5; i++) {
          showingStartDates.value.push(startDates.value[i]);
        }
        return;
      }
    };

    //클릭하면 버튼목록 지우고 클릭한 날짜 띄우는 함수
    const startDate = (e) => {
      let officeReserved = startDates.value.indexOf("<예약>");
      let clickedStartDay = showingStartDates.value.indexOf(e.target.value);
      console.log(officeReserved, clickedStartDay);
      if (e.target.value == "<예약>") {
        alert("이미 예약된 날짜 입니다 다른 날짜를 선택해주세요");
        showingSTartDates.value = false;
        startingDay.value = "";
        startDay.value = "시작 날짜";
        showingStart.value = false;
        showingEndingDates.value = [];
        endDates.value = [];
        endingDay.value = "";
        endDay.value = "종료 날짜";
        showingEnd.value = false;
        showingDeskEnd.value = false;
      } else if (
        // officeReserved >= 0 &&
        officeReserved > clickedStartDay &&
        endingDay.value != ""
      ) {
        alert(
          "선택하신 기간중 이미 예약된 시간이 있습니다 다른 시작 날짜를 선택해주세요"
        );
        showingSTartDates.value = false;
        startingDay.value = "";
        startDay.value = "시작 날짜";
        showingStart.value = false;
        showingEnd.value = false;
        showingEndDates.value = false;
        showingDeskEnd.value = false;
        endingDay.value = "";
        showingEndingDates.value = [];
        endDates.value = [];
        endDay.value = "종료 날짜";
      } else if (
        new Date(e.target.value).getTime() / (1000 * 60 * 60 * 24) >
        new Date(endingDay.value).getTime() / (1000 * 60 * 60 * 24)
      ) {
        alert("시작날짜가 반납날짜보다 빠를 수 없습니다");
        showingSTartDates.value = false;
        startingDay.value = "";
        startDay.value = "시작 날짜";
        showingStart.value = false;
        showingEndingDates.value = [];
        endDates.value = [];
        endingDay.value = "";
        endDay.value = "종료 날짜";
        showingEnd.value = false;
        showingDeskEnd.value = false;
      } else if (e.target.value.slice(0, 10) == endingDay.value) {
        alert("당일 예약은 불가능 합니다");
        showingSTartDates.value = false;
        startingDay.value = "";
        startDay.value = "시작 날짜";
        showingStart.value = false;
        showingEndingDates.value = [];
        endDates.value = [];
        endingDay.value = "";
        endDay.value = "종료 날짜";
        showingEnd.value = false;
        showingDeskEnd.value = false;
      } else {
        showingSTartDates.value = false;
        showingStart.value = true;
        startingDay.value = "";
        startDay.value = "";
        startingDay.value = e.target.value.slice(0, 10);
        startDay.value = e.target.value.slice(5);
        showingEnd.value = true;
      }
    };

    //예약된 시간들 빼고 시간들 보여줌
    const startDate2 = (e) => {
      console.log(e.target.value.slice(0, 10));
      showingStart.value = true;
      showingSTartDates.value = !showingSTartDates.value;
      startingDay.value = e.target.value;
      startDay.value = e.target.value.slice(5);
      reservered.value = resInfos.value.reservedTime;

      let dates = [];
      let times = [];
      for (let i = 0; i < reservered.value.length; i++) {
        dates[i] = reservered.value[i].split(" ");
        if (dates[i][0] == e.target.value.slice(0, 10)) {
          times.value = !times.value;
          times[i] = parseInt(dates[i][1]);
        }
      }
      newRunningTime.value = runningTime.value.filter(
        (x) => !times.includes(x)
      );
      if (times.value === undefined) {
        runningTime.value = usedTobeRunningTime.value;
        newRunningTime.value = runningTime.value;
      }
      restTimes.value = times.slice();
      times = times.filter(Boolean);
      resedTime = times[0];
      resedFinTime = times[times.length - 1];
      console.log(times);
    };

    //종료시간 만드는 함수
    const timeSelector = (e) => {
      const opening = resInfos.value.breakOpen.slice(0, 2);

      if (parseInt(e.target.value.slice(0, 2)) == opening) {
        alert(
          `선택하신 시간은 원활한 장소 운영을 위한 청소시간(${opening}시~${resInfos.value.breakClose.slice(
            0,
            2
          )}시)입니다 다시 선택해주세요`
        );
        startSelected.value = "";
        timeShow.value = false;
        return;
      } else if (parseInt(e.target.value.slice(0, 2)) + 1 == resedTime) {
        alert(
          `선택하신 시간 이후 바로 예약(${resedTime}시~${resedFinTime}시)이 있어서 사용이 불가능합니다 다른 시간을 선택해주세요`
        );
        startSelected.value = "";
        timeShow.value = false;
        return;
      }

      endTimeShow.value = true;
      let sliceTime = parseInt(startSelected.value.slice(0, 2));
      let returnDays = newRunningTime.value.slice();

      for (let i = 0; i < returnDays.length; i++) {
        if (returnDays[i] === sliceTime) {
          returnDays.splice(0, i + 1);
          i--;
        }
        if (returnDays[i] < 10) {
          returnDays[i] = "0" + returnDays[i];
        }
      }

      minusEndTime.value = returnDays.length;
      restTimes.value = returnDays.slice();
      timeShow.value = !timeShow.value;
    };

    //예약 종료 하고 예약 중복일 체크 버튼
    const endDate = (e) => {
      showingEndDates.value = !showingEndDates.value;
      endingDay.value = e.target.value.slice(0, 10);
      endDay.value = e.target.value.slice(5);

      let officeReserved = endDates.value.indexOf("<예약>");
      let clickedEndDay = endDates.value.indexOf(e.target.value);
      if (e.target.value == "<예약>") {
        alert("이미 예약된 날짜 입니다 다른 날짜를 선택해주세요");
        showingSTartDates.value = false;
        startingDay.value = "";
        startDay.value = "시작 날짜";
        endingDay.value = "";
        endDay.value = "종료 날짜";
        showingStart.value = false;
        showingEnd.value = false;
        showingDeskEnd.value = false;
        showingEndingDates.value = [];
        endDates.value = [];
      } else if (officeReserved >= 0 && officeReserved < clickedEndDay) {
        alert(
          "선택하신 기간중 이미 예약된 시간이 있습니다 다른 종료 날짜를 선택해주세요"
        );
        showingSTartDates.value = false;
        startingDay.value = "";
        startDay.value = "시작 날짜";
        showingStart.value = false;
        showingEnd.value = false;
        showingEndDates.value = false;
        showingDeskEnd.value = false;
        endingDay.value = "";
        showingEndingDates.value = [];
        endDates.value = [];
        endDay.value = "종료 날짜";
      } else if (
        new Date(e.target.value).getTime() / (1000 * 60 * 60 * 24) <
        new Date(startingDay.value).getTime() / (1000 * 60 * 60 * 24)
      ) {
        alert("시작날짜가 반납날짜보다 빠를 수 없습니다");
        showingSTartDates.value = false;
        startingDay.value = "";
        startDay.value = "시작 날짜";
        showingStart.value = false;
        showingEndingDates.value = [];
        endDates.value = [];
        endingDay.value = "";
        endDay.value = "종료 날짜";
        showingEnd.value = false;
        showingDeskEnd.value = false;
      } else if (e.target.value.slice(0, 10) == startingDay.value) {
        alert("당일 예약은 불가능 합니다");
        showingSTartDates.value = false;
        startingDay.value = "";
        startDay.value = "시작 날짜";
        showingStart.value = false;
        showingEndingDates.value = [];
        endDates.value = [];
        endingDay.value = "";
        endDay.value = "종료 날짜";
        showingEnd.value = false;
        showingDeskEnd.value = false;
      } else {
        showingDeskEnd.value = true;
        showCoast();
      }
    };

    //버튼들 보여주면서 예약 중복 or 겹침 방지 함수
    const showStartDates = async () => {
      showingSTartDates.value = !showingSTartDates.value;
      showingStart.value = false;
      showingDeskEnd.value = false;
      await axios
        .get(`${proxy}/reservation/details/${sid.value}/times`, {
          headers: {
            Authorization: store.state.accessToken,
          },
        })
        .then((res) => {
          console.log(res.request.response);
        });
    };

    //종료날짜 버튼에 띄우는 함수
    const showEndDates = () => {
      showingEndDates.value = !showingEndDates.value;
      // showingDeskEnd.value = true;
      startingDay.value = startingDay.value;
      console.log(startingDay.value);
      getEndDates(startingDay.value);
      if (showingEndDates.value == false && endingDay.value == []) {
        console.log("hi");
        showingEndingDates.value = [];
        endDates.value = [];
      }
    };

    //예약 종료시간 리뉴얼
    const getEndDates = (selectDay) => {
      console.log(selectDay);
      console.log(endDates.value);
      showingDeskEnd.value = !showingDeskEnd.value;

      let day = parseInt(selectDay.slice(8, 10));
      let resYear = selectDay.slice(0, 4);
      let resMonth = selectDay.slice(5, 7);
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
        endDates.value.push(`${resYear}-${resMonth}-${dates[i]}`);
      }
      reserved = resInfos.value.reservedTime;
      // console.log(reserved);

      for (let i = 0; i < reserved.length; i++) {
        let found = endDates.value.find((e) => e == reserved[i]);
        // console.log(found);
        for (let j = 0; j < endDates.value.length; j++) {
          if (endDates.value[j] == found) endDates.value[j] = "<예약>";
        }
      }

      const week = ["일", "월", "화", "수", "목", "금", "토"];
      for (let i = 0; i < endDates.value.length; i++) {
        if (endDates.value[i] != "<예약>") {
          let weeks = week[new Date(endDates.value[i]).getDay()];
          endDates.value[i] = `${endDates.value[i]} (${weeks})`;
        }
      }

      if (showingEndingDates.value.length == 0) {
        for (let i = 0; i < 5; i++) {
          showingEndingDates.value.push(endDates.value[i]);
        }
      } else if (showingEndingDates.value == []) {
        for (let i = 0; i < 5; i++) {
          showingEndingDates.value.push(endDates.value[i]);
        }
      }
      console.log(showingEndingDates.value);
    };

    //오피스 결제
    const officePayBtn = async () => {
      if (!resName.value) {
        alert("예약자분 성함을 기재해 주세요");
      } else if (!total.value) {
        alert("예약 하실 날짜를 정해주세요");
      } else if (!store.state.memberId) {
        alert("로그인이 필요한 기능입니다");
      } else if (!payWays.pre) {
        alert("결제 수단을 선택해주세요");
      } else if (!a.value || !b.value || !c.value || !d.value) {
        alert("결제 관련 동의에 전부 체크해 주세요");
      }
      // else if (resMessage.value != "인증성공") {
      //   alert("휴대폰 인증이 유료인 관계로 제한");
      // }
      else if (pay.value === "SPACEZ 페이") {
        var clientKey = "test_ck_MGjLJoQ1aVZ5Rq9xWBd3w6KYe2RN";
        var customerKey = store.state.memberId; //memberId
        // BrandPay 객체 초기화
        var brandpay = BrandPay(clientKey, customerKey, {
          redirectUrl: `${window.location.origin}/payment/callback-auth`,
        });
        brandpay
          .requestPayment({
            amount: total.value, //결제될 금액(마일리지를 사용하여 실제 결제될 가격)
            orderId: resInfos.value.merchantUid, // 주문에 대한 고유한 ID 값 (merchant_uid)
            orderName: resInfos.value.spaceName, // 결제에 대한 주문명, spaceName
          })
          .then(function (rsp) {
            return axios.post(
              `${proxy}/reservation/toss-post`,
              {
                impUid: rsp.paymentKey,
                prepayUid: rsp.orderId,
                memberId: store.state.memberId,
                reservationName: resName.value,
                companyId: cid.value,
                price: total.value,
                payStatus: "001",
                prepay: "002",
                spaceId: resInfos.value.spaceId,
                startDate: startingDay.value + " " + "00:00",
                endDate: endingDay.value + " " + "23:59",
                mileage: mileage.value,
                toss: true,
                methodId: rsp.methodId,
                orderName: resInfos.value.spaceName,
              },
              {
                headers: {
                  Authorization: store.state.accessToken,
                },
              }
            );
          })
          .then(() => {
            alert("성공");
          });
      } else {
        try {
          await axios.post(
            `${proxy}/reservation/check`,
            {
              spaceId: resInfos.value.spaceId,
              startDate: startingDay.value + " " + "00:00",
              endDate: endingDay.value + " " + "23:59",
              prepay: "002",
            },
            {
              headers: {
                Authorization: store.state.accessToken,
              },
            }
          );
        } catch (error) {
          alert("예약 중복오류가 발생했습니다 나중에 다시 시도해 주세요");
          router.go();
          return;
        }
        IMP.init("imp76177137");
        IMP.request_pay(
          {
            pg: payWays.nPre,
            pay_method: "card", // 기능 없음.
            merchant_uid: resInfos.value.merchantUid, // 상점에서 관리하는 주문 번호
            name: resInfos.value.spaceName,
            amount: 0, // 빌링키 발급과 함께 40원 결제승인을 시도합니다. price의 20%만 계산해서 넣는다. //후결제인 경우, 0으로 넣는다.
            customer_uid: store.state.memberId, // 필수 입력
            buyer_email: "",
            buyer_name: "",
            buyer_tel: "",
          },
          async function (rsp) {
            if (rsp.success) {
              try {
                await axios
                  .post(
                    `${proxy}/reservation/post`,
                    {
                      impUid: rsp.imp_uid,
                      reservationName: resName.value,
                      prepayUid: rsp.merchant_uid,
                      memberId: store.state.memberId,
                      companyId: cid.value,
                      price: total.value,
                      payStatus: "001",
                      prepay: "002",
                      spaceId: resInfos.value.spaceId,
                      startDate: startingDay.value + " " + "00:00",
                      endDate: endingDay.value + " " + "23:59",
                      mileage: mileage.value,
                    },
                    {
                      headers: {
                        Authorization: store.state.accessToken,
                      },
                    }
                  )
                  .then((res) => {
                    if (res.status < 300 && res.status >= 200) {
                      alert(
                        "예약에 성공하였습니다. 예약 정보는 마이페이지의 나의 예약 정보를 확인해 주세요"
                      );
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
                  router.go();
                } else if (error.response.status >= 500) {
                  alert(
                    "일시적인 서버장애 오류입니다 나중에 다시 확인해주세요"
                  );
                  router.go();
                }
              }
            }
          }
        );
      }
    };

    const payWay = () => {
      //선결제는 : kcp(일반결제), uplus(toss), kakaopay.TC0ONETIME,// 후결제,보증금결제는 :kcp_billing,tosspayments, kakaopay.TCSUBSCRIP
      if (pay.value === "신용/체크카드") {
        (payWays.pre = "kcp"), (payWays.nPre = "kcp_billing");
      } else if (pay.value === "카카오 페이") {
        (payWays.pre = "kakaopay"), (payWays.nPre = "kakaopay.TCSUBSCRIP");
      } else if (pay.value === "토스.삼성 페이") {
        (payWays.pre = "uplus"), (payWays.nPre = "tosspayments");
      } else if (pay.value === "SPACEZ 페이") {
        (payWays.pre = "SPACEZpay"), (payWays.nPre = "SPACEZpay");
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
      showCoast1,
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
      startDay,
      endDay,
      showingDeskEnd,
      timeShow,
      startDate2,
      newRunningTime,
      times,
      reservered,
      payWay,
      pay,
      payWays,
      usedTobeRunningTime,
      resTimes,
      errorContent,
      errorHome,
      errorRef,
      loading,
      goback,
      buttons,
      showingStartDates,
      showingOfficeStartDates,
      showingEndingDates,
      showResedTimes,
      showResed,
      resedTimes,
      closeResed,
      closeResedTimes,
    };
  },
};
</script>

<style scoped>
.entire {
  padding: 4.5%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.left {
  width: 45%;
  float: left;
}
.right {
  width: 45%;
  float: right;
  background-color: #fafafa;
  padding: 3%;
  margin-top: 5%;
}
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
.tdTypeTime {
  font-size: 1rem;
}
.typePriceTable {
  margin-top: 5%;
  margin-bottom: 5%;
}
.timeSelect {
  width: 15%;
  height: 6vh;
  border-radius: 7px;
  margin-bottom: 2.5%;
  margin-right: 3%;
  opacity: 0.6;
  font-size: 1.2rem;
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
  width: 15%;
  height: 7vh;
  color: #4d6aed;
  font-size: 1.1em;
  border: 1px solid white;
  border-radius: 10px;
}
.resDate:hover {
  background-color: #1e6ff4;
  color: white;
}
.dayShow {
  color: #4d6aed;
}
.dateBtn {
  background-color: inherit;
  border: 1px solid gray;
  font-size: 1.2rem;
  width: fit-content;
  height: 6vh;
  border-radius: 7px;
  text-align: left;
  /* opacity: 0.6; */
  padding-bottom: 0.5%;
  margin-bottom: 1%;
  margin-right: 2%;
}
.dateBtn:hover {
  background-color: #1e6ff4;
  border: 1px solid #1e6ff4;
  color: white;
  transition: 0.1s;
}
.totalCoast {
  margin-bottom: 1.5%;
  font-size: 1.4rem;
  color: #d14a58;
  font-weight: bolder;
}
.goback {
  background: inherit;
  border: 1px solid white;
  color: #1e6ff4;
}
.goback:hover {
  background-color: #1e6ff4;
  border: 1px solid #1e6ff4;
  color: white;
  transition: 0.1s;
}
.showResed {
  padding: 2%;
  background: white;
  float: right;

  /* margin-left: 70%; */
}
.showResedMent {
  font-size: 0.8em;
}
.showResedMent:hover > .arrow {
  color: red;
  font-weight: 700;
}
.resed {
  font-size: 0.9em;
}
</style>
