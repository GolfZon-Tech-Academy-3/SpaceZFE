<template>
    <div>
        <div class="title">
            <div style="font-weight:bold;color:#F65F09;font-size: 1em;padding-top:3%;">
                Find Places
            </div>
            <div style="font-size:2em;font-weight: bold;">
                찾아 보기
            </div>
        </div>
        
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
        </div>

        <div class="conditionSelection">
            <span style="display:inline-block;width: 15%; height: 100%;">
                <div style="color: #9E9E9E; font-size: 1em;">날짜</div>
                <input id="dateSelector" type="date" @change="changeDate($event)" :value="searchDate" :min="today" />
            </span>
            <span style="display:inline-block;width: 13%; height: 100%;margin-left:1%;">
                <div style="color: #9E9E9E; font-size: 1em;">시간</div>
                <select id="timeSelector" @change="changeTime($event)" :value="searchTime">
                    <option value="null" selected>선택안함</option>
                    <option v-for="val in 23" :key="val">{{val}} 시</option>
                </select>
            </span>
            <span style="display:inline-block;width: 20%; height: 100%;margin-left:0%;">
                <input class="search" type="text" placeholder="지역 검색" @change="changeWord($event)" @keyup.enter="searchWithCondition" :value="searchWord">
            </span>
            <span style="width: 30%; height: 100%;">
                <button class="searchButton" @click="resetCondition">초기화</button>
            </span>
            <span style="width: 30%; height: 100%;">
                <button class="searchButton" @click="searchWithCondition">적용</button>
            </span>
        </div>

        <div v-if="noResult" style="margin:3% auto; width : 100%;text-align:center;font-size:2em;">
            검색결과 없음
        </div>
        <div v-else :class="{'grid1': isOne, 'grid2':isTwo, 'grid3':isThree}">
            <div v-for="place in resultPlace" :key="place.companyId">
                <div style="height: 50%;padding: 1em 1em 0 1em;">
                    <img :src="place.firstImage" style="width:100%;height:100%;object-fit:fill;border-radius: 1em;cursor: pointer;" @click="moveToPlaceDetail(place.companyId)"/>
                </div>
                <div style="height: 10%;padding: 0 2em;margin-top:1em;color:#9E9E9E">
                    <span>{{place.location}}</span>
                    <span v-for="type in place.types" :key="type"> · {{type}}</span>
                    <img class="favorite_red" @click="addFavorite(place.companyId)" v-if="place.companyLike" src="../assets/heart_red.png" />
                    <img class="favorite" @click="addFavorite(place.companyId)" v-else src="../assets/heart.png" />
                </div>
                <div style="height: 15%; padding: 0 1em;font-size: 2em; cursor:pointer;" @click="moveToPlaceDetail(place.companyId)">
                    {{place.companyName}}
                </div>
                <div style="width:80%; height:7%; margin:0 auto;">
                    <span>{{place.lowPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}} 원 </span>
                    <span style="color:#F6CA4E;">★</span>
                    <span>{{place.avgReview}}</span>
                    <span style="color: #9E9E9E;margin-left:1em;">리뷰 {{place.reviewSize}}</span>
                </div>
            </div>
        </div>

        <div v-if="!noResult" class="pagination">
            <div v-if="currentPage != 1" class="nav-btn" @click="decreasePage">이전</div>
            <div v-for="page in pageNum" :key="page" :class="{'curPage' : (page === currentPage), 'notCurPage' : (page !== currentPage)}"
                @click="updatePage(page)">
                {{page}}
            </div>  
            <div v-if="currentPage != pageNum" class="nav-btn" @click="increasePage">다음</div>
        </div>
    </div>
</template>

<script>
import { ref, computed  } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from '@/axios';
export default {
    setup() {
        const router = useRouter();
        const store = useStore();
        const searchType = computed(() => store.state.searchType);
        const searchDate = computed(() => store.state.searchDate);
        const searchTime = computed(() => store.state.searchTime);
        const searchWord = computed(() => store.state.searchWord);
        const resultCurrentNum = ref(0);
        const resultPlace = ref([]);
        const isOne = ref(false);
        const isTwo = ref(false);
        const isThree = ref(false);
        const noResult = ref(false);
        const resultAllNum = ref(0);
        const pageNum = ref(0);
        const currentPage = computed(() => store.state.currentPage);

        const search = async () => {
            if(searchTime.value != null) { //검색 시간이 존재할때
                if(searchTime.value.length === 3) {
                    await axios.post(`company/${searchType.value}?page=${currentPage.value}`,
                    {
                        date: searchDate.value,
                        time: searchTime.value[0] + ':00',
                        location: searchWord.value,
                    },
                    {
                        headers: {
                            Authorization: localStorage.getItem('access_token')
                        }
                    })
                        .then((res) => {
                            resultAllNum.value = res.data.totalSize;
                            pageNum.value = res.data.totalPage;
                            resultCurrentNum.value = res.data.company.length;
                            if(resultCurrentNum.value === 0) {
                                noResult.value = true;
                            }
                            if((resultCurrentNum.value - 1) / 3 < 1) {
                                isOne.value = true;
                            } else if((resultCurrentNum.value - 1) / 3 < 2) {
                                isTwo.value = true;
                            } else {
                                isThree.value = true;
                            }
                        })
                } else {
                    await axios.post(`company/${searchType.value}?page=${currentPage.value}`,
                        {
                            date: searchDate.value,
                            time: searchTime.value[0] + searchTime.value[1] + ':00',
                            location: searchWord.value,
                        },
                        {
                            headers: {
                                Authorization: localStorage.getItem('access_token')
                            }
                        })
                            .then((res) => {
                                resultAllNum.value = res.data.totalSize;
                                pageNum.value = res.data.totalPage;
                                resultCurrentNum.value = res.data.company.length;
                                if(resultCurrentNum.value === 0) {
                                    noResult.value = true;
                                }
                                if((resultCurrentNum.value - 1) / 3 < 1) {
                                    isOne.value = true;
                                } else if((resultCurrentNum.value - 1) / 3 < 2) {
                                    isTwo.value = true;
                                } else {
                                    isThree.value = true;
                                }
                            })
                }
            } else { //검색 시간이 존재하지 않을 때
                await axios.post(`company/${searchType.value}?page=${currentPage.value}`,
                    {
                        date: searchDate.value,
                        time: searchTime.value,
                        location: searchWord.value,
                    },
                    {
                        headers: {
                            Authorization: localStorage.getItem('access_token')
                        }
                    })
                        .then((res) => {
                            resultAllNum.value = res.data.totalSize;
                            pageNum.value = res.data.totalPage;
                            resultCurrentNum.value = res.data.company.length;
                            resultPlace.value = res.data.company;
                            if(resultCurrentNum.value === 0) {
                                noResult.value = true;
                            }
                            if((resultCurrentNum.value - 1) / 3 < 1) {
                                isOne.value = true;
                            } else if((resultCurrentNum.value - 1) / 3 < 2) {
                                isTwo.value = true;
                            } else {
                                isThree.value = true;
                            }
                        })
            }
        }

        search();

        const changeDate = (event) => {
            if(event.target.value === '') {
                store.dispatch('updateDate', null);
            } else {
                store.dispatch('updateDate', event.target.value);
            }
        }
        
        const changeTime = (event) => {
            if(event.target.value === 'null') {
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
            store.dispatch('updatePage', 1);
            search();
        }

        const selectOffice = () => {
            store.dispatch('updateType', 'office');
            store.dispatch('updatePage', 1);
            window.location.reload();
        }

        const selectDesk = () => {
            store.dispatch('updateType', 'desk');
            store.dispatch('updatePage', 1);
            window.location.reload();
        }

        const selectMeeting = () => {
            store.dispatch('updateType', 'meeting-room');
            store.dispatch('updatePage', 1);
            window.location.reload();
        }

        const searchWithCondition = () => {
            if(searchDate.value == null && searchTime.value != null) {
                alert('날짜와 시간을 모두 선택해주세요');
                return;
            }
            store.dispatch('updatePage', 1);
            window.location.reload();
        }

        const updatePage = (page) => {
            store.dispatch('updatePage', page);
            window.location.reload();
        }

        const increasePage = () => {
            store.dispatch('updatePage', currentPage.value + 1);
            window.location.reload();
        }

        const decreasePage = () => {
            store.dispatch('updatePage', currentPage.value - 1);
            window.location.reload();
        }

        const resetCondition = () => {
            store.dispatch('updateDate', null);
            store.dispatch('updateTime', null);
        }

        const addFavorite = async (companyId) => {
            await axios.post(`company/like/${companyId}`, {
                headers: {
                    Authorization: localStorage.getItem('access_token')
                }
            })
                .then(() => {
                    window.location.reload();
                })
        }

        const moveToPlaceDetail = (companyId) => {
            router.push({
                name: 'PlaceDetail',
                query:{
                    id: companyId,
                }
            })
        }

        return {
            selectAll,
            selectOffice,
            selectDesk,
            selectMeeting,
            resultCurrentNum,
            noResult,
            isOne,
            isTwo,
            isThree,
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
            updatePage,
            increasePage,
            decreasePage,
            resetCondition,
            resultPlace,
            addFavorite,
            moveToPlaceDetail,
        }
    }
}
</script>

<style scoped>
.title {
    width: 100%;
    height: 20vh;
    text-align: center;
}
.typeSelection {
    width: 80%;
    height: 5vh;
    margin: 0 auto;
    border-bottom:1px #EDEDED solid;
    align-items: center;
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
.conditionSelection {
    position: relative;
    width: 80%;
    height: 7vh;
    margin: 0 auto;
    padding-top: 2%;
}
#dateSelector {
    color:#9E9E9E;
    border: 1px #9E9E9E solid;
    padding: 0.7% 0.7%;
    border-radius: 2em;
    font-family: Inter;
}
#dateSelector:focus {
    outline: none;
}
#timeSelector {
    color:#9E9E9E;
    border: 1px #9E9E9E solid;
    padding: 5% 5%;
    border-radius: 2em;
}
#timeSelector:focus {
    outline: none;
}
.search {
    border: 1px #9E9E9E solid;
    padding: 3% 5%;
    border-radius: 2em;
}
.search:focus {
    outline : none;
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
.searchButton:hover {
    background-color: skyblue;
}
.grid1 {
    display: grid;
    width: 80%;
    height: 50vh;
    margin: 3% auto;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 50vh;
}
.grid2 {
    display: grid;
    width: 80%;
    height: 100vh;
    margin: 3% auto;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 50vh;
}
.grid3 {
    display: grid;
    width: 80%;
    height: 150vh;
    margin: 3% auto;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 50vh;
}
.pagination {
    width: 100%;
    height: 3em;
    display : flex;
    justify-content: center;
    align-items : center;
    text-align: center;
    margin: 5% 0;
}
.curPage {
    width: 5vh;
    height:5vh;
    position: relative;
    color: white;
    font-weight:bolder;
    background-color: #041461;
    cursor: pointer;
    display : flex;
    justify-content: center;
    align-items : center;
    border-radius: 50%;
    margin: 0 1%;
}
.notCurPage {
    width: 5vh;
    height:5vh;
    position: relative;
    color: white;
    font-weight:bolder;
    background-color: skyblue;
    cursor: pointer;
    display : flex;
    justify-content: center;
    align-items : center;
    border-radius: 50%;
    margin: 0 1%;
}
.notCurPage:hover {
    background-color: blue;
}
.nav-btn {
    background-color: #041461;
    color:white;
    padding: 0.7em;
    border-radius: 1em;
    cursor: pointer;
}
.nav-btn:hover {
    background-color: skyblue;
}
.favorite {
    float:right;
    cursor:pointer;
    width: 9%;
    margin: 2% 2% 0 0;
}
.favorite_red {
    float:right;
    cursor:pointer;
    width: 12%;
}
</style>