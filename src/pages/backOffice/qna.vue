<template>
    <div style="display:flex">
        <MenuBar />
        <div class="content">
            <div class="scrolltable">
                <table>
                    <thead>
                        <th>회원번호</th>
                        <th>닉네임</th>
                        <th>문의 날짜</th>
                        <th>답변 유무</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr v-for="(qna, index) in qnas" :key="index">
                            <td>{{qna.memberId}}</td>
                            <td>{{qna.memberName}}</td>
                            <td>{{qna.inquiryTime}}</td>
                            <td v-if="qna.isAnswer">답변완료</td>
                            <td v-else>미 답변</td>
                            <td><button class="btn" @click="openQnaModal(index)">내용 보기</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <QnaModal :qna="qna" v-if="showQnaModal" @close="closeQnaModal" />
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from '@/axios';
import MenuBar from './menuBar.vue';
import QnaModal from '@/components/QnaModal.vue';
export default {
    components: {
        MenuBar,
        QnaModal,
    },
    setup() {
        const showQnaModal = ref(false);
        const qnas = ref([]);
        const qna = ref({});

        const getQnas = async () => {
            const companyId = localStorage.getItem('company_id');
            await axios.get(`/back-office/inquiry/total/${companyId}`, {
                headers: {
                    Authorization: localStorage.getItem('access_token')
                }
            })
                .then(
                    (res) => {
                        console.log(res.data);
                        qnas.value = res.data;
                        qnas.value.forEach(function(qna) {
                            qna.isAnswer = JSON.parse(qna.isAnswer);
                        });
                    })
        }

        getQnas();

        const openQnaModal = (index) => {
            showQnaModal.value = true;
            qna.value = qnas.value[index];
        }

        const closeQnaModal = () => {
            showQnaModal.value = false;
        }


        return {
            showQnaModal,
            qnas,
            openQnaModal,
            closeQnaModal,
            getQnas,
            qna,
        }
    }
}
</script>

<style scoped>
.content {
    width: 85%;
    height:100vh;
}
.scrolltable {
    width: 100%;
    max-height: 80%;
    display:block;
}
.content {
    width: 85%;
    height:100vh;
}
table {
    width: 80%;
    height: 80%;
    margin: 3em auto;
    overflow: auto;
    font-weight: bold;
    border-collapse: collapse;
}
thead {
    height: 5%;
    min-height: 20px;
    border-bottom: 2px #A69A9A solid;
}
th {
    padding: 0.5em 0;
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
.btn {
    padding: 0.5em 1em;
    border: none;
    background-color: #041461;
    color: white;
    cursor: pointer;
    border-radius: 0.5em;
}
.btn:hover {
    background-color: skyblue;
}
</style>