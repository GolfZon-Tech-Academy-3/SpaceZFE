<template>
  <div>
    <div class="popular">
      <div class="title">
        인기장소
        <span class="hot">HOT</span>
      </div>
      <div class="places">
        <div v-for="place in hotPlaces" :key="place.companyId" class="place">
          <div style="width: 80%; height: 70%; margin: 0 auto">
            <router-link :to="{name: 'PlaceDetail', query: {id: place.companyId}}">
              <img class="img" :src="place.firstImage"/>
            </router-link>
          </div>
          <div style=" width: 80%; height: 7%; margin: 0 auto; font-size: 100%; color: #9e9e9e;white-space: nowrap;" >
            <span>{{ place.location }}</span>
            <span v-for="type in place.types" :key="type">·{{ type }}</span>

            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;" @click="addFavorite($event, place.companyId)" v-if="place.companyLike">
                favorite
            </span>
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;" @click="addFavorite($event, place.companyId)" v-else>
                favorite
            </span>
          </div>
          <div style="width: 80%; height: 10%; margin: 0 auto; font-size: 160%;" >
            <router-link style="cursor: pointer;white-space: nowrap;" :to="{name: 'PlaceDetail', query: {id: place.companyId}}">{{ place.companyName }}</router-link>
          </div>
          <div style="width: 80%; height: 7%; margin: 0 auto;white-space: nowrap;">
            <span>
              {{ place.lowPrice .toString() .replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} 원
            </span>
            <span v-if="(place.reviewSize !== 0)" style="color: #f6ca4e">★</span>
            <span v-if="(place.reviewSize !== 0)">{{ place.avgReview }}</span>
            <span v-else>평가없음</span>
            <span style="color: #9e9e9e; margin-left: 1em">
              리뷰 {{ place.reviewSize }}
            </span>
          </div>
        </div>
      </div>
    </div>

      <div class="box40">
        <router-link class="hostingGuide" :to="{ name: 'Guide' }">
          <div style=" color: white; font-size: 1.3em; font-weight: bold; padding-left: 3%; margin-top: 18px;" >
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
          <router-link class="view1" :to="{name: 'FindPlace'}" @click="moveToOffice">
            <div style=" margin: 5% 5%; font-size: 1.5em; font-weight: bold; color: #041461; " >
              OFFICE
            </div>
          </router-link>
          <router-link class="view2" :to="{name: 'FindPlace'}" @click="moveToMeeting">
            <div style="margin: 5% 5%; font-size: 1.5em;; font-weight: bold;color: black;">
              MEETING ROOM
            </div>
          </router-link>
          <router-link class="view3" :to="{name: 'FindPlace'}" @click="moveToDesk">
            <div style=" margin: 5% 5%; font-size: 1.5em; font-weight: bold; color: white; " >
              DESK
            </div>
          </router-link>
        </div>
      </div>
      <div class="box20">
        <router-link class="findPlace" :to="{name: 'FindPlace'}" @click="moveToAll">전체 보기</router-link>
      </div>

    <div class="new">
      <div class="title">
        새로 등록된 장소
        <span class="newP">NEW</span>
      </div>
      <div class="places">
        <div v-for="place in newPlaces" :key="place.companyId" class="place">
          <div style="width: 80%; height: 70%; margin: 0 auto">
            <router-link :to="{name: 'PlaceDetail', query: {id: place.companyId}}">
              <img class="img" :src="place.firstImage"/>
            </router-link>
          </div>
          <div style=" width: 80%; height: 7%; margin: 0 auto; font-size: 100%; color: #9e9e9e;white-space: nowrap;" >
            <span>{{ place.location }}</span>
            <span v-for="type in place.types" :key="type">·{{ type }}</span>

            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;" @click="addFavorite($event, place.companyId)" v-if="place.companyLike">
                      favorite
            </span>
            <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;" @click="addFavorite($event, place.companyId)" v-else>
                favorite
            </span>
          </div>
          <div style="width: 80%; height: 10%; margin: 0 auto; font-size: 160%" >
            <router-link style="cursor: pointer;white-space: nowrap;" :to="{name: 'PlaceDetail', query: {id: place.companyId}}">{{ place.companyName }}</router-link>
          </div>
          <div style="width: 80%; height: 7%; margin: 0 auto;white-space: nowrap;">
            <span >{{ place.lowPrice .toString() .replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} 원
            </span>
            <span v-if="(place.reviewSize !== 0)" style="color: #f6ca4e">★</span>
            <span v-if="(place.reviewSize !== 0)">{{ place.avgReview }}</span>
            <span v-else>평가없음</span>
            <span style="color: #9e9e9e; margin-left: 1em">
              리뷰 {{ place.reviewSize }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import axios from "@/axios";
export default {
  setup() {
    const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
    const store = useStore();
    const hotPlaces = ref([]);
    const newPlaces = ref([]);
    const disabled = ref(false);

    //신규장소, 인기장소 얻기
    const main = async () => {
      await axios
        .get(`${proxy}/company/main`, {
          headers: {
            Authorization: store.state.accessToken,
          },
        })
        .then((res) => {
          hotPlaces.value = res.data.hotCompany;
          newPlaces.value = res.data.newCompany;
        });
    };

    main();

    //오피스 검색
    const moveToOffice = () => {
      store.dispatch("updateType", "office");
      store.dispatch("updateDate", null);
      store.dispatch("updateTime", null);
      store.dispatch("updateWord", "");
    };

    //회의실 검색
    const moveToMeeting = () => {
      store.dispatch("updateType", "meeting-room");
      store.dispatch("updateDate", null);
      store.dispatch("updateTime", null);
      store.dispatch("updateWord", "");
    };

    //데스크 검색
    const moveToDesk = () => {
      store.dispatch("updateType", "desk");
      store.dispatch("updateDate", null);
      store.dispatch("updateTime", null);
      store.dispatch("updateWord", "");
    };

    //전체 검색
    const moveToAll = () => {
      store.dispatch("updateType", "total");
      store.dispatch("updateDate", null);
      store.dispatch("updateTime", null);
      store.dispatch("updateWord", "");
    };

    //좋아하는 장소 등록
    const addFavorite = async (e, companyId) => {
      console.log(store.state.accessToken);
      try {
          await axios.get(`${proxy}/company/like/${companyId}`, {
              headers: {
                  Authorization: store.state.accessToken,
              }
          }).then(() => {
              if(e.target.style["fontVariationSettings"] === "\"FILL\" 0") {//하트가 비어있을때
                  console.log('empty');
                  e.target.style["fontVariationSettings"] = "\"FILL\" 1";
              } else {//하트가 채워졌을 때
                  console.log('fill');
                  e.target.style["fontVariationSettings"] = "\"FILL\" 0";
              }
          })
      } catch (error) {
        console.log(error);
          alert('오류가 발생했습니다');
      }
    }

    return {
      moveToAll,
      hotPlaces,
      newPlaces,
      disabled,
      addFavorite,
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
  flex-direction: column;
}
.title {
  width: 90%;
  max-width: 1115.3px;
  height: 2em;
  color: #041461;
  float: left;
  font-size: 1.5em;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin: 0.5em auto;
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
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  text-align: center;
}
.button {
  width: 2em;
  height: 2em;
  border: none;
  cursor: pointer;
  background-color: #f0f3f5;
}
.place {
  width: 293.5px;
  height: 100%;
  overflow: auto;
  white-space: nowrap;
  display: inline-block;
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
  width: 90%;
  max-width: 900px;
  height: 100px;
  background-color: #041461;
  border-radius: 1em;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 0 5px 0 gray;
}
.views {
  width: 90%;
  max-width: 900px;
  height: 100px;
  display: flex;
}
.view1 {
  width: 30.3%;
  height: 100%;
  margin: 0% 1.5%;
  font-size: 80%;
  background-color: grey;
  border-radius: 1em;
  cursor: pointer;
  background-image: url("../assets/office.png");
  background-size: contain;
  box-shadow: 0 0 5px 0 gray;
}
.view2 {
  width: 30.3%;
  height: 100%;
  margin: 0% 1.5%;
  font-size: 80%;
  background-color: grey;
  border-radius: 1em;
  cursor: pointer;
  background-image: url("../assets/meeting.png");
  background-size: contain;
  box-shadow: 0 0 5px 0 gray;
}
.view3 {
  width: 30.3%;
  height: 100%;
  margin: 0% 1.5%;
  font-size: 80%;
  background-color: grey;
  border-radius: 1em;
  cursor: pointer;
  background-image: url("../assets/desk.png");
  background-size: contain;
  box-shadow: 0 0 5px 0 gray;
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
  box-shadow: 0 0 5px 0 gray;
  margin-bottom: 3em;
}
.findPlace:hover {
  background-color: gray;
  color: white;
}
.img {
  width: 100%;
  height: 80%;
  object-fit: cover;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 1em;
  box-shadow: 0 0 5px 0 gray;
}
.img:hover {
  width: 90%;
  height: 70%;
  margin : 5%;
}
.new {
  width: 100%;
  height: 450px;
  background-color: #f0f3f5;
  display: flex;
  flex-direction: column;
}
.newP {
  margin-left: 1em;
  font-size: 0.5em;
  font-weight: lighter;
  color: #5271ff;
  background-color: white;
  padding: 0.3em 1em;
  border: 1px #5271ff solid;
  border-radius: 1em;
}
.material-symbols-outlined {
    color: red;
    float: right;
    cursor: pointer;
    font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48
}
a {
  color: black;
}
</style>
