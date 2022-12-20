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
            <button class="interestPl" @click="changeClick">
              <span v-show="!companyLike" class="material-symbols-outlined"
                >favorite</span
              >
              <span
                v-show="companyLike"
                class="material-symbols-outlined"
                style="font-variation-settings: 'FILL' 1"
                >favorite</span
              >
              관심장소
            </button>
            <p class="placeLoc">{{ details.location }}</p>
            <ul class="placeDetails">
              <li>{{ details.summary }}</li>
            </ul>
          </div>
          <div class="imgLists">
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
    </div>
    <div class="detailNavDiv">
      <nav class="detailNav">
        <li class="nav" @click="resClick">
          <p class="hover" v-if="!resClicked">장소 예약</p>
          <p
            class="hover"
            v-if="resClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            장소 예약
          </p>
        </li>
        <li class="nav" @click="locClick">
          <p class="hover" v-if="!locClicked">장소 소개</p>
          <p
            class="hover"
            v-if="locClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            장소 소개
          </p>
        </li>
        <li class="nav" @click="showrules">
          <p class="hover" v-if="!rulesClicked">이용 규칙</p>
          <p
            class="hover"
            v-if="rulesClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            이용 규칙
          </p>
        </li>
        <li class="nav" @click="showReviews">
          <p class="hover" v-if="!reviewClicked">
            리뷰
            <a class="counts">{{ reviews.totalCount }}</a>
          </p>

          <p
            class="hover"
            v-if="reviewClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            리뷰
            <a class="counts">{{ reviews.totalCount }}</a>
          </p>
        </li>
        <li class="nav" @click="showQna">
          <p class="hover" v-if="!qnaClicked">
            Q&A
            <a class="counts">{{ qnas.count }}</a>
          </p>
          <p
            class="hover"
            v-if="qnaClicked"
            style="color: blue; border-bottom: 1px solid blue"
          >
            Q&A
            <a class="counts">{{ qnas.count }}</a>
          </p>
        </li>
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
                  class="binlists"
                  v-show="resDetails[num - 1].type == '오피스'"
                >
                  {{
                    resDetails[num - 1].price
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }}원/일
                </b>
                <b
                  class="binlists"
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
          <p style="font-size: 1.1em">
            <b style="color: rgb(4, 20, 97, 1)">장소 소개</b>
          </p>
          {{ details.info }}
          <hr />
          <section style="text-align: left">
            <p class="locClicked">
              <b style="color: red">장소 위치</b> 및
              <b style="color: red">주변</b>검색하기
            </p>
            <label for="type">
              주변시설:
              <select @click="resetSearch" v-model="arroundType">
                <!-- <option value="">주변 시설</option> -->
                <option selected disabled value="">주변 시설</option>
                <option value="CS2">편의점</option>
                <option value="SW8">지하철</option>
                <option value="AD5">숙박시설</option>
                <option value="FD6">음식점</option>
                <option value="CE7">까페</option>
                <option value="PK6">주차장</option>
              </select>
            </label>
            <br />
            <label for="range">
              주변 검색 범위:
              <select class="forms" @click="resetSearch" v-model="arroundRange">
                <option selected disabled value="">검색 범위</option>
                <option value="100">100m</option>
                <option value="200">200m</option>
                <option value="300">300m</option>
                <option value="500">500m</option>
              </select>
            </label>
            <button class="researchBtn" @click="around">검색</button>
            <!-- <button v-show="resetBtn" @click="resetSearch">
              다시 검색하기
            </button> -->

            <KaKaoMap
              class="map"
              :options="mapOption"
              :arounds="arrounds"
              :reset="resetBtn"
              :level="levels"
              :aroundType="arroundType"
              @x="getx"
              @y="gety"
              @resBtn="reset"
            />
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
              [{{ reviews.reviews[num - 1].spaceName }}] 사용 <br />
              {{ reviews.reviews[num - 1].content }}
            </div>
          </div>
          <pagination
            v-if="reviews.reviews.length"
            :numberOfPages="numberOfPages"
            :currentPage="currentPage"
            :currentQnaPage="[]"
            :limit="0"
            @click="getReviews"
          >
          </pagination>
          <Nothing v-if="reviews.reviews.length == 0" what="리뷰가" />
        </div>
        <div class="qnaClicked" v-show="qnaClicked">
          <h2 @click="uploadQna">질문하기</h2>
          <Nothing v-if="qnas.list.length == 0" v-show="showQ" what="Q&A가" />
          <div>
            <QnaWrite :qnaAnswer="qnaInfo" v-if="showWrite" />
          </div>
          <div
            style="margin-top: 2%"
            v-for="num in currnetQnaPage.length"
            :key="num"
          >
            <div class="qnas">
              <img
                class="profilePic"
                :src="currnetQnaPage[num - 1].imagePath"
              />
              <div style="line-height: 1.6; margin-left: 3%">
                <p>
                  <b>
                    {{ currnetQnaPage[num - 1].memberName }}
                  </b>
                  {{ currnetQnaPage[num - 1].inquiryTime }}
                </p>
                {{ currnetQnaPage[num - 1].inquiries }}
              </div>
            </div>
            <button
              v-show="currnetQnaPage[num - 1].answers != null"
              class="qnaButton"
              @click="showCanvas(currnetQnaPage[num - 1].inquiryId)"
            >
              답변보기
              <span
                style="color: black"
                v-show="!currnetQnaPage[num - 1].showMyAnswer"
                >&#8744;</span
              >
              <span
                style="color: black"
                v-show="currnetQnaPage[num - 1].showMyAnswer"
              >
                &#8743;</span
              >
            </button>
            <button
              v-show="currnetQnaPage[num - 1].answers == null"
              class="qnaButtonNot"
            >
              답변 미등록
            </button>
            <QnaOffcanvas
              :qnaAnswer="qnaAnswer"
              v-show="currnetQnaPage[num - 1].showMyAnswer"
            />
          </div>
          <pagination
            v-if="qnas.list.length"
            :numberOfPages="numberofQnaPages"
            :currentPage="0"
            :currentQnaPage="currnetQnaPage"
            :limit="qnasLimit"
            @click="getQnas"
          />
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
import Nothing from "@/components/UI/Nothing.vue";

import { useRoute, useRouter } from "vue-router";
import axios from "@/axios";
import { ref, computed } from "vue";
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
    Nothing,
  },

  setup() {
    const proxy = window.location.hostname === "localhost" ? "" : "/proxy";

    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const id = ref(route.query.id);

    const details = ref({});
    const resDetails = ref([]);

    let currentImgNum = ref(0);
    let currentImg = ref("");
    let imageList = ref([]);
    const companyLike = ref(false);

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
    const showQ = ref(true);

    const mapOption = ref({
      center: {
        lat: 33.450701,
        lng: 126.570667,
      },
      level: 5,
      location: null,
      img: null,
    });

    // let limit = 5;
    const currentPage = ref(1);
    const numberOfReviews = ref(0);
    const numberOfPages = computed(() => {
      return Math.ceil(numberOfReviews.value / 5);
    });

    let qnasLimit = ref(5);
    const currnetQnaPage = ref([]);
    const numberOfQnas = ref(0);
    const numberofQnaPages = computed(() => {
      return Math.ceil(numberOfQnas.value / 5);
    });

    const arrounds = ref([]);
    const arroundType = ref("");
    const arroundRange = ref("");

    const locX = ref("");
    const locY = ref("");
    const levels = ref(0);
    const resetBtn = ref(false);
    const resetSearchBtn = ref(0);

    // qna 장소 상세 get하는 함수
    const res = async () => {
      loading.value = true;
      try {
        await axios
          .get(`${proxy}/company/details/${id.value}`, {
            headers: {
              Authorization: store.state.accessToken,
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
            mapOption.value.img = details.value.spaceImages[0];
            console.log(details.value);

            axios
              .get(`${proxy}/inquiry/total/${companyId.value}`, {
                headers: {
                  Authorization: store.state.accessToken,
                },
              })
              .then((res) => {
                qnas.value = { ...res.data };
                for (let i = 0; i < qnas.value.list.length; i++) {
                  qnas.value.list[i].showMyAnswer = false;
                }
                currnetQnaPage.value = res.data.list.slice(0, 5);
                numberOfQnas.value = res.data.count;
                console.log(res.data);
                console.log(currnetQnaPage.value.length);
                console.log(currnetQnaPage.value);
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

    //주변정보 검색
    const around = async () => {
      try {
        await axios
          .get(
            `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${arroundType.value}&x=${locX.value}&y=${locY.value}&radius=${arroundRange.value}`,
            {
              headers: {
                Authorization: "KakaoAK 076ace465a5b49eeff44095c98711587",
              },
            }
          )
          .then((res) => {
            arrounds.value = res.data.documents;
            arroundType.value = arroundType.value;
            levels.value = arroundRange.value;
            resetBtn.value = !resetBtn.value;
            if (arrounds.value.length == 0) {
              alert(
                "지정하신 범위 내에 검색한 타입의 장소가 없습니다 다시 재설정해서 검색해 주세요"
              );
              resetBtn.value = !resetBtn.value;
              return;
            }
          });
      } catch (error) {
        if (error.response.status == 400) {
          alert("검색 범위와 장소 타입을 지정해 주세요!");
          return;
        } else if (error.response.status >= 500) {
          alert("일시적인 서버 오류 입니다 나중에 다시 시도해 주세요");
          return;
        } else if (error.response.status == 401) {
          alert("일시적인 로그인 오류입니다 로그아웃 후 다시 이용해 주세요");
          return;
        } else if (error.response.status == 404) {
          alert("알 수 없는 오류가 발생했습니다 나중에 다시 시도해 주세요");
          return;
        }
      }
    };

    const reset = (tf) => {
      resetBtn.value = tf;
      console.log(tf);
    };

    const getx = (x) => {
      locX.value = x;
    };
    const gety = (y) => {
      locY.value = y;
    };

    const resetSearch = () => {
      // arrounds.value = "";
      resetBtn.value = !resetBtn.value;
    };

    //review받아서  pagination하는함수
    const getReviews = async (page = currentPage.value) => {
      currentPage.value = page;
      await axios
        .get(`${proxy}/review/total/${id.value}?page=${page}`, {
          headers: {
            Authorization: store.state.accessToken,
          },
        })
        .then((res) => {
          reviews.value = { ...res.data };
          numberOfReviews.value = reviews.value.totalCount;
        });
    };
    getReviews();

    //qna pagination
    const getQnas = (e) => {
      let x = 0;
      if (e == "go") {
        qnasLimit.value += 5;
        x += 5;
        currnetQnaPage.value = qnas.value.list.slice(x, qnasLimit.value);
      } else if (e == "back") {
        qnasLimit.value -= 5;
        x -= 5;
        currnetQnaPage.value = qnas.value.list.slice(x, qnasLimit.value);
      } else if (e != "go" && e != "back") {
        // qnasLimit.value = e * qnasLimit.value;
        qnasLimit.value = e * 5;
        x = e * 5;
        currnetQnaPage.value = qnas.value.list.slice(x - 5, e * 5);
        console.log(qnasLimit.value, x);
      }
      console.log(e);
    };

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
      for (let i = 0; i < details.value.spaceImages.length; i++) {
        imageList.value = details.value.spaceImages[i];
      }
      currentImg.value = e.target.src;
    };

    //관심장소
    const changeClick = async (e) => {
      await axios
        .get(`${proxy}/company/like/${id.value}`, {
          headers: {
            Authorization: store.state.accessToken,
          },
        })
        .then(() => {
          companyLike.value = !companyLike.value;
          // console.log(e.target);
        });
    };

    //이용안내 모달 띄우는 함수
    const useInfo = (info) => {
      useInfoModal.value = !useInfoModal.value;
      useInfoString.value = info;
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
          qnas.value.list[i].showMyAnswer = false;
        }
      }
    };

    //예약 페이지로 가는 함수
    const moveToPage = (id) => {
      router.push({
        name: "Reservation",
        query: {
          sid: id,
          cid: route.query.id,
        },
      });
    };

    //Qna 오프캔버스 띄울 함수
    const uploadQna = () => {
      showWrite.value = !showWrite.value;
      showQ.value = !showQ.value;
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
      currentPage,
      numberOfPages,
      getReviews,
      companyLike,
      showQ,
      currnetQnaPage,
      numberOfQnas,
      numberofQnaPages,
      getQnas,
      qnasLimit,
      arrounds,
      arroundType,
      arroundRange,
      around,
      getx,
      gety,
      levels,
      reset,
      resetBtn,
      resetSearch,
      resetSearchBtn,
    };
  },
};
</script>

<style scoped>
.entireForm {
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.picsAndIntro {
  width: inherit;
  flex: 1;
  padding: 0%10%0%10%;
  height: 50vh;
}
.intplace {
  float: right;
  width: 20vw;
  height: 20vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  white-space: nowrap;
}
.placeLoc {
  font-size: 1.3em;
  float: left;
  margin: 2%0%2%0%;
}
.interestPl {
  font-size: 1.2em;
  margin-right: 20%;
  width: 50%;
  text-align: center;
  background: #d2e1f9;
  border: 1px solid #d2e1f9;
  border-radius: 10px;
}
.placeDetails {
  font-size: 2.5vh;
  width: fit-content;
  min-height: 50%;
  padding: 2%;
  color: white;
  border-radius: 10px;
  background: linear-gradient(
      270deg,
      rgba(96, 173, 163, 0.42) 0%,
      rgba(234, 235, 255, 0) 100%
    ),
    linear-gradient(90deg, #5698b8 0%, #5faba5 100%);
}
.imgLists {
  text-align: left;
}
.detailNavDiv {
  height: fit-content;
  float: left;
  flex: 1;
}
.detailNav {
  width: 100%;
  height: inherit;
  padding: 3%;
}
.form {
  width: 100%;
  margin-top: 20px;
  text-align: center;
}

.navContainer {
  width: 900px;
  height: fit-content;
  padding-left: 7%;
  padding-bottom: 5%;
}
.img {
  /* width: 70%; */
  text-align: left;
}
.big {
  width: 60%;
  height: 60vh;
  margin: auto;
  border-radius: 5%;
}
.list {
  float: left;
  width: 7%;
  height: 10vh;
  margin: 1%;
  border-radius: 10%;
  opacity: 0.9;
}
.list:hover {
  opacity: 1;
}
.lineIntro {
  text-align: left;
  font-size: 5vh;
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
  border: 2px solid silver;
  border-radius: 15px;
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
  border-radius: 10px;
}
.resType {
  font-size: 1.2em;
}
.resSpace {
  font-size: 1.2em;
}
.resBtn {
  width: 80%;
  margin-left: 8%;
  margin-top: 3%;
  margin-bottom: 3%;
  border-radius: 10px;
  border: 0.1px solid rgb(4, 20, 97, 1);
  background-color: rgb(4, 20, 97, 1);
  color: white;
  font-size: 1.3rem;
  display: inline;
}
.resBtn:hover {
  background-color: #1e6ff4;
  border: 0.1px solid #1e6ff4;
  transition: 0.2s;
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
  font-size: 1.5em;
  margin-right: 5%;
  margin-left: 5%;
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
  margin-top: 5%;
  font-size: 1.4em;
  padding-left: 6%;
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
.material-symbols-outlined {
  color: red;
  cursor: pointer;
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
}
.forms {
  margin-bottom: 2%;
}
.researchBtn {
  margin-left: 2%;
  width: 4vw;
  background: rgb(4, 20, 97, 1);
  border: 1px solid rgb(4, 20, 97, 1);
  color: white;
  border-radius: 5px;
  font-size: 0.7em;
}
.researchBtn:hover {
  border-bottom: 1px solid blue;
  background: blue;
}
.counts {
  opacity: 0.6;
  margin-left: 10px;
}
.binlists {
  margin-left: 60%;
}
@media all and (max-width: 768px) {
  #app {
    font-family: Inter;
    width: auto;
    height: 100%;
  }
  .entireForm {
    height: auto;
    /* display: block; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
  .picsAndIntro {
    padding: 0;
  }
  .form {
    margin-top: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }
  .img {
    width: 96%;
    padding: 0%2%0%2%;
    text-align: left;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    flex-wrap: nowrap;
  }
  .intplace {
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    flex-direction: column;
    height: 20vh;
    align-items: flex-start;
    margin-left: 2%;
    height: 20%;
  }
  .placeLoc {
    flex: auto;
    height: auto;
    font-size: 1em;
    margin: 2%0%2%0%;
  }
  .interestPl {
    font-size: 1.2em;
    background: #d2e1f9;
    border: 1px solid #d2e1f9;
    border-radius: 10px;
    margin-right: 0;
    text-align: left;
    width: auto;
  }
  .placeDetails {
    background: linear-gradient(
        270deg,
        rgba(96, 173, 163, 0.42) 0%,
        rgba(234, 235, 255, 0) 100%
      ),
      linear-gradient(90deg, #5698b8 0%, #5faba5 100%);
    font-size: 3.5vh;
    color: white;
    border-radius: 10px;
  }
  .detailNavDiv {
    height: 100%;
    float: left;
    flex: 1;
  }
  .detailNav {
    width: 100%;
    height: inherit;
    padding: 3%;
    display: flex;
  }

  .navContainer {
    width: 100%;
    height: fit-content;
    padding-left: 0;
    padding-bottom: 5%;
  }
  .img {
    width: 94%;
    /* text-align: left; */
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    flex-wrap: nowrap;
  }
  .big {
    width: 100%;
    height: 60vh;
    position: relative;
    /* margin: auto; */
    align-self: left;
    border-radius: 5%;
    transition: 1s;
  }
  .list {
    float: left;
    width: 12%;
    height: 10vh;
    margin: 1.5%;
    text-align: center;
    border-radius: 10%;
    opacity: 0.9;
  }
  .list:hover {
    opacity: 1;
  }
  .imgLists {
    text-align: left;
    margin-bottom: 2%;
    width: 100%;
  }
  .lineIntro {
    text-align: left;
    font-size: 5vh;
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
    border: 2px solid silver;
    border-radius: 15px;
    margin: 2%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }
  .binlists {
    margin-left: 40%;
  }
  .resThumb {
    display: inline;
    margin-left: 1%;
    margin-top: 1%;
    width: 24%;
    height: 19vh;
    border-radius: 10px;
  }
  .resType {
    font-size: 1.05em;
  }
  .resSpace {
    font-size: 1.05em;
  }
  li > b {
    font-size: 0.8em;
  }
  li {
    font-size: 0.8em;
  }
  .resBtn {
    width: 80%;
    margin-left: 8%;
    margin-top: 3%;
    margin-bottom: 3%;
    border-radius: 10px;
    border: 0.1px solid rgb(4, 20, 97, 1);
    background-color: rgb(4, 20, 97, 1);
    color: white;
    font-size: 1.2em;
    display: inline;
  }
  .resBtn:hover {
    background-color: #1e6ff4;
    border: 0.1px solid #1e6ff4;
    transition: 0.2s;
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
    display: contents;
    font-size: 0.86em;
    font-weight: 600;
    justify-content: space-evenly;
  }
  .counts {
    opacity: 0.6;
    margin-left: 5px;
  }
  .hover {
    margin: 0%2%0%2%;
  }

  .hover:hover {
    border-bottom: 1px solid blue;
    color: blue;
  }
  .locClicked {
    font-size: 1em;
    padding: 2%;
  }
  .rulesClicked {
    margin-top: 5%;
    font-size: 1em;
    padding-left: 3%;
  }
  .reviewClicked {
    padding: 2%;
  }

  .reviews {
    width: 90%;
    margin-top: 5%;
    font-size: 1em;
    line-height: 2.5;
    color: black;
    display: flex;
    border-bottom: 1px solid silver;
  }

  .profilePic {
    width: 20%;
    height: 20%;
    border-radius: 50px;
  }
  .qnaClicked {
    padding: 2%;
  }

  .qnas {
    width: 90%;
    margin-top: 10%;
    font-size: 1em;
    line-height: 2.5;
    color: black;
    margin-top: 5%;
    display: flex;
    width: 80%;
  }
  .material-symbols-outlined {
    color: red;
    cursor: pointer;
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
  }
  .forms {
    margin-bottom: 2%;
  }
  .researchBtn {
    margin-left: 2%;
    width: 14%;
    background: rgb(4, 20, 97, 1);
    border: 1px solid rgb(4, 20, 97, 1);
    color: white;
    border-radius: 5px;
    font-size: 0.7em;
  }
  .researchBtn:hover {
    border-bottom: 1px solid blue;
    background: blue;
  }
}
</style>
