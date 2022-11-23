<template>
    <div style="display:flex">
        <MenuBar />
        <div class="content">
            <div class="scrolltable">
                <table>
                    <thead>
                        <th>타입</th>
                        <th>이름</th>
                        <th>오픈/마감시간</th>
                        <th>금일 예약 수</th>
                        <th>수정</th>
                    </thead>
                    <tbody>
                        <tr v-for="num in 14" :key="num">
                            <td>오피스</td>
                            <td>정보</td>
                            <td>10:00/22:00</td>
                            <td>3</td>
                            <td><button class="edit" @click="openModify">수정</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style="width: 70%;height: 20%;margin: 0 auto;">
                <button class="submit" @click="openRegister">등록하기</button>
            </div>
            
        </div>

        <SpaceRegisterModal v-if="showRegisterSpace" @close="closeRegister" />
        <SpaceModifyModal v-if="showModifySpace" @close="closeModifier" :space="space" />
    </div>
</template>

<script>
import { ref } from 'vue';
import MenuBar from './menuBar.vue';
import SpaceRegisterModal from '@/components/SpaceRegisterModal.vue';
import SpaceModifyModal from '@/components/SpaceModifyModal.vue';
export default {
    components: {
        MenuBar,
        SpaceRegisterModal,
        SpaceModifyModal,
    },
    setup() {
        const showRegisterSpace = ref(false);
        const showModifySpace = ref(false);
        var space = ref({});

        const openRegister = () => {
            showRegisterSpace.value = true;
        }

        const closeRegister = () => {
            showRegisterSpace.value = false;
        }

        const closeModifier = () => {
            showModifySpace.value = false;
        }

        const openModify = () => {
            showModifySpace.value = true;
            space.value.spaceName = 'test';
        }

        return {
            showRegisterSpace,
            showModifySpace,
            space,
            openRegister,
            openModify,
            closeRegister,
            closeModifier,
        }
    }
}
</script>

<style scoped>
.scrolltable {
    width: 100%;
    max-height: 80%;
    display:block;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto;
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
.edit {
    padding: 0.5em 1em;
    border: none;
    background-color: #041461;
    color: white;
    cursor: pointer;
    border-radius: 0.5em;
}
.edit:hover {
    background-color: skyblue;
}
.submit {
    float:right;
    margin: 2em 0;
    padding: 0.5em 1em;
    border: none;
    background-color: #5AA8D9;
    color: white;
    cursor: pointer;
    border-radius: 0.5em;
}
.submit:hover {
    background-color: black;
}
</style>