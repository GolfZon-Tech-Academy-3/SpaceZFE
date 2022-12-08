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
        <SpaceModifyModal v-if="showModifySpace" @close="closeModifier" :space="space" />
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from '@/axios';
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
        const spaces = ref([]);
        var space = ref({});

        const getSpaces = async () => {
            const companyId = localStorage.getItem('company_id');
            await axios.get(`/space/list/${companyId}`, {
                headers: {
                    Authorization: localStorage.getItem('access_token')
                }
            })
                .then(
                    (res) => {
                        spaces.value = res.data;
                        console.log(res.data);
                    })
        }

        getSpaces();

        const openRegister = () => {
            showRegisterSpace.value = true;
        }

        const closeRegister = () => {
            showRegisterSpace.value = false;
        }

        const closeModifier = () => {
            showModifySpace.value = false;
        }

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
            closeModifier,
            spaces,
            space,
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
    margin: 2em 0;
    padding: 0.5em 1em;
    border: none;
    background-color: #5AA8D9;
    color: white;
    cursor: pointer;
    border-radius: 0.5em;
}
</style>