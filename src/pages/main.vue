<template>
  <div>
    <div class="popular">
      <div class="inner">
        <div class="title">
          인기장소
          <span class="hot">HOT</span>
          <button :disabled="disabled" @click="changePage" class="button">
            <span class="material-symbols-outlined">
              chevron_left
            </span>
          </button>
          <button :disabled="disabled" @click="changePage" class="button">
            <span class="material-symbols-outlined">
              chevron_right
            </span>
          </button>
        </div>
        <div v-if="page" class="places">
          <div v-for="place in hotPlaces1" :key="place.companyId" class="place">
            <div style="width: 80%; height: 70%; margin: 0 auto">
              <img class="img" :src="place.firstImage" @click="moveToPlaceDetail(place.companyId)" />
            </div>
            <div style=" width: 80%; height: 7%; margin: 0 auto; font-size: 100%; color: #9e9e9e; " >
              <span>{{ place.location }}</span>
              <span v-for="type in place.types" :key="type">·{{ type }}</span>
              <img class="favorite_red" @click="addFavorite(place.companyId)" v-if="place.companyLike" src="../assets/heart_red.png" />
              <img class="favorite" @click="addFavorite(place.companyId)" v-else src="../assets/heart.png" />
            </div>
            <div style="width: 80%; height: 16%; margin: 0 auto; font-size: 160%" >
              <span style="cursor: pointer">{{ place.companyName }}</span>
            </div>
            <div style="width: 80%; height: 7%; margin: 0 auto">
              <span>
                {{ place.lowPrice .toString() .replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} 원
              </span>
              <span style="color: #f6ca4e">★</span>
              <span>{{ place.avgReview }}</span>
              <span style="color: #9e9e9e; margin-left: 1em"
                >리뷰 {{ place.reviewSize }}</span
              >
            </div>
          </div>
        </div>
        <div v-else class="places">
          <div v-for="place in hotPlaces2" :key="place.companyId" class="place">
            <div style="width: 80%; height: 70%; margin: 0 auto">
              <img class="img" :src="place.firstImage" @click="moveToPlaceDetail(place.companyId)" />
            </div>
            <div style=" width: 80%; height: 7%; margin: 0 auto; font-size: 100%; color: #9e9e9e; " >
              <span>{{ place.location }}</span>
              <span v-for="type in place.types" :key="type">·{{ type }}</span>
              <img class="favorite_red" @click="addFavorite(place.companyId)" v-if="place.companyLike" src="../assets/heart_red.png" />
              <img
                class="favorite"
                @click="addFavorite(place.companyId)"
                v-else
                src="../assets/heart.png"
              />
            </div>
            <div
              style="width: 80%; height: 16%; margin: 0 auto; font-size: 160%"
            >
              <span style="cursor: pointer">{{ place.companyName }}</span>
            </div>
            <div style="width: 80%; height: 7%; margin: 0 auto">
              <span>
                {{ place.lowPrice .toString() .replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} 원
              </span>
              <span style="color: #f6ca4e">★</span>
              <span>{{ place.avgReview }}</span>
              <span style="color: #9e9e9e; margin-left: 1em" >
                리뷰 {{ place.reviewSize }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div class="box40">
        <router-link class="hostingGuide" :to="{ name: 'Guide' }">
          <div style=" color: white; font-size: 3vh; font-weight: bold; padding-left: 3%; margin-top: 3.4%; " >
            장소 등록, 시작해볼까요?
            <img style="float: right; width: 7%; margin-right: 3%" src="../assets/reg.png" />
          </div>
          <div style="color: white; font-weight: bold; padding-left: 3%">
            호스팅 가이드 보기
          </div>
        </router-link>
      </div>
      <div class="box40">
        <div class="views">
          <div class="view1" @click="moveToOffice">
            <div style=" margin: 5% 5%; font-size: 1.5em; font-weight: bold; color: #041461; " >
              OFFICE
            </div>
          </div>
          <div class="view2" @click="moveToMeeting">
            <div style="margin: 5% 5%; font-size: 1.5em;; font-weight: bold">
              MEETING ROOM
            </div>
          </div>
          <div class="view3" @click="moveToDesk">
            <div style=" margin: 5% 5%; font-size: 1.5em; font-weight: bold; color: white; " >
              DESK
            </div>
          </div>
        </div>
      </div>
      <div class="box20">
        <div class="findPlace" @click="moveToAll">전체 보기</div>
      </div>

    <div class="new">
      <div class="inner">
        <div class="title">
          새로 등록된 장소
          <span class="newP">NEW</span>
        </div>
        <div class="places">
          <div v-for="place in newPlaces" :key="place.companyId" class="place">
            <div style="width: 80%; height: 70%; margin: 0 auto">
              <img class="img" :src="place.firstImage" @click="moveToPlaceDetail(place.companyId)" />
            </div>
            <div style=" width: 80%; height: 7%; margin: 0 auto; font-size: 100%; color: #9e9e9e; " >
              <span>{{ place.location }}</span>
              <span v-for="type in place.types" :key="type">·{{ type }}</span>
              <img
                class="favorite_red"
                @click="addFavorite(place.companyId)"
                v-if="place.companyLike"
                src="../assets/heart_red.png"
              />
              <img
                class="favorite"
                @click="addFavorite(place.companyId)"
                v-else
                src="../assets/heart.png"
              />
            </div>
            <div
              style="width: 80%; height: 16%; margin: 0 auto; font-size: 160%"
            >
              <span style="cursor: pointer">{{ place.companyName }}</span>
            </div>
            <div style="width: 80%; height: 7%; margin: 0 auto">
              <span
                >{{
                  place.lowPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }}
                원
              </span>
              <span style="color: #f6ca4e">★</span>
              <span>{{ place.avgReview }}</span>
              <span style="color: #9e9e9e; margin-left: 1em"
                >리뷰 {{ place.reviewSize }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "@/axios";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const hotPlaces1 = ref([]);
    const hotPlaces2 = ref([]);
    const newPlaces = ref([]);
    const page = ref(true);
    const disabled = ref(false);

    const main = async () => {
      await axios
        .get("company/main", {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        })
        .then((res) => {
          if (res.data.hotCompany.length > 4) {
            hotPlaces1.value = res.data.hotCompany.slice(0, 4);
            hotPlaces2.value = res.data.hotCompany.slice(
              4,
              res.data.hotCompany.length
            );
          } else {
            hotPlaces1.value = res.data.hotCompany.slice(
              0,
              res.data.hotCompany.length
            );
            disabled.value = true;
          }
          newPlaces.value = res.data.newCompany;
        });
    };

    main();

    const moveToOffice = () => {
      store.dispatch("updatePage", 1);
      store.dispatch("updateType", "office");
      store.dispatch("updateDate", null);
      store.dispatch("updateTime", null);
      store.dispatch("updateWord", "");
      router.push({
        name: "FindPlace",
      });
    };

    const moveToMeeting = () => {
      store.dispatch("updatePage", 1);
      store.dispatch("updateType", "meeting-room");
      store.dispatch("updateDate", null);
      store.dispatch("updateTime", null);
      store.dispatch("updateWord", "");
      router.push({
        name: "FindPlace",
      });
    };

    const moveToDesk = () => {
      store.dispatch("updatePage", 1);
      store.dispatch("updateType", "desk");
      store.dispatch("updateDate", null);
      store.dispatch("updateTime", null);
      store.dispatch("updateWord", "");
      router.push({
        name: "FindPlace",
      });
    };

    const moveToAll = () => {
      store.dispatch("updatePage", 1);
      store.dispatch("updateType", "total");
      store.dispatch("updateDate", null);
      store.dispatch("updateTime", null);
      store.dispatch("updateWord", "");
      router.push({
        name: "FindPlace",
      });
    };

    const changePage = () => {
      page.value = !page.value;
    };

    const addFavorite = async (companyId) => {
      await axios
        .post(`company/like/${companyId}`, {
          headers: {
            Authorization: localStorage.getItem("access_token"),
          },
        })
        .then(() => {
          window.location.reload();
        });
    };

    const moveToPlaceDetail = async (companyId) => {
      router.push({
        name: "PlaceDetail",
        query: {
          id: companyId,
        },
      });
    };

    //편의점 CS2, 지하철 SW8, 숙박 AD5, 음식점 FD6, 카페 CE7
    const test = async () => {
      await axios.get(`https://dapi.kakao.com/v2/local/search/category.json?category_group_code=CS2&x=126.73206089548538&y=37.52580830698037&radius=200`, {
        headers: {
          Authorization: 'KakaoAK 076ace465a5b49eeff44095c98711587',
        }
      }).then((res) => {
        console.log(res.data);
      })
    }

    test();
    

    return {
      moveToAll,
      hotPlaces1,
      hotPlaces2,
      newPlaces,
      page,
      changePage,
      disabled,
      addFavorite,
      moveToPlaceDetail,
      moveToOffice,
      moveToMeeting,
      moveToDesk,
    };
  },
};
</script>

<style scoped>
.popular {
  width: 100%;
  height: 450px;
  background-color: #f0f3f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.inner {
  width: 1200px;
  height: 80%;
}
.title {
  width: 100%;
  height: 2em;
  color: #041461;
  float: left;
  font-size: 1.5em;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: 1em;
}
.hot {
  margin-left: 1em;
  font-size: 0.5em;
  font-weight: lighter;
  color: #ff5252;
  background-color: white;
  padding: 0.3em 1em;
  border: 1px #ff5252 solid;
  border-radius: 1em;
  margin-right: 1em;
}
.places {
  width: 100%;
  height: 80%;
}
.button {
  width: 2em;
  height: 2em;
  border: none;
  cursor: pointer;
}
.place {
  width: 25%;
  height: 100%;
  float: left;
}
.box40 {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3em 0;
}
.box20 {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hostingGuide {
  width: 1000px;
  height: 140px;
  background-color: #041461;
  border-radius: 1em;
  cursor: pointer;
  text-decoration: none;
}
.views {
  width: 1000px;
  height: 100px;
  display: flex;
}
.view1 {
  width: 30.3%;
  height: 100%;
  margin: 0% 1.5%;
  background-color: grey;
  border-radius: 1vw;
  cursor: pointer;
  background-image: url("../assets/office.png");
  background-size: contain;
}
.view2 {
  width: 30.3%;
  height: 100%;
  margin: 0% 1.5%;
  background-color: grey;
  border-radius: 1vw;
  cursor: pointer;
  background-image: url("../assets/meeting.png");
  background-size: contain;
}
.view3 {
  width: 30.3%;
  height: 100%;
  margin: 0% 1.5%;
  background-color: grey;
  border-radius: 1vw;
  cursor: pointer;
  background-image: url("../assets/desk.png");
  background-size: contain;
}
.findPlace {
  width: 200px;
  height: 50px;
  font-size: 1em;
  font-weight: lighter;
  color: gray;
  background-color: white;
  border: 1px solid gray;
  border-radius: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
}
.findPlace:hover {
  background-color: gray;
  color: white;
}
.favorite {
  float: right;
  cursor: pointer;
  width: 12%;
}
.favorite_red {
  float: right;
  cursor: pointer;
  width: 15%;
}
.img {
  width: 100%;
  height: 80%;
  object-fit: cover;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 1em;
}
.new {
  width: 100%;
  height: 450px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.newP {
  margin-left: 1em;
  font-size: 0.5em;
  font-weight: lighter;
  color: #5271ff;
  background-color: white;
  padding: 0.3em 1em;
  border: 1px #5271ff solid;
  border-radius: 2vw;
}
</style>
