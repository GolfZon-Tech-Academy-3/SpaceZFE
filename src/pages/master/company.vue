<template>
    <div style="display:flex;flex-direction: column;">
        <MenuBar />
        <div class="content">
            <div style="width: 90%;padding: 0 0 0.5em 0.5em;margin: 0em auto;font-size: 1.5em;font-weight: bold;">
                업체관리
            </div>
            <div style="width: 90%;height: 50px;margin: 0 auto;">
                <button :class="[selected === 'all' ? 'sort-selected' : 'sort']" @click="selectAll">전체</button>
                <button :class="[selected === 'wait' ? 'sort-selected' : 'sort']" @click="selectWait">대기</button>
                <button :class="[selected === 'completed' ? 'sort-selected' : 'sort']" @click="selectCompleted">완료</button>
                <button :class="[selected === 'declined' ? 'sort-selected' : 'sort']" @click="selectDeclined">거부</button>
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
import { useStore } from 'vuex';
export default {
    components: {
        MenuBar,
        Toast,
    },
    setup() {
        const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
        const store = useStore();
        const selected = ref('all');
        const result = ref([]);
        const {
            toastMessage, showToast, triggerToast,
        } = useToast();

        //장소 정보 얻기
        const getCompanys = async (type) => {
            await axios.get(`${proxy}/company/manager/list`, {
                headers: {
                    Authorization: store.state.accessToken,
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

        //모든 상태 검색
        const selectAll = () => {
            selected.value = 'all';
            getCompanys('all');
        }

        //대기 중인 상태 검색
        const selectWait = () => {
            selected.value = 'wait';
            getCompanys('wait');
        }

        //완료 상태 검색
        const selectCompleted = () => {
            selected.value = 'completed';
            getCompanys('completed');
        }

        //거절 상태 검색
        const selectDeclined = () => {
            selected.value = 'declined';
            getCompanys('declined');
        }

        //매니저로 승인하기
        const approve = async (id) => {
            if(confirm('매니저로 승인하시겠습니까?')) {
                try {
                    await axios.put(`${proxy}/company/approve/${id}`, null, {
                        headers: {
                            Authorization: store.state.accessToken
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

        //매니저 승인 거절
        const decline = async (id) => {
            if(confirm('매니저 승인을 거절하시겠습니까?')) {
                try {
                    await axios.put(`${proxy}/company/disapprove/${id}`,null, {
                        headers: {
                            Authorization: store.state.accessToken
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
    width: 100%;
    height: calc(100vh - 3.75em);
}
.scrolltable {
    width: 90%;
    max-height: 80%;
    display:block;
    overflow-x: auto;
    overflow-y: auto;
    white-space: nowrap;
    margin: 0 auto;
}
.sort {
    margin-left: 1em;
    padding: 0.5em 1em;
    border: none;
    font-weight: bold;
    border-radius: 1em;
    color: #ADADAD;
    cursor: pointer;
}
.sort:hover {
    margin-left: 1em;
    padding: 0.5em 1em;
    border: none;
    font-weight: bold;
    border-radius: 1em;
    background-color: #b5aaec;
    color: white;
}
.sort-selected {
    margin-left: 1em;
    padding: 0.5em 1em;
    border: none;
    font-weight: bold;
    border-radius: 1em;
    background-color: #6F5EBE;
    color: white;
}
table {
    width: 90%;
    height: 70%;
    overflow: auto;
    font-weight: bold;
    border-collapse: collapse;
    margin: 0 auto;
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