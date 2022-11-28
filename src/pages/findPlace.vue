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
            <div :class="[ searchType === 'all' ? 'yes' : 'no']" style="margin-left: 1em;" @click="selectAll(1)">
                전체
            </div>
            <div :class="[ searchType === 'office' ? 'yes' : 'no']" @click="selectOffice(1)">
                오피스
            </div>
            <div :class="[ searchType === 'desk' ? 'yes' : 'no']" @click="selectDesk(1)">
                데스크
            </div>
            <div :class="[ searchType === 'meeting' ? 'yes' : 'no']" @click="selectMeeting(1)">
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
                    <option v-for="val in 23" :key="val">{{val}} 시</option>
                </select>
            </span>
            <span style="display:inline-block;width: 23%; height: 100%;margin-left:0%;">
                <input class="search" type="text" placeholder="지역 검색" @change="changeWord($event)" @keyup.enter="searchWithCondition" :value="searchWord">
            </span>
            <span style="width: 30%; height: 100%;">
                <button class="searchButton" @click="searchWithCondition">적용</button>
            </span>
        </div>

        <div v-if="noResult" style="margin:3% auto; width : 100%;text-align:center;font-size:2em;">
            검색결과 없음
        </div>
        <div v-else :class="{'grid1': isOne, 'grid2':isTwo, 'grid3':isThree}">
            <div v-for="num in resultCurrentNum" :key="num" style="border:1px black solid">
                {{num}}
            </div>
        </div>

        <div class="pagination">
            <div class="previous"></div>
            <div v-for="page in pageNum" :key="page" :class="{'curPage' : (page === currentPage), 'notCurPage' : (page !== currentPage)}"
                @click="search(page)">
                {{page}}
            </div>  
            <div class="next"></div>
        </div>
    </div>
</template>

<script>
import { ref, computed  } from 'vue';
import { useStore } from 'vuex';
export default {
    setup() {
        const store = useStore();
        const searchType = computed(() => store.state.searchType);
        const searchDate = computed(() => store.state.searchDate);
        const searchTime = computed(() => store.state.searchTime);
        const searchWord = computed(() => store.state.searchWord);
        const resultCurrentNum = ref(5);
        const isOne = ref(false);
        const isTwo = ref(false);
        const isThree = ref(false);
        const noResult = ref(false);
        const resultAllNum = ref(19);
        const pageNum = Math.ceil((resultAllNum.value) / 9);
        const currentPage = computed(() => store.state.currentPage);

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

        const changeDate = (event) => {
            store.dispatch('updateDate', event.target.value);
        }
        
        const changeTime = (event) => {
            store.dispatch('updateTime', event.target.value);
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
            store.dispatch('updateType', 'all');
            search(1);
        }

        const selectOffice = () => {
            store.dispatch('updateType', 'office');
            search(1);
        }

        const selectDesk = () => {
            store.dispatch('updateType', 'desk');
            search(1);
        }

        const selectMeeting = () => {
            store.dispatch('updateType', 'meeting');
            search(1);
        }

        const searchWithCondition = () => {
            if(searchDate.value === '' && searchTime.value === '') {
                console.log('hello');
            } else if(searchDate.value !== '' && searchTime.value !== '') {
                console.log('hello');
            } else {
                alert('날짜와 시간을 모두 선택해주세요');
            }
            console.log(searchWord.value);
            search(1);
        }

        const search = (page) => {
            store.dispatch('updatePage', page);
            if(searchTime.value !== '') {
                if(searchTime.value.length == 3) {
                    console.log(searchTime.value[0] + ':00');
                } else {
                    console.log(searchTime.value[0] + searchTime.value[1] + ':00');
                }
            }
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
  padding: 1% 3%;
  background-color: #041461;
  color: white;
  border: none;
  border-radius: 2em;
  cursor: pointer;
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
}
.grid2 {
    display: grid;
    width: 80%;
    height: 100vh;
    margin: 3% auto;
    grid-template-columns: 1fr 1fr 1fr;
}
.grid3 {
    display: grid;
    width: 80%;
    height: 150vh;
    margin: 3% auto;
    grid-template-columns: 1fr 1fr 1fr;
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
</style>