<template>
    <div style="display:flex">
        <MenuBar />
        <div class="content">
            <div style="width: 50%; height:100vh">
                <div style="width: 90%;height:2em;margin: 0 auto;padding-top:1em;font-size:2em;font-weight: bold;">
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
            <div style="width: 50%; height:100vh">
                <div style="width: 90%;height:4em;margin: 0 auto;padding-top:1em;font-size:2em;font-weight: bold;">
                    등록
                    <div style="display:block;margin-top: 1em;">
                        <input type="text" @input="changeKeyword" />
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
                            <td style="font-size: 2em;cursor: pointer;color:red;" @click="approve(candidate.memberId)">✓</td>
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
export default {
    components: {
        MenuBar,
    },
    setup() {
        const masters = ref([]);
        const candidates = ref([]);

        const getMasters = async () => {
            await axios.get(`/master/list`, {
                headers: {
                    Authorization: localStorage.getItem('access_token'),
                }
            }).then((res) => {
                masters.value = res.data;
            })
        }

        getMasters();

        const approve = async (id) => {
            if(confirm('멤버 회원을 마스터 회원으로 변경하시겠습니까?')) {
                try {
                    await axios.put(`/master/approve/${id}`, {
                        headers: {
                            Authorization: localStorage.getItem('access_token'),
                        }
                    })
                    alert('변경되었습니다');
                    window.location.reload();
                } catch (error) {
                    alert('변경에 실패하였습니다');
                }
            }
        }

        const disapprove = async (id) => {
            if(confirm('마스터 회원을 멤버 회원으로 변경하시겠습니까?')) {
                try {
                    await axios.put(`/master/disapprove/${id}`, {
                        headers: {
                            Authorization: localStorage.getItem('access_token'),
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
            await axios.get(`/master/member/list?searchWord=${e.target.value}`, {
                headers: {
                    Authorization: localStorage.getItem('access_token'),
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
.content {
    width: 85%;
    height:100vh;
    overflow:scroll;
    overflow-x: hidden;
    overflow-y: auto;
    display:flex;
}
.scrolltable {
    width: 100%;
    max-height: 80%;
    display:block;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto;
}
.table1 {
    width: 90%;
    height: 80%;
    margin: 3em auto;
    overflow: auto;
    font-weight: bold;
    border-collapse: collapse;
}
.table2 {
    width: 90%;
    height: 80%;
    margin: auto;
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
input {
    width: 70%;
    padding: 0.5em 1em;
    outline:none;
    border:none;
    background-color: #F1EEEE;
    color: #838383;
    font-weight: bold;
    font-size: 0.7em;
    border-radius: 1em;
}
</style>