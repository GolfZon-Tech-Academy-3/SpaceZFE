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
                        <th>예약 상태</th>
                    </thead>
                    <tbody>
                        <tr v-for="num in 20" :key="num">
                            <td>20221001</td>
                            <td>오피스</td>
                            <td>sun 실</td>
                            <td>2022-11-12 17:00 / 2022-11-13 17:00</td>
                            <td>손흥민</td>
                            <td style="color: #383ED8;">예약완료<br/><button class="cancel">취소</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import MenuBar from './menuBar.vue';
import axios from '@/axios';
export default {
    components: {
        MenuBar,
    },
    setup() {

        const getResvs = async () => {
            await axios.get(`../back-office/reservation/total/${localStorage.getItem('company_id')}`, {
                headers: {
                    Authorization: localStorage.getItem('access_token'),
                }
            })
                .then((res) => {
                    console.log(res.data);
                })
        }

        getResvs();
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
.cancel {
    padding: 1% 3%;
    background-color: #041461;
    color: white;
    border: none;
    border-radius: 2em;
    cursor: pointer;
}
.cancel:hover {
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
}
thead {
    height: 5%;
    min-height: 20px;
    background-color: #041461;
    color:white;
}
th {
    border-bottom: 1px solid #A69A9A;
    padding: 0.5em 0;
}
td {
    text-align: center;
    padding: 0.5em 0;
}
tbody {
    height: 95%;
}
</style>