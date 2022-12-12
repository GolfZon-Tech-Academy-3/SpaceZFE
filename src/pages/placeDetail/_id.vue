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

  <div v-else class="entireForm">
    <div class="picsAndIntro">
      <div class="form">
        <p class="lineIntro">{{ details.companyName }}</p>
        <div class="buttons">
          <button class="button" value="minus" @click="movePic">&lt;</button>
          <button class="button" value="plus" @click="movePic">&gt;</button>
        </div>
        <div class="img">
          <div class="intplace">
            <button class="interestPl" @click="changeClick(details.companyId)">
              <img
                style="margin-right: 4%; width: 2vw; height: 2vh"
                v-show="!details.companyLike"
                src="@/assets/heart.png"
              />
              <img
                style="margin-right: 4%; width: 2vw; height: 2vh"
                v-show="details.companyLike"
                src="@/assets/heart_red.png"
              />
              관심장소
            </button>
            <p class="placeLoc">{{ details.location }}</p>
            <ul class="placeDetails">
              <li>{{ details.summary }}</li>
            </ul>
          </div>
          <img class="big" name="big" :src="currentImg" @click="changePic" />
          <br />
          <img
            class="list"
            v-for="num in details.spaceImages.length"
            :key="num.id"
            :src="details.spaceImages[num - 1]"
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
        <ul class="nav" @click="showrules">
          <p class="hover" v-if="!rulesClicked">이용 규칙</p>
          <p
            class="hover"
            v-if="rulesClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            이용 규칙
          </p>
        </ul>
        <ul class="nav" @click="showReviews">
          <p class="hover" v-if="!reviewClicked">
            리뷰
            <a style="opacity: 0.6; margin-left: 10px">{{
              reviews.totalCount
            }}</a>
          </p>

          <p
            class="hover"
            v-if="reviewClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            리뷰
            <a style="opacity: 0.6; margin-left: 10px">{{
              reviews.totalCount
            }}</a>
          </p>
        </ul>
        <ul class="nav" @click="showQna">
          <p class="hover" v-if="!qnaClicked">
            Q&A
            <a style="opacity: 0.6; margin-left: 10px">{{ qnas.count }}</a>
          </p>
          <p
            class="hover"
            v-if="qnaClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            Q&A
            <a style="opacity: 0.6; margin-left: 10px">{{ qnas.count }}</a>
          </p>
        </ul>
      </nav>
      <div class="navContainer">
        <div class="resClicked" v-show="resClicked">
          <div class="lists" v-for="num in resDetails.length" :key="num">
            <img class="resThumb" :src="resDetails[num - 1].spaceImage" />
            {{ resDetails[num - 1].spaceImages }}
            <ul class="ul">
              <li>
                <b class="resType"> [{{ resDetails[num - 1].type }}] </b>
                <b class="resSpace"> {{ resDetails[num - 1].spaceName }} </b>
              </li>
              <li style="margin-top: 6%">
                <b> 가격 </b>
                <b
                  style="margin-left: 60%"
                  v-show="resDetails[num - 1].type == '오피스'"
                >
                  {{
                    resDetails[num - 1].price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }}원/일
                </b>
                <b
                  style="margin-left: 60%"
                  v-show="resDetails[num - 1].type != '오피스'"
                >
                  {{
                    resDetails[num - 1].price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }}원/시간
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
              <li style="margin-top: 1.5%">
                <button
                  class="resBtn"
                  @click="moveToPage(resDetails[num - 1].spaceId)"
                >
                  예약
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="locClicked" v-if="locClicked">
          {{ details.info }}
          <section style="text-align: left">
            <p class="locClicked"><b style="color: red"></b>장소 위치</p>
            <KaKaoMap class="map" :options="mapOption" />
          </section>
        </div>
        <div class="rulesClicked" v-if="rulesClicked">
          {{ details.rules }}
        </div>
        <div class="reviewClicked" v-show="reviewClicked">
          <div class="reviews" v-for="num in reviews.reviews.length" :key="num">
            <img
              class="profilePic"
              :src="reviews.reviews[num - 1].memberImage"
            />
            <div style="line-height: 1.6; margin-left: 3%; margin-bottom: 2%">
              {{ reviews.reviews[num - 1].memberName }}
              <a v-for="num in reviews.reviews[num - 1].rating" :key="num"
                >⭐</a
              >
              {{ reviews.reviews[num - 1].rating }} <br />
              [{{ reviews.reviews[num - 1].type }}] 사용 <br />
              {{ reviews.reviews[num - 1].content }}
            </div>
          </div>
        </div>
        <div class="qnaClicked" v-show="qnaClicked">
          <h2 @click="uploadQna">질문하기</h2>
          <span v-show="showWrite" @click="showWrite = true">접기</span>
          <div>
            <QnaWrite :qnaAnswer="qnaInfo" v-if="showWrite" />
          </div>
          <div
            style="margin-top: 2%"
            v-for="num in qnas.list.length"
            :key="num"
          >
            <div class="qnas">
              <img class="profilePic" :src="qnas.list[num - 1].imagePath" />
              <div style="line-height: 1.6; margin-left: 3%">
                <p>
                  <b>
                    {{ qnas.list[num - 1].memberName }}
                  </b>
                  {{ qnas.list[num - 1].inquiryTime }}
                </p>
                {{ qnas.list[num - 1].inquiries }}
              </div>
            </div>
            <button
              v-show="qnas.list[num - 1].answers != null"
              class="qnaButton"
              @click="showCanvas(qnas.list[num - 1].inquiryId)"
            >
              답변보기
              <span
                style="color: black"
                v-show="!qnas.list[num - 1].showMyAnswer"
                >&#8744;</span
              >
              <span
                style="color: black"
                v-show="qnas.list[num - 1].showMyAnswer"
              >
                &#8743;</span
              >
            </button>
            <button
              v-show="qnas.list[num - 1].answers == null"
              class="qnaButtonNot"
            >
              답변 미등록
            </button>
            <QnaOffcanvas
              :qnaAnswer="qnaAnswer"
              v-show="qnas.list[num - 1].showMyAnswer"
            />
          </div>
        </div>
      </div>
    </div>
    <UseInfo :details="useInfoString" v-if="useInfoModal" @close="closeModal" />
  </div>
</template>

<script>
import KaKaoMap from "@/components/details/KaKaoMapOne.vue";
import UseInfo from "@/components/details/UseInfo.vue";
import pagination from "@/components/details/Pagination.vue";
import QnaOffcanvas from "@/components/details/QnaAnswer.vue";
import QnaWrite from "@/components/details/QnaWrite.vue";
import Spinner from "@/components/UI/Spinner.vue";
import ErrorHandle from "@/components/UI/BaseDialog.vue";

import { useRoute, useRouter } from "vue-router";
import axios from "@/axios";
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    KaKaoMap,
    UseInfo,
    pagination,
    QnaOffcanvas,
    QnaWrite,
    Spinner,
    ErrorHandle,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const id = ref(route.query.id);

    const details = ref({});
    const resDetails = ref([]);

    let currentImgNum = ref(0);
    let currentImg = ref("");
    let imageList = ref([]);

    const resClicked = ref(false);
    const locClicked = ref(false);
    const rulesClicked = ref(false);
    const reviewClicked = ref(false);
    const qnaClicked = ref(false);

    const useInfoModal = ref(false);
    const useInfoString = ref({});
    const companyId = ref();
    const reviews = ref([]);
    const qnas = ref([]);
    const qnaAnswer = ref({});
    const showWrite = ref(false);
    const qnaInfo = ref({});

    const loading = ref(false);
    const errorContent = ref(null);

    const mapOption = ref({
      center: {
        lat: 33.450701,
        lng: 126.570667,
      },
      level: 5,
      location: null,
    });

    //리뷰 qna 장소 상세 get하는 함수

    const res = async () => {
      loading.value = true;
      try {
        await axios
          .get(`company/details/${id.value}`, {
            headers: {
              Authorization: localStorage.getItem("access_token"),
            },
          })
          .then((res) => {
            details.value = { ...res.data };
            qnaInfo.value.cid = details.value.companyId;
            qnaInfo.value.cName = details.value.companyName;
            currentImg.value = details.value.spaceImages[currentImgNum.value];
            resDetails.value = details.value.spaces;
            companyId.value = res.data.companyId;
            mapOption.value.location = details.value.location;
            console.log(details.value);
            axios
              .get(`review/total/${companyId.value}?page=1`, {
                headers: {
                  Authorization: localStorage.getItem("access_token"),
                },
              })
              .then((res) => {
                reviews.value = { ...res.data };
                console.log(reviews.value);
              });
            axios
              .get(`inquiry/total/${companyId.value}`, {
                headers: {
                  Authorization: localStorage.getItem("access_token"),
                },
              })
              .then((res) => {
                qnas.value = { ...res.data };
                for (let i = 0; i < qnas.value.list.length; i++) {
                  qnas.value.list[i].showMyAnswer = false;
                }
                console.log(qnas.value.list);
                console.log(mapOption.value);
              });
          });
      } catch (error) {
        errorContent.value = `오류가 발생했습니다 홈페이지로 이동하시거나 
          버튼을 눌러 응답을 받을때까지 시도해 보십시오`;
        return;
      }
      loading.value = false;
    };
    res();

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
      res();
    };

    //메인사진 클릭시 변경
    const changePic = () => {
      currentImgNum.value++;
      if (currentImgNum.value === details.value.spaceImages.length) {
        currentImgNum.value = 0;
      }
      currentImg.value = details.value.spaceImages[currentImgNum.value];
    };

    //버튼으로 이미지 변경
    const movePic = (e) => {
      if (e.target.value == "plus") {
        currentImgNum.value++;
        if (currentImgNum.value === details.value.spaceImages.length) {
          currentImgNum.value = 0;
        }
        currentImg.value = details.value.spaceImages[currentImgNum.value];
      } else if (e.target.value == "minus") {
        currentImgNum.value--;
        console.log(currentImgNum.value);
        if (currentImgNum.value < 0) {
          currentImgNum.value = details.value.spaceImages.length - 1;
        }
        currentImg.value = details.value.spaceImages[currentImgNum.value];
      }
    };

    //사진 리스트 클릭시 해당 사진 변경
    const directChangePic = (e) => {
      e.target.style.opacity = 1;
      for (let i = 0; i < details.value.spaceImages.length; i++) {
        imageList.value = details.value.spaceImages[i];
      }
      currentImg.value = e.target.src;
    };

    //관심장소
    const changeClick = async (id) => {
      await axios
        .post(`company/like/${id}`, {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        })
        .then(() => {
          router.go();
        });
      console.log(details.value.companyLike);
    };

    //이용안내 모달 띄우는 함수
    const useInfo = (info) => {
      useInfoModal.value = !useInfoModal.value;
      useInfoString.value = info;
      console.log(info);
      console.log(useInfoModal.value);
    };

    //이용안내 모달 닫는 함수
    const closeModal = () => {
      useInfoModal.value = false;
    };

    let find;

    //qna답변보여주기
    const showCanvas = (e) => {
      let i = e;
      find = qnas.value.list.find((e) => e.inquiryId === i);
      find.showMyAnswer = !find.showMyAnswer;
      qnaAnswer.value = find;
      //답변 열고 다른 답변을 열면 닫는 함수
      for (let i = 0; i < qnas.value.list.length; i++) {
        if (qnas.value.list[i].inquiryId != find.inquiryId) {
          console.log(qnas.value.list[i]);
          console.log(qnas.value.list[i].showMyAnswer);
          qnas.value.list[i].showMyAnswer = false;
        }
      }
    };

    const moveToPage = (id) => {
      router.push({
        name: "Reservation",
        query: {
          sid: id,
          cid: route.query.id,
        },
      });
    };
    const uploadQna = () => {
      console.log(1);
      showWrite.value = !showWrite.value;
    };

    // 하단 nav바 버튼들
    const resClick = () => {
      resClicked.value = !resClicked.value;
      console.log(resDetails.value[0].spaceImage);
      locClicked.value = false;
      rulesClicked.value = false;
      reviewClicked.value = false;
      qnaClicked.value = false;
    };

    const locClick = () => {
      locClicked.value = !locClicked.value;
      rulesClicked.value = false;
      reviewClicked.value = false;
      qnaClicked.value = false;
      resClicked.value = false;
    };

    const showrules = () => {
      rulesClicked.value = !rulesClicked.value;
      locClicked.value = false;
      reviewClicked.value = false;
      qnaClicked.value = false;
      resClicked.value = false;
    };

    const showReviews = () => {
      reviewClicked.value = !reviewClicked.value;
      rulesClicked.value = false;
      locClicked.value = false;
      qnaClicked.value = false;
      resClicked.value = false;
    };

    const showQna = () => {
      qnaClicked.value = !qnaClicked.value;
      rulesClicked.value = false;
      locClicked.value = false;
      reviewClicked.value = false;
      resClicked.value = false;
    };

    return {
      id,
      details,
      resDetails,
      resClicked,
      locClicked,
      rulesClicked,
      reviewClicked,
      qnaClicked,
      currentImgNum,
      currentImg,
      imageList,
      changePic,
      movePic,
      directChangePic,
      changeClick,
      useInfo,
      closeModal,
      resClick,
      locClick,
      showrules,
      showReviews,
      reviews,
      qnas,
      showQna,
      showWrite,
      moveToPage,
      useInfoModal,
      useInfoString,
      companyId,
      showCanvas,
      qnaAnswer,
      uploadQna,
      mapOption,
      qnaInfo,
      errorHome,
      errorRef,
      loading,
      errorContent,
    };
  },
};
</script>

<style scoped>
.entireForm {
  height: auto;
  min-height: 150vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}
.picsAndIntro {
  width: 100%;
  /* left: 10%; */
  /* float: left; */
  /* position: absolute; */
  flex: 1;
  padding: 0%10%0%10%;
  /* text-align: center; */
  height: 50vh;
}
.intplace {
  float: right;
  width: 20vw;
  height: 20vh;
}
.placeLoc {
  font-size: 2vh;
  float: left;
  position: absolute;
  top: 34%;
}
.interestPl {
  font-size: 2.5vh;
  margin-right: 20%;
  width: 11vw;
  height: 8vh;
  float: left;
  background: #d2e1f9;
  border: 1px solid #d2e1f9;
  border-radius: 10px;
  font-weight: 600;
}
.placeDetails {
  font-size: 2.5vh;
  float: left;
  position: absolute;
  top: 40%;
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
  /* top: 120%; */
  /* left: 7%; */
  float: left;
  /* position: absolute; */
  flex: 1;
}
.detailNav {
  width: 100%;
  height: inherit;
}
.form {
  width: 100%;
  /* height: 700px; */
  margin-top: 20px;
  text-align: center;
}

.navContainer {
  width: 900px;
  height: -moz-fit-content;
  height: fit-content;
  padding-left: 7%;
}
.img {
  width: 70%;
  text-align: left;
}
.big {
  width: 80vh;
  height: 60vh;
  position: relative;
  margin: auto;
  align-self: left;
}
.list {
  float: left;
  width: 5vw;
  height: 10vh;
  margin: 1.5%;
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
.qnaButton {
  color: #1e6ff4;
  font-weight: 800;
  background-color: white;
  border: 1px solid white;
  margin-bottom: 2.5%;
}
.qnaButtonNot {
  color: orangered;
  font-weight: 800;
  background-color: white;
  border: 1px solid white;
  margin-bottom: 2.5%;
}
.lists {
  width: 90%;
  height: fit-content;
  padding-top: 2%;
  /* padding-bottom: 4%; */
  border: 2px solid silver;
  margin: 2%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.resThumb {
  display: inline;
  margin-left: 2%;
  margin-top: 5%;
  width: 10vw;
  height: 20vh;
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
  display: inline;
}
.ul {
  float: right;
  width: 60%;
  height: 100%;
  display: inline;
  list-style: none;
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
.rulesClicked {
  margin-top: 20px;
  font-size: 30px;
}
.reviews {
  width: 90%;
  margin-top: 5%;
  font-size: 1.4rem;
  line-height: 2.5;
  color: black;
  display: flex;
  border-bottom: 1px solid silver;
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
@media (max-width: 767px) {
  #app {
    font-family: Inter;
    width: auto;
    height: 100%;
  }
  body {
    margin: 0px;
  }
  .router {
    height: 100%;
  }
  html {
    width: 10%;
  }
}
</style>
