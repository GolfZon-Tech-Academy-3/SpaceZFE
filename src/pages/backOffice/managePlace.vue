<template>
    <div style="display:flex;flex-direction: column;">
        <MenuBar />
        <div class="content">
            <div class="scrolltable">
                <table>
                    <thead>
                        <th>타입</th>
                        <th>이름</th>
                        <th>오픈/마감시간</th>
                        <th>청소 시작/종료 시간</th>
                        <th>수정</th>
                    </thead>
                    <tbody>
                        <tr v-for="space in spaces" :key="space.spaceId">
                            <td>{{space.type}}</td>
                            <td>{{space.spaceName}}</td>
                            <td>{{space.openTime}} / {{space.closeTime}}</td>
                            <td>{{space.breakOpen}} / {{space.breakClose}}</td>
                            <td><button class="edit" @click="openModify(space)">수정</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style="width: 70%;height: 20%;margin: 0 auto;">
                <button class="submit" @click="openRegister">등록하기</button>
            </div> 
        </div>

        <SpaceRegisterModal v-if="showRegisterSpace" @close="closeRegister" />
        <SpaceModifyModal v-if="showModifySpace" @close="closeModify" :space="space" />
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from '@/axios';
import MenuBar from './menuBar.vue';
import SpaceRegisterModal from '@/components/SpaceRegisterModal.vue';
import SpaceModifyModal from '@/components/SpaceModifyModal.vue';
import { useStore } from 'vuex';
export default {
    components: {
        MenuBar,
        SpaceRegisterModal,
        SpaceModifyModal,
    },
    setup() {
        const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
        const store = useStore();
        const showRegisterSpace = ref(false);
        const showModifySpace = ref(false);
        const spaces = ref([]);
        var space = ref({});

        //공간 정보 얻기
        const getSpaces = async () => {
            const companyId = store.state.companyId;
            await axios.get(`${proxy}/space/list/${companyId}`, {
                headers: {
                    Authorization: store.state.accessToken
                }
            })
                .then(
                    (res) => {
                        spaces.value = res.data;
                        console.log(res.data);
                    })
        }

        getSpaces();

        //등록 창 열기
        const openRegister = () => {
            showRegisterSpace.value = true;
        }

        //등록 창 닫기
        const closeRegister = () => {
            showRegisterSpace.value = false;
        }

        //수정 창 닫기
        const closeModify = () => {
            showModifySpace.value = false;
        }

        //수정 창 열기
        const openModify = (info) => {
            showModifySpace.value = true;
            space.value = info;
        }

        return {
            showRegisterSpace,
            showModifySpace,
            openRegister,
            openModify,
            closeRegister,
            closeModify,
            spaces,
            space,
        }
    }
}
</script>

<style scoped>
.scrolltable {
    width: 80%;
    max-height: 75%;
    display:block;
    overflow-x: auto;
    overflow-y: auto;
    margin: 3em auto;
}
.content {
    width: 100%;
    height: calc(100vh - 3.75em);
}
table {
    width: 100%;
    height: 80%;
    overflow: auto;
    font-weight: bold;
    border-collapse: collapse;
    white-space: nowrap;
}
thead {
    height: 5%;
    min-height: 20px;
    margin: 0.5em;
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
.edit {
    padding: 0.5em 1em;
    border: none;
    background-color: #041461;
    color: white;
    cursor: pointer;
    border-radius: 0.5em;
}
.submit {
    float:right;
    padding: 0.5em 1em;
    border: none;
    background-color: #5AA8D9;
    color: white;
    cursor: pointer;
    border-radius: 0.5em;
}
</style>