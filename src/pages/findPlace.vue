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
            <div :class="[ isAll ? 'yes' : 'no']" style="margin-left: 1em;" @click="selectAll">
                전체
            </div>
            <div :class="[ isOffice ? 'yes' : 'no']" @click="selectOffice">
                오피스
            </div>
            <div :class="[ isDesk ? 'yes' : 'no']" @click="selectDesk">
                데스크
            </div>
            <div :class="[ isMeeting ? 'yes' : 'no']" @click="selectMeeting">
                회의실
            </div>
        </div>

        <div class="conditionSelection">
            <span style="display:inline-block;width: 15%; height: 100%;">
                <div style="color: #9E9E9E; font-size: 1em;">날짜</div>
                <input id="dateSelector" type="date" v-model="date" :min="today" />
            </span>
            <span style="display:inline-block;width: 13%; height: 100%;margin-left:1%;">
                <div style="color: #9E9E9E; font-size: 1em;">시간</div>
                <select :disabled="isDisabled" id="timeSelector" v-model="selectedTime">
                    <option v-for="val in 23">{{val}} 시</option>
                </select>
            </span>
            <span style="display:inline-block;width: 23%; height: 100%;margin-left:0%;">
                <input class="search" type="text" placeholder="지역 검색">
            </span>
            <span style="width: 30%; height: 100%;">
                <button class="searchButton">적용</button>
            </span>
        </div>

        <div v-if="noResult" style="margin:3% auto; width : 100%;text-align:center;font-size:2em;">
            검색결과 없음
        </div>
        <div v-else :class="{'grid1': isOne, 'grid2':isTwo, 'grid3':isThree}">
            <div v-for="num in resultNum" style="border:1px black solid">
                {{num}}
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch  } from 'vue';
export default {
    setup() {
        const isAll = ref(true);
        const isOffice = ref(false);
        const isDesk = ref(false);
        const isMeeting = ref(false);
        const date = ref(null);
        const selectedTime = ref('');
        const isDisabled = ref(true);
        const resultNum = ref(8);
        const isOne = ref(false);
        const isTwo = ref(false);
        const isThree = ref(false);
        const noResult = ref(false);

        if(resultNum.value === 0) {
            noResult.value = true;
        }

        if((resultNum.value - 1) / 3 < 1) {
            isOne.value = true;
        } else if((resultNum.value - 1) / 3 < 2) {
            isTwo.value = true;
        } else {
            isThree.value = true;
        }

        if(date.value == null) {
            isDisabled.value = true;
        } else {
            isDisabled.value = false;
        }

        watch(date, () => {
            isDisabled.value = false;
        })
        
        watch(selectedTime, () => {
            if(selectedTime.value.length == 3) {
                console.log(selectedTime.value[0]);
            } else {
                console.log(selectedTime.value[0] + selectedTime.value[1]);
            }
        })

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
            isAll.value = true;
            isOffice.value = false;
            isDesk.value = false;
            isMeeting.value = false;
        }

        const selectOffice = () => {
            isAll.value = false;
            isOffice.value = true;
            isDesk.value = false;
            isMeeting.value = false;
        }

        const selectDesk = () => {
            isAll.value = false;
            isOffice.value = false;
            isDesk.value = true;
            isMeeting.value = false;
        }

        const selectMeeting = () => {
            isAll.value = false;
            isOffice.value = false;
            isDesk.value = false;
            isMeeting.value = true;
        }

        return {
            isAll,
            isOffice,
            isDesk,
            isMeeting,
            selectAll,
            selectOffice,
            selectDesk,
            selectMeeting,
            today,
            selectedTime,
            date,
            isDisabled,
            resultNum,
            noResult,
            isOne,
            isTwo,
            isThree,
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
    background-color: aqua;
    margin: 3% auto;
    grid-template-columns: 1fr 1fr 1fr;
}
.grid2 {
    display: grid;
    width: 80%;
    height: 100vh;
    background-color: aqua;
    margin: 3% auto;
    grid-template-columns: 1fr 1fr 1fr;
}
.grid3 {
    display: grid;
    width: 80%;
    height: 150vh;
    background-color: aqua;
    margin: 3% auto;
    grid-template-columns: 1fr 1fr 1fr;
}
</style>