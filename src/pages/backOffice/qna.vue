<template>
    <div style="display:flex">
        <MenuBar />
        <div class="content">
            <div class="scrolltable">
                <table>
                    <thead>
                        <th>회원번호</th>
                        <th>닉네임</th>
                        <th>Space</th>
                        <th>문의 날짜</th>
                        <th>답변 유무</th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr v-for="num in 15" :key="num">
                            <td>112</td>
                            <td>최슈</td>
                            <td>오피스 moon 실</td>
                            <td>2022-11-12 13:34</td>
                            <td>완료</td>
                            <td><button class="btn">내용 보기</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <QnaModal />
    </div>
</template>

<script>
import MenuBar from './menuBar.vue';
import QnaModal from '@/components/QnaModal.vue';
export default {
    components: {
        MenuBar,
        QnaModal,
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