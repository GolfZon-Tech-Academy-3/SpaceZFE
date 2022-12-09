<template>
    <div style="display:flex">
        <MenuBar />
        <div class="content">
            <div class="sorter">
                <div style="font-size: 2em; font-weight: bold;">업체관리</div>
                <button :class="[selected === 'all' ? 'sort-selected' : 'sort']" @click="selectAll">전체</button>
                <button :class="[selected === 'wait' ? 'sort-selected' : 'sort']" @click="selectWait">승인 대기</button>
                <button :class="[selected === 'completed' ? 'sort-selected' : 'sort']" @click="selectCompleted">승인 완료</button>
                <button :class="[selected === 'declined' ? 'sort-selected' : 'sort']" @click="selectDeclined">승인 거부</button>
            </div>
            <div class="scrolltable">
                <table>
                    <thead>
                        <th>사진</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>업체 명</th>
                        <th>업체 위치</th>
                        <th>상태</th>
                        <th>관리</th>
                    </thead>
                    <tbody>
                        <tr v-for="(res, index) in result" :key="index">
                            <td><img :src="res.profileImage" style="width:2.5em;" /></td>
                            <td>{{res.memberName}}</td>
                            <td>{{res.email}}</td>
                            <td>{{res.companyName}}</td>
                            <td>{{res.location}} {{res.details}}</td>
                            <td v-if="res.approveStatus === '000'">
                                <div class="wait">승인대기</div>
                            </td>
                            <td v-else-if="res.approveStatus === '001'">
                                <div class="completed">승인완료</div>
                            </td>
                            <td v-else>
                                <div class="declined">
                                    승인거부
                                </div>
                            </td>
                            <td v-if="res.approveStatus === '000'">
                                <div class="checkAct" @click="approve(res.companyId)">✓</div>
                                <div class="xAct" @click="decline(res.companyId)">&times;</div>
                            </td>
                            <td v-else-if="res.approveStatus === '001'">
                                <div class="checkDe">✓</div>
                                <div class="xAct" @click="decline(res.companyId)">&times;</div>
                            </td>
                            <td v-else>
                                <div class="checkAct" @click="approve(res.companyId)">✓</div>
                                <div class="xDe">&times;</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <Toast v-if="showToast" :message="toastMessage" />
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from '@/axios';
import MenuBar from './menuBar.vue';
import Toast from '@/components/Toast.vue'
import { useToast } from '@/composables/toast';
export default {
    components: {
        MenuBar,
        Toast,
    },
    setup() {
        const selected = ref('all');
        const result = ref([]);
        const {
            toastMessage, showToast, triggerToast,
        } = useToast();
        console.log(localStorage.getItem('authority'));

        const getCompanys = async (type) => {
            await axios.get(`/company/manager/list`, {
                headers: {
                    Authorizaion: localStorage.getItem('access_token'),
                }
            })
                .then((res) => {
                    if(type === 'all') {
                        result.value = res.data;
                        console.log(result.value);
                    } else if(type === 'wait') {
                        result.value.splice(0);
                        res.data.forEach(element => {
                            if(element.approveStatus === '000') {
                                result.value.push(element);
                            }
                        });
                    } else if(type === 'completed') {
                        result.value.splice(0);
                        res.data.forEach(element => {
                            if(element.approveStatus === '001') {
                                result.value.push(element);
                            }
                        });
                    } else {
                        result.value.splice(0);
                        res.data.forEach(element => {
                            if(element.approveStatus === '002') {
                                result.value.push(element);
                            }
                            console.log(result.value);
                        });
                    }
                })
        }

        getCompanys(selected.value);

        const selectAll = () => {
            selected.value = 'all';
            getCompanys('all');
        }

        const selectWait = () => {
            selected.value = 'wait';
            getCompanys('wait');
        }

        const selectCompleted = () => {
            selected.value = 'completed';
            getCompanys('completed');
        }

        const selectDeclined = () => {
            selected.value = 'declined';
            getCompanys('declined');
        }

        const approve = async (id) => {
            if(confirm('매니저로 승인하시겠습니까?')) {
                try {
                    await axios.put(`/company/approve/${id}`, {
                        headers: {
                            Authorization: localStorage.getItem('access_token')
                        }
                    })
                        .then(() => {
                            triggerToast('승인되었습니다. 새로고침 시 변경 상태가 나타납니다')
                        })
                } catch (error) {
                    alert('승인에 실패했습니다');
                }
            }
        }

        const decline = async (id) => {
            if(confirm('매니저 승인을 거절하시겠습니까?')) {
                try {
                    await axios.put(`/company/disapprove/${id}`, {
                        headers: {
                            Authorization: localStorage.getItem('access_token')
                        }
                    })
                        .then(() => {
                            triggerToast('거절되었습니다. 새로고침 시 변경 상태가 나타납니다');
                        })
                } catch (error) {
                    alert('거절에 실패했습니다');
                }
            }
        }

        return {
            selected,
            selectAll,
            selectWait,
            selectCompleted,
            selectDeclined,
            getCompanys,
            result,
            approve,
            decline,
            toastMessage,
            showToast,
            triggerToast,
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
    overflow: scroll;
    overflow-x: auto;
    overflow-y: auto;
}
.sorter {
    width: 80%;
    height: 2.5em;
    margin: 0 auto;
    padding-top: 2.5em;
    display: flex;
}
.sort {
    margin-left: 1em;
    padding: 0 1em;
    border: none;
    font-weight: bold;
    border-radius: 1em;
    color: #ADADAD;
    cursor: pointer;
}
.sort:hover {
    margin-left: 1em;
    padding: 0 1em;
    border: none;
    font-weight: bold;
    border-radius: 1em;
    background-color: #b5aaec;
    color: white;
}
.sort-selected {
    margin-left: 1em;
    padding: 0 1em;
    border: none;
    font-weight: bold;
    border-radius: 1em;
    background-color: #6F5EBE;
    color: white;
}
table {
    width: 90%;
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
    white-space: nowrap;
}
tbody {
    height: 95%;
}
.wait {
    background-color: #A09EFF;
    color:#2A32F2;
    padding: 0.5em;
    border-radius: 1em;
}
.completed {
    background-color: #D8EAD5;
    color:#96C58B;
    padding: 0.5em;
    border-radius: 1em;
}
.declined {
    background-color: #ECD2CE;
    color:#CD786C;
    padding: 0.5em;
    border-radius: 1em;
}
.checkAct {
    font-size: 1.5em;
    color: #96C58B;
    border-radius: 50%;
    cursor: pointer;
}
.checkDe {
    font-size: 1.5em;
    color: #EDEDED;
    border-radius: 50%;
}
.xAct {
    font-size: 1.5em;
    color: #CD786C;
    border-radius: 50%;
    cursor: pointer;
}
.xDe {
    font-size: 1.5em;
    color: #EDEDED;
    border-radius: 50%;
}
</style>