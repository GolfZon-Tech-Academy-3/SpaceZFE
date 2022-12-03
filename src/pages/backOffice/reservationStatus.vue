<template>
    <div style="display:flex">
        <MenuBar />
        <div class="content">
            <div class="condition">
                날짜
                <input class="date" type="date" />
                ~
                <input class="date" type="date" />
                <button class="search">검색</button>
            </div>

            <div class="result">
                <table>
                    <thead>
                        <th>예약번호</th>
                        <th>타입</th>
                        <th>이름</th>
                        <th>예약 날짜</th>
                        <th>예약자 명</th>
                        <th>예약 상태 처리</th>
                    </thead>
                    <tbody>
                        <tr v-for="resv in reservations" :key="resv.reservationId">
                            <td>{{resv.reservationId}}</td>
                            <td>{{resv.type}}</td>
                            <td>{{resv.spaceName}}</td>
                            <td>{{resv.startDate}} ~ {{resv.endDate}}</td>
                            <td>{{resv.reservationName}}</td>
                            <td v-if="resv.status === '001'" style="color: #383ED8;">예약 중<br/>
                                <button class="button" @click="cancelResv(resv.type, resv.reservationId)">취소</button>
                                <button class="button">완료 처리</button>
                            </td>
                            <td v-if="resv.status === '002'" style="color: #383ED8;">예약 취소</td>
                            <td v-if="resv.status === '004'" style="color: #383ED8;">이용 완료</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import MenuBar from './menuBar.vue';
import axios from '@/axios';
export default {
    components: {
        MenuBar,
    },
    setup() {
        const reservations = ref([]);

        const getResvs = async () => {
            await axios.get(`/back-office/reservation/total/${localStorage.getItem('company_id')}`, {
                headers: {
                    Authorization: localStorage.getItem('access_token'),
                }
            })
                .then((res) => {
                    console.log(res.data);
                    reservations.value = res.data;
                })
        }

        getResvs();

        const cancelResv = async (type, id) => {
            if(type === '오피스') {
                if(confirm("예약을 취소하시겠습니까?")) {
                    await axios.put(`/reservation/office-cancel/${id}`, {
                        headers: {
                            Authorization: localStorage.getItem('access_token'),
                        }
                    })
                        .then(() => {
                            window.location.reload();
                        })
                }
            } else {
                if(confirm("예약을 취소하시겠습니까?")) {
                    await axios.put(`/reservation/desk-cancel/${id}`, {
                        headers: {
                            Authorization: localStorage.getItem('access_token'),
                        }
                    })
                        .then(() => {
                            window.location.reload();
                        })
                }
            }
        }

        return {
            reservations,
            cancelResv,
        }
    }
}
</script>

<style scoped>
.content {
    width: 85%;
    height:100vh;
    overflow:scroll;
    overflow-x: hidden;
    overflow-y: auto;
    text-align: center;
}
.condition {
    width : 60%;
    height: 4%;
    margin: 1em auto;
}
.date {
    color:#9E9E9E;
    border: 1px #9E9E9E solid;
    padding: 0.7% 0.7%;
    border-radius: 2em;
    font-family: Inter;
    margin-left: 1em;
    margin-right: 1em;
}
.date:focus {
    outline: none;
}
.search {
    padding: 1% 3%;
    background-color: #041461;
    color: white;
    border: none;
    border-radius: 2em;
    cursor: pointer;
}
.search:hover {
    background-color: skyblue;
}
.button {
    padding: 1% 3%;
    background-color: #041461;
    color: white;
    border: none;
    border-radius: 2em;
    cursor: pointer;
}
.button:hover {
    background-color: skyblue;
}
.result {
    width: 100%;
    max-height: 90%;
    display:block;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto;
}
table {
    width: 80%;
    height: 80%;
    margin: 0 auto 3em auto;
    overflow: auto;
    font-weight: bold;
    border-collapse: collapse;
}
thead {
    height: 5%;
    min-height: 20px;
}
th {
    padding: 0.5em 0;
    border-bottom: 2px #A69A9A solid;
}
tr {
    height: 4em;
    border-bottom: 1px #A69A9A solid;
}
td {
    text-align: center;
    padding: 0.5em 0;
}
tbody {
    height: 95%;
}
</style>