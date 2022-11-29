// eslint-disable-next-line
<template>
  <div>
    <div class="picsAndIntro">
      <div class="form">
        <p class="lineIntro">{{ details.space.spaceName }}</p>
        <p class="shortInto">{{ details.space.info }}</p>
        <div class="buttons">
          <button class="button" value="minus" @click="movePic">&lt;</button>
          <button class="button" value="plus" @click="movePic">&gt;</button>
        </div>
        <div class="img">
          <div class="intplace">
            <button class="interestPl" @click="changeClick">
              <img v-show="!clicked" src="../assets/whiteclip.png" />
              <img v-show="clicked" src="../assets/blueclip.png" />
              관심장소
            </button>
            <p class="placeLoc">{{ details.space.location }}</p>
            <section>
              <ul class="placeDetails">
                <li>{{}}정보1</li>
                <li>{{}}정보2</li>
                <li>{{}}정보3</li>
              </ul>
            </section>
          </div>
          <img
            class="big"
            name="big"
            :src="`http://localhost:8090/spaceZBE/resources/upload/${currentImg}`"
            @click="changePic"
          />
          <br />
          <img
            class="list"
            v-for="name in details.images.length"
            :key="name.id"
            :src="`http://localhost:8090/spaceZBE/resources/upload/${
              details.images[name - 1].imgName
            }`"
            @click="directChangePic"
          />
        </div>
      </div>
    </div>
    <div class="detailNavDiv">
      <nav class="detailNav">
        <ul class="nav" @click="resClick">
          <p class="hover" v-if="!resClicked">장소 예약</p>
          <p
            class="hover"
            v-if="resClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            장소 예약
          </p>
        </ul>
        <ul class="nav" @click="locClick">
          <p class="hover" v-if="!locClicked">장소 소개</p>
          <p
            class="hover"
            v-if="locClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            장소 소개
          </p>
        </ul>
        <ul class="nav" @click="showLocation">
          <p class="hover" v-if="!locationClicked">이용 규칙</p>
          <p
            class="hover"
            v-if="locationClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            이용 규칙
          </p>
        </ul>
        <ul class="nav" @click="showReviews">
          <p class="hover" v-if="!reviewClicked">
            리뷰
            <a style="opacity: 0.6; margin-left: 10px">{{
              details.reviews.length
            }}</a>
          </p>

          <p
            class="hover"
            v-if="reviewClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            리뷰
            <a style="opacity: 0.6; margin-left: 10px">{{
              details.reviews.length
            }}</a>
          </p>
        </ul>
        <ul class="nav" @click="showQna">
          <p class="hover" v-if="!qnaClicked">
            Q&A
            <a style="opacity: 0.6; margin-left: 10px">{{
              dumy.qnas.length
            }}</a>
          </p>
          <p
            class="hover"
            v-if="qnaClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            Q&A
            <a style="opacity: 0.6; margin-left: 10px">{{
              dumy.qnas.length
            }}</a>
          </p>
        </ul>
      </nav>
      <div class="navContainer">
        <div class="resClicked" v-show="resClicked">
          <section class="lists" v-for="num in resDetails.length" :key="num">
            <img
              class="resThumb"
              :src="`http://localhost:8090/spaceZBE/resources/upload/${
                resDetails[num - 1].imgName
              }`"
            />
            <ul class="ul">
              <li style="margin-top: 2%; font-size: 1.4rem">
                <b class="resType"> [{{ resDetails[num - 1].type }}] </b>
                <b class="resSpace"> {{ resDetails[num - 1].spaceName }}실 </b>
              </li>
              <li style="margin-top: 6%; font-size: 1rem">
                <b> 가격 </b>
                <b
                  style="margin-left: 60%"
                  v-show="resDetails[num - 1].type == office"
                >
                  {{ resDetails[num - 1].price }}원/일
                </b>
                <b
                  style="margin-left: 60%"
                  v-show="resDetails[num - 1].type != office"
                >
                  {{ resDetails[num - 1].price }}원/시간
                </b>
              </li>
              <hr />
              <li @click="useInfo(resDetails[num - 1])" style="cursor: pointer">
                이용안내
                <button
                  class="button"
                  @click="useInfo(resDetails[num - 1])"
                  style="float: right"
                >
                  &gt;
                </button>
              </li>
              <li style="margin-top: 2%">
                <button
                  class="resBtn"
                  @click="moveToPage(resDetails[num - 1].spaceId)"
                >
                  예약
                </button>
              </li>
            </ul>
          </section>
        </div>
        <div class="locClicked" v-show="locClicked">
          {{ details.space.moreInfo }}
          <section style="text-align: left">
            <p class="locClicked"><b style="color: red">&#63;</b>장소 위치</p>
            <KaKaoMap class="map" :options="mapOption" />
          </section>
        </div>
        <div class="locationClicked" v-if="locationClicked">규칙들</div>
        <div class="reviewClicked" v-show="reviewClicked">
          <div class="reviews" v-for="num in details.reviews" :key="num">
            <img
              class="profilePic"
              :src="`http://localhost:8090/spaceZBE/resources/upload/${currentImg}`"
            />
            <div style="line-height: 1.6; margin-left: 3%">
              유저이름 <a v-for="num in num.rating" :key="num">⭐</a>
              {{ num.rating }} <br />
              [{{ details.space.type }}]실 사용 <br />
              {{ num.content }}
              {{ num.reviewDate }}
            </div>
            <hr />
          </div>
          <pagination
            v-if="details.reviews.length"
            :numberOfPages="numberOfPages"
            :currentPage="currentPage"
            @click="getDetails"
          >
          </pagination>
        </div>
        <div class="qnaClicked" v-show="qnaClicked">
          <div style="margin-top: 2%" v-for="num in dumy.qnas" :key="num">
            <div class="qnas">
              <img
                class="profilePic"
                :src="`http://localhost:8090/spaceZBE/resources/upload/${currentImg}`"
              />
              <div style="line-height: 1.6; margin-left: 3%">
                <p>
                  <b>
                    {{ num.memberId }}
                  </b>
                  {{ num.date }}
                </p>
                {{ num.contents }}
              </div>
            </div>
            <button
              class="qnaButton"
              @click="showCanvas(num)"
              style="
                color: #1e6ff4;
                font-weight: 800;
                background-color: white;
                border: 1px solid white;
                margin-bottom: 2.5%;
              "
            >
              답변보기
              <span style="color: black" v-show="!num.answerShow">&#8744;</span>
              <span style="color: black" v-show="num.answerShow"> &#8743;</span>
            </button>
            <QnaOffcanvas :qnaAnswer="qnaAnswer" v-show="num.answerShow" />
          </div>
        </div>
      </div>
    </div>
    <UseInfo :details="useInfoString" v-if="useInfoModal" @close="closeModal" />
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import axios from "@/axios";
import { useRoute, useRouter } from "vue-router";
import KaKaoMap from "./KaKaoMapOne.vue";
import UseInfo from "@/components/UseInfo.vue";
import pagination from "@/components/Pagination.vue";
import QnaOffcanvas from "@/components/QnaOffcanvas.vue";

export default {
  components: {
    KaKaoMap,
    UseInfo,
    pagination,
    QnaOffcanvas,
  },
  data() {
    return {
      mapOption: {
        center: {
          lat: 33.450701,
          lng: 126.570667,
        },
        level: 8,
        location: null,
      },
    };
  },
  mounted() {
    fetch(
      "http://localhost:8090/spaceZBE/spaceInfo?spaceId=" +
        useRoute().params.id +
        "&memberId=" +
        localStorage.getItem("memberId")
    )
      .then((res) => res.json())
      .then((res) => {
        this.mapOption.location = res.space.location;
      });
  },
  setup() {
    const details = ref({
      space: {},
      reviews: [],
      replys: [],
      qnas: [],
      avgRating: 0,
      merchant_uid: "",
      images: [],
    });
    const dumy = ref({
      qnas: [
        {
          qnaId: 1,
          memberId: "최슈",
          date: "2022-11-16",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents:
            "ㅏㅑㅓㅕㅗㅛnvcmnvcnv.zxcnvncvx,m vlsd vxc vds vx vajwblsnfewiohfu2b3fsjdbfugbwkjfbsofobfwejkfbwauefoweabfwefbusdbfkjasbdfibwea;fubasdjkfbw;euabfkjasdbf;ibweaufbslkadnㅜㅠㅐㅔㅢ",
        },
        {
          qnaId: 2,
          memberId: "최슈",
          date: "2022-11-16",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "abdefghijklmnopqrstuvwxyz",
        },
        {
          qnaId: 3,
          memberId: "최슈",
          date: "2022-11-16",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "123456789",
        },
        {
          qnaId: 4,
          memberId: "최슈",
          date: "2022-11-16",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "qwertyuiop",
        },
        {
          qnaId: 5,
          memberId: "최슈",
          date: "2022-11-16",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "asdfghjkl",
        },
        {
          qnaId: 6,
          memberId: "최슈",
          date: "2022-11-16",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "zxcvbnm",
        },
        {
          qnaId: 7,
          memberId: "최슈",
          date: "2022-11-16",
          contents:
            "가나다라마바사아자차카타파하" +
            "기니디리미비시이지치키티피히" +
            "거너더러머버서어저처커터퍼허",
          answerShow: false,
          answerDate: "2022-11-28",
          anwserContents: "qazwsxdec",
        },
      ],
    });
    const resDetails = ref({});

    const route = useRoute();
    const router = useRouter();
    let officePrice = ref(0);
    let nOfficePrice = ref(0);

    let now = ref("");

    const num1 = ref();
    const num2 = ref();

    // const map = ref('')
    const errMessage = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const startDateTime = ref("");
    const endDateTime = ref("");
    const resClicked = ref(false);
    const locClicked = ref(false);
    const locationClicked = ref(false);
    const reviewClicked = ref(false);
    const qnaClicked = ref(false);
    const clicked = ref(false);
    const useInfoModal = ref(false);
    const useInfoString = ref({});
    const qnaAnswer = ref({});

    let currentImgNum = ref(0);
    let currentImg = ref("");
    let imageList = ref([]);

    const canvas = ref(false);

    //pagination
    let limit = 5;
    const currentPage = ref(1);
    const numberOfPages = computed(() => {
      return Math.ceil(details.value.reviews.length / limit);
    });

    //현재 페이지에 필요한 정보들 get 하는 함수
    const getDetails = async (page = currentPage.value) => {
      currentPage.value = page;
      const res = await axios.get(
        "spaceInfo?spaceId=" +
          route.params.id +
          "&memberId=" +
          localStorage.getItem("memberId")
      );
      details.value = { ...res.data };
      currentImg.value = details.value.images[currentImgNum.value].imgName;
      console.log(details.value.reviews);
    };
    getDetails();

    //예약에 쓸 정보들 다른 주소에서 get하는 함수(서버 구현시 삭제 필요)
    const getResDetails = async () => {
      const res = await axios.get("recentlyAdded");
      resDetails.value = res.data.vos;
      console.log(resDetails.value);
    };
    getResDetails();

    //메인사진 클릭시 변경
    const changePic = () => {
      currentImgNum.value++;
      if (currentImgNum.value === details.value.images.length) {
        currentImgNum.value = 0;
      }
      currentImg.value = details.value.images[currentImgNum.value].imgName;
    };

    //버튼으로 이미지 변경
    const movePic = (e) => {
      if (e.target.value == "plus") {
        currentImgNum.value++;
        if (currentImgNum.value === details.value.images.length) {
          currentImgNum.value = 0;
        }
        currentImg.value = details.value.images[currentImgNum.value].imgName;
      } else if (e.target.value == "minus") {
        currentImgNum.value--;
        console.log(currentImgNum.value);
        if (currentImgNum.value < 0) {
          currentImgNum.value = details.value.images.length - 1;
        }
        currentImg.value = details.value.images[currentImgNum.value].imgName;
      }
    };

    //사진 리스트 클릭시 해당 사진 변경
    const directChangePic = (e) => {
      // imageList.value.images[0].opacity = 1;
      e.target.style.opacity = 1;
      // opacityObject.opacity = 1;
      for (let i = 0; i < details.value.images.length; i++) {
        imageList.value = details.value.images[i].imgName;
      }
      currentImg.value = e.target.src.substr(48);
      // if (currentImg.value != e.target.src.substr(48)) {
      //   e.target.style.opacity = 0.5;
      // }
    };

    //관심장소 버튼
    const changeClick = () => {
      clicked.value = !clicked.value;
    };

    //이용안내 모달 띄우는 함수
    const useInfo = (info) => {
      useInfoModal.value = !useInfoModal.value;
      useInfoString.value = info;
      console.log(info);
    };

    //이용안내 모달 닫는 함수
    const closeModal = () => {
      useInfoModal.value = false;
    };

    //예약페이지로 가는 함수
    const moveToPage = (spaceId) => {
      router.push({
        name: "Reservation",
        params: {
          id: spaceId,
        },
      });
    };

    //리뷰 페이지네이션
    const onClick = () => {
      // const res = await axios.get(`?_page=${page}&_limit=${limit}`);
      // console.log(details.value.reviews);
    };
    onClick();

    //qna답변보여주기
    const showCanvas = (num) => {
      num.answerShow = !num.answerShow;
      qnaAnswer.value = num;
    };

    // 하단 nav바 버튼들
    const resClick = () => {
      resClicked.value = !resClicked.value;
      locClicked.value = false;
      locationClicked.value = false;
      reviewClicked.value = false;
      qnaClicked.value = false;
    };

    const locClick = () => {
      locClicked.value = !locClicked.value;
      locationClicked.value = false;
      reviewClicked.value = false;
      qnaClicked.value = false;
      resClicked.value = false;
    };

    const showLocation = () => {
      locationClicked.value = !locationClicked.value;
      locClicked.value = false;
      reviewClicked.value = false;
      qnaClicked.value = false;
      resClicked.value = false;
    };

    const showReviews = () => {
      reviewClicked.value = !reviewClicked.value;
      locationClicked.value = false;
      locClicked.value = false;
      qnaClicked.value = false;
      resClicked.value = false;
    };

    const showQna = () => {
      qnaClicked.value = !qnaClicked.value;
      locationClicked.value = false;
      locClicked.value = false;
      reviewClicked.value = false;
      resClicked.value = false;
    };

    return {
      qnaAnswer,
      showCanvas,
      details,
      currentImg,
      currentImgNum,
      locClick,
      resClick,
      locClicked,
      resClicked,
      locationClicked,
      showLocation,
      showReviews,
      reviewClicked,
      qnaClicked,
      showQna,
      changePic,
      startDate,
      endDate,
      officePrice,
      nOfficePrice,
      startDateTime,
      endDateTime,
      num1,
      num2,
      errMessage,
      now,
      directChangePic,
      imageList,
      movePic,
      clicked,
      changeClick,
      resDetails,
      useInfoModal,
      useInfo,
      closeModal,
      moveToPage,
      useInfoString,
      currentPage,
      numberOfPages,
      getDetails,
      dumy,
    };
  },
};
</script>

/* eslint-disable */
<style scoped>
.picsAndIntro {
  width: 75vw;
  left: 10%;
  float: left;
  position: absolute;
}
.intplace {
  float: right;
  width: 20vw;
}
.placeLoc {
  font-size: 1.2rem;
  float: left;
  position: absolute;
  top: 25%;
}
.interestPl {
  font-size: 1.2rem;
  margin-right: 20%;
  width: 12vw;
  height: 8vh;
  float: left;
  background: #d2e1f9;
  border: 1px solid #d2e1f9;
  border-radius: 10px;
  font-weight: 600;
}
.placeDetails {
  font-size: 1.2rem;
  float: left;
  position: absolute;
  top: 30%;
  width: 20vw;
  height: 20vh;
  padding-top: 1.5%;
  color: white;
  border-radius: 10px;
  background: linear-gradient(
      270deg,
      rgba(96, 173, 163, 0.42) 0%,
      rgba(234, 235, 255, 0) 100%
    ),
    linear-gradient(90deg, #5698b8 0%, #5faba5 100%);
}
.detailNavDiv {
  height: fit-content;
  top: 150%;
  left: 7%;
  float: left;
  position: absolute;
}
.detailNav {
  width: 100%;
  height: 40px;
}
.form {
  width: inherit;
  height: 700px;
  margin-top: 20px;
  text-align: center;
}

.navContainer {
  width: 900px;
  min-height: 10vh;
  height: fit-content;
}
.img {
  width: 70vw;
  text-align: left;
  /* float: left; */
}
.big {
  /* float: left; */
  width: 100vh;
  height: 80vh;
  position: relative;
  margin: auto;
  align-self: left;
}
.list {
  float: left;
  width: 100px;
  height: 100px;
  margin: 1.5%;
  /* opacity: 0.5; */
}
.lineIntro {
  text-align: left;
  font-size: 3vh;
  margin-bottom: 0;
}
.shortInto {
  text-align: left;
  font-size: 5vh;
  color: rgb(4, 20, 97, 1);
  font-weight: 600;
}
.buttons {
  width: fit-content;
  height: fit-content;
  right: 10%;
}
.button {
  width: fit-content;
  height: fit-content;
  background-color: white;
  border: 1px solid white;
}

.lists {
  width: 90%;
  height: 35%;
  padding-top: 2%;
  padding-bottom: 4%;
  border: 2px solid silver;
  margin: 2%;
}
.resThumb {
  display: inline;
  margin-left: 1%;
  margin-bottom: 5%;
  width: 10vw;
  height: 10%;
}
.resBtn {
  width: 80%;
  margin-left: 8%;
  margin-top: 3%;
  margin-bottom: 3%;
  border-radius: 10px;
  background-color: rgb(4, 20, 97, 1);
  color: white;
  font-size: 1.3rem;
}
.ul {
  margin-right: 15%;
  float: right;
  width: 60%;
  height: 9%;
  display: inline-block;
  list-style: none;
  margin-bottom: none;
}

iframe {
  width: 700px;
  height: 600px;
}
.nav {
  display: inline-block;
  font-size: 25px;
  margin-right: 50px;
  margin-left: 50px;
  justify-content: space-evenly;
}

.hover:hover {
  border-bottom: 1px solid blue;
  color: blue;
}
.locClicked {
  font-size: 1.3rem;
}
.locationClicked {
  margin-top: 20px;
  font-size: 30px;
}
.reviews {
  width: 90%;
  margin-top: 10%;
  font-size: 1.4rem;
  line-height: 2.5;
  color: black;
  margin-top: 5%;
  display: flex;
  width: 80%;
}
.profilePic {
  width: 10%;
  height: 10%;
  border-radius: 50px;
}
.qnas {
  width: 90%;
  margin-top: 10%;
  font-size: 1.4rem;
  line-height: 2.5;
  color: black;
  margin-top: 5%;
  display: flex;
  width: 80%;
}
</style>
