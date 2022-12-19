<template>
    <div>
        <div style="width: 100%;background-color: white;">
            <div id="title" class="title">
                <div style="font-weight:bold;color:#F65F09;font-size: 1em;">
                    Find Places
                </div>
                <div style="font-size:2em;font-weight: bold;">
                    찾아 보기
                </div>
            </div>
            
            <div id="fixed">
                <div class="typeSelection">
                    <div :class="[ searchType === 'total' ? 'yes' : 'no']" style="margin-left: 1em;" @click="selectAll(1)">
                        전체
                    </div>
                    <div :class="[ searchType === 'office' ? 'yes' : 'no']" @click="selectOffice(1)">
                        오피스
                    </div>
                    <div :class="[ searchType === 'desk' ? 'yes' : 'no']" @click="selectDesk(1)">
                        데스크
                    </div>
                    <div :class="[ searchType === 'meeting-room' ? 'yes' : 'no']" @click="selectMeeting(1)">
                        회의실
                    </div>
                    <div class="mapBtn" @click="controlMapModal">지도</div>

                    <span style="display:inline-block;width: 130px; height: 100%;">
                        <div style="color: #9E9E9E; font-size: 1em;">날짜</div>
                        <input id="dateSelector" type="date" @change="changeDate($event)" :value="searchDate" :min="today" />
                    </span>
                    <span style="display:inline-block;width: 100px; height: 100%;margin-left:1%;">
                        <div style="color: #9E9E9E; font-size: 1em;">시간</div>
                        <select id="timeSelector" @change="changeTime($event)" :value="searchTime">
                            <option value='null' selected>선택안함</option>
                            <option v-for="val in 24" :key="val - 1">{{val - 1}} 시</option>
                        </select>
                    </span>
                    <span style="display:inline-block;width: 200px; height: 50px;margin-left:0%;">
                        <input class="search" type="text" placeholder="검색" @change="changeWord($event)" @keyup.enter="searchWithCondition" :value="searchWord">
                    </span>
                    <span style="width: 30%; height: 100%;">
                        <button class="searchButton" @click="resetCondition">초기화</button>
                    </span>
                    <span style="width: 30%; height: 100%;">
                        <button class="searchButton" @click="searchWithCondition">적용</button>
                    </span>
                </div>
            </div>

            <div id="fake" />
            
        </div>

        <div v-if="noResult" style="margin:3% auto; width : 100%;text-align:center;font-size:2em;">
            검색결과 없음
        </div>
        <div v-else class="grid">
            <div style="width: 100%;" v-for="place in resultPlace" :key="place.companyId" @scroll="handleScroll">
                <div style="height: 50%;padding: 1em 1em 0 1em;">
                    <router-link :to="{name: 'PlaceDetail', query: {id: place.companyId}}">
                        <img class="img" :src="place.firstImage" />
                    </router-link>
                </div>
                <div style="height: 10%;padding: 0 2em;margin-top:1em;color:#9E9E9E;white-space: nowrap;">
                    <span>{{place.location}}</span>
                    <span v-for="type in place.types" :key="type"> · {{type}}</span>

                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;" @click="addFavorite($event, place.companyId)" v-if="place.companyLike">
                        favorite
                    </span>
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;" @click="addFavorite($event, place.companyId)" v-else>
                        favorite
                    </span>
                </div>
                <router-link style="height: 15%; padding: 0 1em;font-size: 2em; cursor:pointer;white-space: nowrap;" :to="{name: 'PlaceDetail', query: {id: place.companyId}}">
                    {{place.companyName}}
                </router-link>
                <div style="width:80%; height:7%; margin:0 auto;white-space: nowrap;">
                    <span>{{place.lowPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}} 원 </span>
                    <span v-if="(place.reviewSize !== 0)" style="color: #f6ca4e">★</span>
                    <span v-if="(place.reviewSize !== 0)">{{ place.avgReview }}</span>
                    <span v-else>평가없음</span>
                    <span style="color: #9e9e9e; margin-left: 1em">
                        리뷰 {{ place.reviewSize }}
                    </span>
                </div>
            </div>
        </div>

        <SearchMapModal @close="controlMapModal" v-if="showMapModal" :placeInfo="resultPlace" />
        <Toast v-if="showToast" :message="toastMessage" />
        <div id="loading" v-show="loading" />
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted  } from 'vue';
import { useStore } from 'vuex';
import axios from '@/axios';
import SearchMapModal from '@/components/SearchMapModal.vue';
import Toast from '@/components/Toast.vue'
import { useToast } from '@/composables/toast';
export default {
    components: {
        SearchMapModal,
        Toast,
    },
    setup() {
        const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
        const store = useStore();
        const searchType = computed(() => store.state.searchType);
        const searchDate = computed(() => store.state.searchDate);
        const searchTime = computed(() => store.state.searchTime);
        const searchWord = computed(() => store.state.searchWord);
        const resultPlace = ref([]);
        const noResult = ref(false);
        const resultAllNum = ref(0);
        const pageNum = ref(0);
        const currentPage = ref(1);
        const showMapModal = ref(false);
        const loading = ref(false);
        const stopLoading = ref(false);

        const {
            toastMessage, showToast, triggerToast,
        } = useToast();

        onMounted(() => {
            setTimeout(() => {
                document.addEventListener('scroll', scrollEvent);
            }, 100);
        })

        onUnmounted(() => {
            document.removeEventListener('scroll', scrollEvent);
        })

        const scrollEvent = () => {
            document.documentElement.scrollTop;
            let scrollTop = document.querySelector('html').scrollTop;
            let clientHeight = document.querySelector('html').clientHeight;
            let scrollHeight = document.querySelector('html').scrollHeight;
            if(scrollTop > 165) {
                document.getElementById('fixed').style = 'position: fixed;top: 3.75em;left:0;width: 100%;background-color: white;box-shadow: 0 0 5px 0 gray';
                document.getElementById('title').style = 'display: none;';
                document.getElementById('fake').style = 'width: 100%;height: 250px;';
            } else {
                document.getElementById('fixed').style = '';
                document.getElementById('title').style = '';
                document.getElementById('fake').style = '';
            }
            if(scrollTop + clientHeight >= scrollHeight - 20) {
                if(!stopLoading.value) {
                    loading.value = true;
                    setTimeout(() => {
                        loading.value = false;
                        currentPage.value += 1;
                        search(currentPage.value);
                    }, 1000);
                }
            }
        }

        const search = async (page) => {
            if(searchTime.value != null) { //검색 시간이 존재할때
                if(searchTime.value.length === 3) {
                    await axios.post(`${proxy}/company/${searchType.value}?page=${page}`,
                    {
                        date: searchDate.value,
                        time: searchTime.value[0] + ':00',
                        location: searchWord.value,
                    },
                    {
                        headers: {
                            Authorization: store.state.accessToken
                        }
                    })
                        .then((res) => {
                            resultAllNum.value = res.data.totalSize;
                            pageNum.value = res.data.totalPage;
                            if(res.data.company.length === 0) {
                                triggerToast('더 로드할 장소가 없습니다');
                                stopLoading.value = true;
                            }
                            res.data.company.forEach(place => {
                                resultPlace.value.push(place);
                            });
                        })
                } else {
                    await axios.post(`${proxy}/company/${searchType.value}?page=${page}`,
                        {
                            date: searchDate.value,
                            time: searchTime.value[0] + searchTime.value[1] + ':00',
                            location: searchWord.value,
                        },
                        {
                            headers: {
                                Authorization: store.state.accessToken
                            }
                        })
                            .then((res) => {
                                resultAllNum.value = res.data.totalSize;
                                pageNum.value = res.data.totalPage;
                                if(res.data.company.length === 0) {
                                    triggerToast('더 로드할 장소가 없습니다');
                                    stopLoading.value = true;
                                }
                                res.data.company.forEach(place => {
                                    resultPlace.value.push(place);
                                });
                            })
                }
            } else { //검색 시간이 존재하지 않을 때
                await axios.post(`${proxy}/company/${searchType.value}?page=${page}`,
                    {
                        date: searchDate.value,
                        time: searchTime.value,
                        location: searchWord.value,
                    },
                    {
                        headers: {
                            Authorization: store.state.accessToken
                        }
                    })
                        .then((res) => {
                            resultAllNum.value = res.data.totalSize;
                            pageNum.value = res.data.totalPage;
                            if(res.data.company.length === 0) {
                                triggerToast('더 로드할 장소가 없습니다');
                                stopLoading.value = true;
                            }
                            res.data.company.forEach(place => {
                                resultPlace.value.push(place);
                            });
                        })
            }
        }

        search(1);

        const changeDate = (event) => {
            if(event.target.value === '') {
                store.dispatch('updateDate', null);
            } else {
                store.dispatch('updateDate', event.target.value);
            }
        }
        
        const changeTime = (event) => {
            if(event.target.value == 'null') {
                store.dispatch('updateTime', null);
            } else {
                store.dispatch('updateTime', event.target.value);
            }
        }

        const changeWord = (event) => {
            store.dispatch('updateWord', event.target.value);
        }

        let today = new Date();
        today = dateFormat(today);

        function dateFormat(date) {
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();

            month = month >= 10 ? month : '0' + month;
            day = day >= 10 ? day : '0' + day;
            hour = hour >= 10 ? hour : '0' + hour;

            return date.getFullYear() + '-' + month + '-' + day;
        }

        const selectAll = () => {
            store.dispatch('updateType', 'total');
            currentPage.value = 1;
            window.location.reload();
        }

        const selectOffice = () => {
            store.dispatch('updateType', 'office');
            currentPage.value = 1;
            window.location.reload();
        }

        const selectDesk = () => {
            store.dispatch('updateType', 'desk');
            currentPage.value = 1;
            window.location.reload();
        }

        const selectMeeting = () => {
            store.dispatch('updateType', 'meeting-room');
            currentPage.value = 1;
            window.location.reload();
        }

        const searchWithCondition = () => {
            if(searchDate.value == null && searchTime.value != null) {
                alert('날짜와 시간을 모두 선택해주세요');
                return;
            }
            currentPage.value = 1;
            window.location.reload();
        }

        const resetCondition = () => {
            store.dispatch('updateDate', null);
            store.dispatch('updateTime', null);
            store.dispatch('updateWord', '');
        }

        const addFavorite = async (e, companyId) => {
            try {
                await axios.get(`${proxy}/company/like/${companyId}`, {
                    headers: {
                        Authorization: store.state.accessToken
                    }
                }).then(() => {
                    if(e.target.style["fontVariationSettings"] === "\"FILL\" 0") {//하트가 비어있을때
                        e.target.style["fontVariationSettings"] = "\"FILL\" 1";
                    } else {//하트가 채워졌을 때
                        e.target.style["fontVariationSettings"] = "\"FILL\" 0";
                    }
                })
            } catch (error) {
                alert('오류가 발생했습니다');
            }
        }

        const controlMapModal = () => {
            if(showMapModal.value === false) {
                triggerToast('지도를 닫으려면 더블클릭');
            }
            showMapModal.value = !showMapModal.value;
        }

        return {
            selectAll,
            selectOffice,
            selectDesk,
            selectMeeting,
            noResult,
            searchWithCondition,
            search,
            resultAllNum,
            pageNum,
            currentPage,
            searchType,
            searchDate,
            searchTime,
            searchWord,
            today,
            changeDate,
            changeTime,
            changeWord,
            resetCondition,
            resultPlace,
            addFavorite,
            controlMapModal,
            showMapModal,
            scrollEvent,
            toastMessage,
            showToast,
            triggerToast,
            loading,
            stopLoading,
        }
    }
}
</script>

<style scoped>
.title {
    width: 100%;
    text-align: center;
    padding: 3em 0;
}
.typeSelection {
    width: 100%;
    height: 70px;
    padding: 1em 0;
    text-align: center;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
}
.yes {
    display: inline;
    color: #041461;
    font-size: 1.5em;
    font-weight: bold;
}
.no {
    display: inline;
    color: #9E9E9E;
    margin: 0 1%;
    cursor:pointer;
}
#dateSelector {
    color:#9E9E9E;
    border: 1px #9E9E9E solid;
    padding: 0.5em;
    border-radius: 2em;
}
#timeSelector {
    color:#9E9E9E;
    border: 1px #9E9E9E solid;
    padding: 5% 5%;
    border-radius: 2em;
}
.search {
    border: 1px #9E9E9E solid;
    padding: 0.6em 1em;
    border-radius: 2em;
    width: 11em;
}
#dateSelector {
    padding: 5px 5px;color:#9E9E9E;
}
.searchButton {
  padding: 1% 2%;
  background-color: #041461;
  color: white;
  border: none;
  border-radius: 2em;
  cursor: pointer;
  margin-right: 1em;
}
@media (min-width: 100px) and (max-width: 500px) {
    .grid {
        display: grid;
        width: 100%;
        max-width: 1200px;
        margin: 2em auto;
        grid-template-columns: 1fr;
        grid-auto-rows: 410px;
    }
}
@media (min-width: 500px) and (max-width: 900px) {
    .grid {
        display: grid;
        width: 100%;
        max-width: 1200px;
        margin: 2em auto;
        grid-template-columns: calc(100% / 2) calc(100% / 2);
        grid-auto-rows: 410px;
    }
}
@media (min-width: 700px) {
    .grid {
        display: grid;
        width: 100%;
        max-width: 1200px;
        margin: 2em auto;
        grid-template-columns: calc(100% / 3) calc(100% / 3) calc(100% / 3);
        grid-auto-rows: 410px;
    }
}
.mapBtn {
    display: inline;
    border: 1px #041461 solid;
    color: #041461;
    padding: 0.5em 1em;
    border-radius: 1em;
    cursor: pointer;
    margin-right: 1em;
}
.mapBtn:hover {
    border: 1px #041461 solid;
    color: white;
    background-color: #041461;
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
.img {
    width:100%;
    height:100%;
    object-fit:cover;
    border-radius: 1em;
    cursor: pointer;
    box-shadow: 0 0 5px 0 gray;
}
.img:hover {
    width: 90%;
    height: 90%;
    margin: 5%;
}
#loading {
    position: fixed;
    top: calc(50% - 25px);
    left: calc(50% - 25px);
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255,255,255,.3);
    border-radius: 50%;
    border-top-color: black;
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
    z-index: 1000;
}
@keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
@-webkit-keyframes spin {
  to { -webkit-transform: rotate(360deg); }
}
a {
    color: black;
}
</style>