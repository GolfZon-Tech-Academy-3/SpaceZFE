<template>
    <div class="wrapper">
        <div class="modal-back">
            <div class="name">
                <div style="padding: 0 1em 0.5em 0">
                    Space 이름
                </div>
                <input class="input" type="text" placeholder="공간 이름 입력 ex) 오리역 사무실" v-model="spaceName">
            </div>
            <div class="type">
                <div style="width: 50%;">
                    <div style="padding: 0 1em 0.5em 0">
                        Space 타입
                    </div>
                    <select class="select" v-model="type">
                        <option value="오피스">오피스</option>
                        <option value="데스크">데스크</option>
                        <option value="회의실 4인">회의실 4 인</option>
                        <option value="회의실 6인">회의실 6 인</option>
                        <option value="회의실 8인 ~ 10인">회의실 8 인 ~ 10 인</option>
                        <option value="회의실 20인">회의실 20 인</option>
                    </select>
                </div>
                <div style="width: 50%;">
                    <div style="padding: 0 1em 0.5em 0">
                        Space 가격
                    </div>
                    <input v-if="isOffice" v-model="officePrice" style="width: 80px;padding: 0.5em" type="text" />
                    <span v-if="isOffice" style="font-size:0.8em; padding-left: 0.5em">원 / 일</span>
                    <label v-if="!isOffice">{{price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}} 원 / 시간</label>
                </div>
            </div>

            <div class="facility">
                <div style="padding: 0 1em 0.5em 0">
                    편의시설
                </div>
                <div style="width:100%;height: 80%;display:grid;grid-template-columns: 1fr 1fr 1fr;">
                    <div class="check"><input type="checkbox" v-model="facilities" value="냉장고" />냉장고</div>
                    <div class="check"><input type="checkbox" v-model="facilities" value="커피포트" />커피포트</div>
                    <div class="check"><input type="checkbox" v-model="facilities" value="에어컨" />에어컨</div>
                    <div class="check"><input type="checkbox" v-model="facilities" value="빔 프로젝트" />빔 프로젝트</div>
                    <div class="check"><input type="checkbox" v-model="facilities" value="와이파이" />와이파이</div>
                </div>
            </div>
            <div class="time">
                <div style="width: 50%">
                    <div style="padding: 0 1em 0.5em 0">
                        오픈 시간
                    </div>
                    <select class="select" v-model="startTime">
                        <option v-for="time in 24" :key="time">{{time - 1}}:00</option>
                    </select>
                </div>
                <div style="width: 50%">
                    <div style="padding: 0 1em 0.5em 0">
                        마감 시간
                    </div>
                    <select class="select" v-model="endTime">
                        <option v-for="time in 24" :key="time">{{time - 1}}:00</option>
                    </select>
                </div>
            </div>
            <div class="time">
                <div style="width: 50%">
                    <div style="padding: 0 1em 0.5em 0">
                        청소 시작 시간
                    </div>
                    <select class="select" v-model="startCleanTime">
                        <option v-for="time in 24" :key="time">{{time - 1}}:00</option>
                    </select>
                </div>
                <div style="width: 50%">
                    <div style="padding: 0 1em 0.5em 0">
                        청소 종료 시간
                    </div>
                    <select class="select" v-model="endCleanTime">
                        <option v-for="time in 24" :key="time">{{time - 1}}:00</option>
                    </select>
                </div>
            </div>
            <div class="button">
                <button class="cancel" @click="closeModal">취소</button>
                <button class="reg" @click="modifySpace">등록 완료</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import axios from '@/axios';
import { useStore } from 'vuex';
export default {
    props: {
        space: {
            type: Object,
            required: true,
        }
    },
    setup(props, {emit}) {
        const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
        const store = useStore();
        const spaceId = ref(0);
        const spaceName = ref('');
        const type = ref('');
        const price = ref(0);
        const officePrice = ref(0);
        const isOffice = ref(false);
        const startTime = ref('');
        const endTime = ref('');
        const startCleanTime = ref('');
        const endCleanTime = ref('');
        const info = ref(props.space);
        const facilities = ref([]);

        spaceId.value = info.value.spaceId;
        spaceName.value = info.value.spaceName;
        type.value = info.value.type;
        startTime.value = info.value.openTime;
        endTime.value = info.value.closeTime;
        startCleanTime.value = info.value.breakOpen;
        endCleanTime.value = info.value.breakClose;
        facilities.value = info.value.facilities.split(",");

        if(type.value === '데스크') {
            price.value = 10000;
            isOffice.value = false;
        } else if(type.value === '오피스') {
            isOffice.value = true;
            price.value = info.value.price;
        } else if(type.value === '회의실 4인') {
            price.value = 20000;
            isOffice.value = false;
        } else if(type.value === '회의실 6인') {
            price.value = 30000;
            isOffice.value = false;
        } else if(type.value === '회의실 8인 ~ 10인') {
            price.value = 50000;
            isOffice.value = false;
        } else {
            price.value = 100000;
            isOffice.value = false;
        }

        watch(type, () => {
            if(type.value === '데스크') {
                price.value = 10000;
                isOffice.value = false;
            } else if(type.value === '오피스') {
                isOffice.value = true;
            } else if(type.value === '회의실 4인') {
                price.value = 20000;
                isOffice.value = false;
            } else if(type.value === '회의실 6인') {
                price.value = 30000;
                isOffice.value = false;
            } else if(type.value === '회의실 8인 ~ 10인') {
                price.value = 50000;
                isOffice.value = false;
            } else {
                price.value = 100000;
                isOffice.value = false;
            }
        })

        watch(startTime, () => {
            let checkStart = '';
            let checkEnd = '';
            if(startTime.value.length === 4) checkStart = startTime.value[0];
            else checkStart = startTime.value[0] + startTime.value[1];
            if(endTime.value.length === 4) checkEnd = endTime.value[0];
            else checkEnd = endTime.value[0] + endTime.value[1];
            if(parseInt(checkStart) >= parseInt(checkEnd)) {
                alert('오픈 시간은 마감 시간보다 빠르게 설정해야합니다');
                startTime.value = '';
            }
        })

        watch(endTime, () => {
            let checkStart = '';
            let checkEnd = '';
            if(startTime.value.length === 4) checkStart = startTime.value[0];
            else checkStart = startTime.value[0] + startTime.value[1];
            if(endTime.value.length === 4) checkEnd = endTime.value[0];
            else checkEnd = endTime.value[0] + endTime.value[1];
            if(parseInt(checkStart) >= parseInt(checkEnd)) {
                alert('마감 시간은 오픈 시간보다 늦게 설정해야합니다');
                endTime.value = '';
            }
        })

        watch(startCleanTime, () => {
            let checkStart = '';
            let checkEnd = '';
            if(startCleanTime.value.length === 4) checkStart = startCleanTime.value[0];
            else checkStart = startCleanTime.value[0] + startCleanTime.value[1];
            if(endCleanTime.value.length === 4) checkEnd = endCleanTime.value[0];
            else checkEnd = endCleanTime.value[0] + endCleanTime.value[1];
            if(parseInt(checkStart) >= parseInt(checkEnd)) {
                alert('청소 시작 시간은 청소 종료 시간보다 빠르게 설정해야합니다');
                startCleanTime.value = '';
            }
        })

        watch(endCleanTime, () => {
            let checkStart = '';
            let checkEnd = '';
            if(startCleanTime.value.length === 4) checkStart = startCleanTime.value[0];
            else checkStart = startCleanTime.value[0] + startCleanTime.value[1];
            if(endCleanTime.value.length === 4) checkEnd = endCleanTime.value[0];
            else checkEnd = endCleanTime.value[0] + endCleanTime.value[1];
            if(parseInt(checkStart) >= parseInt(checkEnd)) {
                alert('청소 종료 시간은 청소 마감 시간보다 늦게 설정해야합니다');
                endCleanTime.value = '';
            }
        })

        const closeModal = () => {
            emit('close');
        }

        const modifySpace = async () => {
            console.log(officePrice.value);
            if(spaceName.value.length < 3) {
                alert('공간 이름을 두 자 이상 입력하세요');
            } else if(type.value === '') {
                alert('공간 타입을 선택하세요');
            } else if(type.value === '오피스' && officePrice.value === 0) {
                alert('오피스의 가격을 입력하세요');
            } else if(startTime.value === '' || endTime.value === '') {
                alert('오픈 시간 또는 마감 시간을 입력하세요');
            } else if(startCleanTime.value === '' || endCleanTime.value === '') {
                alert('청소 시작 시간 또는 청소 종료 시간을 입력하세요');
            } else {
                if(type.value === '오피스') {
                    price.value = officePrice.value;
                }
                try {
                    await axios.put(`${proxy}/space/update?spaceId=${spaceId.value}`, {
                        spaceName: spaceName.value,
                        facilities: facilities.value.join(","),
                        price: price.value,
                        type: type.value,
                        openTime: startTime.value,
                        closeTime: endTime.value,
                        breakOpen: startCleanTime.value,
                        breakClose: endCleanTime.value,
                    },
                    {
                        headers: {
                            Authorization: store.state.accessToken,
                        }
                    })
                        .then(() => {
                            alert('공간 등록에 성공하였습니다');
                            closeModal();
                            window.location.reload();
                        })
                } catch (error) {
                    console.log(error);
                    alert('공간 등록이 실패했습니다');
                }
                
            }
        }

        return {
            spaceName,
            type,
            price,
            isOffice,
            startTime,
            endTime,
            closeModal,
            startCleanTime,
            endCleanTime,
            facilities,
            modifySpace,
            officePrice,
        }
    }
}
</script>

<style scoped>
.wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    font-size: 0.8em;
}
.modal-back {
    width: 40%;
    min-width: 335px;
    height: 90%;
    min-height: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
}
.name {
    width: 90%;
    height: 15%;
    margin: 1em auto;
    font-size: 1.5em;
}
.type {
    width: 90%;
    height: 15%;
    margin: 0.5em auto;
    font-size: 1.5em;
    display: flex;
}
.facility {
    width: 90%;
    height: 15%;
    margin: 0.5em auto;
    font-size: 1.5em;
}
.time {
    width: 90%;
    height: 15%;
    margin: 0.5em auto;
    font-size: 1.5em;
    display: flex;
}
.button {
    width: 300px;
    height: 15%;
    margin: 0 auto;
}
.input {
    width: 50%;
    padding: 0.5em;
}
.select {
    padding: 0.5em 0.3em;
}
.check {
    font-size: 0.8em;
    font-weight: lighter;
}
.cancel {
    background-color: gray;
    color: white;
    padding: 1em 3em;
    border: none;
    border-radius: 0.5em;
    cursor: pointer;
}
.reg {
    background-color: #041461;
    color: white;
    padding: 1em 3em;
    float:right;
    border: none;
    border-radius: 0.5em;
    cursor: pointer;
}
</style>