<template>
    <div style="display:flex;flex-direction: column;">
        <MenuBar />
        <div class="content">
            <div style="width: 100%; height:100%">
                <div style="width: 90%;height:2em;margin: 0em auto;font-size:2em;font-weight: bold;">
                    계정 관리
                </div>
                <div class="scrolltable">
                    <table class="table1">
                    <thead>
                        <th>사진</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>관리</th>
                    </thead>
                    <tbody>
                        <tr v-for="(master, index) in masters" :key="index">
                            <td><img :src="master.imgName" style="width:2.5em;" /></td>
                            <td>{{master.memberName}}</td>
                            <td>{{master.email}}</td>
                            <td style="font-size: 2em;cursor: pointer;color:red;" @click="disapprove(master.memberId)">&times;</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
            <div style="width: 100%; height:100%">
                <div style="width: 90%;height:4em;margin: 0 auto;padding-top:1em;font-size:2em;font-weight: bold;">
                    등록
                    <div style="display:block;margin-top: 0.5em;">
                        <input placeholder="검색" type="text" @input="changeKeyword" />
                    </div>
                </div>
                <div class="scrolltable">
                    <table class="table2">
                    <thead>
                        <th>사진</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>관리</th>
                    </thead>
                    <tbody>
                        <tr v-for="(candidate, index) in candidates" :key="index">
                            <td><img :src="candidate.imgName" style="width:2.5em;" /></td>
                            <td>{{candidate.memberName}}</td>
                            <td>{{candidate.email}}</td>
                            <td style="font-size: 2em;cursor: pointer;color: green;" @click="approve(candidate.memberId)">✓</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from '@/axios';
import MenuBar from './menuBar.vue';
import { useStore } from 'vuex';
export default {
    components: {
        MenuBar,
    },
    setup() {
        const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
        const store = useStore();
        const masters = ref([]);
        const candidates = ref([]);

        const getMasters = async () => {
            await axios.get(`${proxy}/master/list`, {
                headers: {
                    Authorization: store.state.accessToken,
                }
            }).then((res) => {
                masters.value = res.data;
            })
        }

        getMasters();

        const approve = async (id) => {
            if(confirm('멤버 회원을 마스터 회원으로 변경하시겠습니까?')) {
                try {
                    await axios.put(`${proxy}/master/approve/${id}`, null, {
                        headers: {
                            Authorization: store.state.accessToken,
                        }
                    })
                    alert('변경되었습니다');
                    window.location.reload();
                } catch (error) {
                    console.log(error);
                    alert('변경에 실패하였습니다');
                }
            }
        }

        const disapprove = async (id) => {
            if(confirm('마스터 회원을 멤버 회원으로 변경하시겠습니까?')) {
                try {
                    await axios.put(`${proxy}/master/disapprove/${id}`, null, {
                        headers: {
                            Authorization: store.state.accessToken,
                        }
                    })
                    alert('변경되었습니다');
                    window.location.reload();
                } catch (error) {
                    alert('변경에 실패하였습니다');
                }
            }
        }

        const changeKeyword = async (e) => {
            await axios.get(`${proxy}/master/member/list?searchWord=${e.target.value}`, {
                headers: {
                    Authorization: store.state.accessToken,
                }
            }).then((res) => {
                console.log(res.data);
                candidates.value = res.data;
            })
        }

        return {
            masters,
            getMasters,
            approve,
            disapprove,
            changeKeyword,
            candidates,
        }
    }
}
</script>

<style scoped>
@media (min-width: 600px) {
    .content {
        width: 100%;
        height: calc(100vh - 3.75em);
        overflow-x: auto;
        overflow-y: auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        white-space: nowrap;
    }
}
@media (max-width: 600px) {
    .content {
        width: 100%;
        height: calc(100vh - 3.75em);
        overflow-x: auto;
        overflow-y: auto;
        display: grid;
        grid-template-columns: 1fr;
        white-space: nowrap;
    }
}
.scrolltable {
    width: 100%;
    max-height: 80%;
    display:block;
    overflow-x: auto;
    overflow-y: auto;
    white-space: nowrap;
}
.table1 {
    width: 90%;
    height: 80%;
    margin: 3em auto;
    font-weight: bold;
    border-collapse: collapse;
    white-space: nowrap;
}
.table2 {
    width: 90%;
    height: 80%;
    margin: auto;
    font-weight: bold;
    border-collapse: collapse;
    white-space: nowrap;
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
input {
    width: 70%;
    padding: 0.5em 1em;
    outline:none;
    border:none;
    background-color: #F1EEEE;
    box-shadow: 0 0 5px 0 gray;
    color: #838383;
    font-size: 0.5em;
    border-radius: 1em;
}
input:hover {
    background-color: rgb(190, 190, 190);
    box-shadow: 0 0 5px 0 gray;
}
</style>