<template>
    <div class="wrapper">
        <div class="modal-back">
            <div class="name">
                <div style="padding: 0 1em 1em 0">
                    Space 이름
                </div>
                <input class="input" type="text" placeholder="공간 이름 입력 ex) 오리역 사무실">
            </div>
            <div class="type">
                <div style="width: 50%;">
                    <div style="padding: 0 1em 1em 0">
                        Space 타입
                    </div>
                    <select class="select" v-model="type">
                        <option selected value="office">오피스</option>
                        <option value="desk">데스크</option>
                        <option value="meeting4">회의실 4 인</option>
                        <option value="meeting6">회의실 6 인</option>
                        <option value="meeting8">회의실 8 ~ 10 인</option>
                        <option value="meeting20">회의실 20 인</option>
                    </select>
                </div>
                <div style="width: 50%;">
                    <div style="padding: 0 1em 1em 0">
                        Space 가격
                    </div>
                    <input v-if="isOffice" style="padding: 0.5em" type="text" />
                    <span v-if="isOffice" style="font-size:0.8em; padding-left: 0.5em">원 / 일</span>
                    <label v-if="!isOffice">{{price}}</label>
                </div>
            </div>

            <div class="facility">
                <div style="padding: 0 1em 1em 0">
                    편의시설
                </div>
                <div style="width:100%;height: 80%;display:grid;grid-template-columns: 1fr 1fr 1fr;">
                    <div class="check"><input type="checkbox" />냉장고</div>
                    <div class="check"><input type="checkbox" />커피포트</div>
                    <div class="check"><input type="checkbox" />에어컨</div>
                    <div class="check"><input type="checkbox" />빔 프로젝트</div>
                    <div class="check"><input type="checkbox" />와이파이</div>
                </div>
            </div>
            <div class="time">
                <div style="width: 50%">
                    <div style="padding: 0 1em 1em 0">
                        오픈 시간
                    </div>
                    <select class="select" v-model="startTime">
                        <option v-for="time in 24" :key="time">{{time - 1}}:00</option>
                    </select>
                </div>
                <div style="width: 50%">
                    <div style="padding: 0 1em 1em 0">
                        마감 시간
                    </div>
                    <select :disabled="endDisabled" class="select" v-model="endTime">
                        <option v-for="time in 24" :key="time">{{time - 1}}:00</option>
                    </select>
                </div>
            </div>
            <div class="button">
                <button class="cancel" @click="closeModal">취소</button>
                <button class="reg">등록 완료</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, getCurrentInstance } from 'vue';
export default {
    setup() {
        const { emit } = getCurrentInstance();
        const type = ref('');
        const price = ref('');
        const isOffice = ref(false);
        const startTime = ref('');
        const endTime = ref('');
        const endDisabled = ref(true);

        watch(type, () => {
            if(type.value === 'desk') {
                price.value = '10,000 원 / 시간';
                isOffice.value = false;
            } else if(type.value === 'office') {
                isOffice.value = true;
            } else if(type.value === 'meeting4') {
                price.value = '20,000 원 / 시간';
                isOffice.value = false;
            } else if(type.value === 'meeting6') {
                price.value = '30,000 원 / 시간';
                isOffice.value = false;
            } else if(type.value === 'meeting8') {
                price.value = '50,000 원 / 시간';
                isOffice.value = false;
            } else {
                price.value = '100,000 원 / 시간';
                isOffice.value = false;
            }
        })

        watch(startTime, () => {
            console.log(startTime.value);
            endDisabled.value = false;
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

        const closeModal = () => {
            emit('close');
        }

        return {
            type,
            price,
            isOffice,
            startTime,
            endTime,
            endDisabled,
            closeModal,
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
}
.modal-back {
    width: 40%;
    min-width: 500px;
    height: 90%;
    min-height: 700px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
}
.name {
    width: 80%;
    height: 15%;
    margin: 1em auto;
    font-size: 1.5em;
}
.type {
    width: 80%;
    height: 15%;
    margin: 1em auto;
    font-size: 1.5em;
    display: flex;
}
.facility {
    width: 80%;
    height: 20%;
    margin: 1em auto;
    font-size: 1.5em;
}
.time {
    width: 80%;
    height: 15%;
    margin: 1em auto;
    font-size: 1.5em;
    display: flex;
}
.button {
    width: 60%;
    height: 15%;
    margin: 0 auto;
}
.input {
    width: 50%;
    padding: 1em;
}
.input:focus {
    outline: none;
}
.select {
    padding: 1em;
}
.select:focus {
    outline: none;
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
.cancel:hover {
    background-color: black;
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
.reg:hover {
    background-color: skyblue;
}
</style>