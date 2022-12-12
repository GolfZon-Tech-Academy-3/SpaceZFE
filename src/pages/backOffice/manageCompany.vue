<template>
    <div style="display:flex;">
        <MenuBar />
        <div class="content">
            <div v-if="!isEditing" style="width:600px;height: 600px;margin: auto;">
                <h2>업체정보<span @click="controlEdit" style="background-color: #041461;padding: 0.5em;border-radius: 0.5em;color: white;font-size: 0.7em;float: right;cursor: pointer;">수정</span></h2>
                <img style="width: 200px;border-radius: 1em;box-shadow: 0 0 5px 0 gray;" :src="companyInfo.imageName" />
                <h4>업체 이름</h4>
                <div style="color:gray;">{{companyInfo.companyName}}</div>
                <h4>주소</h4>
                <div style="color:gray;">{{companyInfo.location}} {{companyInfo.details}}</div>
                <h4>장소 요약</h4>
                <textarea readonly :value="companyInfo.summary"></textarea>
                <h4>장소 소개</h4>
                <textarea readonly :value="companyInfo.info"></textarea>
                <h4>이용 규칙</h4>
                <textarea readonly :value="companyInfo.rules"></textarea>
            </div>

            <div v-if="isEditing" style="width:600px;height: 600px;margin: auto;">
                <h2>업체 정보 수정</h2>
                <h4 class="item">업체 이름</h4>
                <input class="input" type="text" placeholder="업체 이름" v-model="placeName" />
                <h4 class="item">주소</h4>
                <input disabled class="input" type="text" id="address" placeholder="주소" v-model="address">
                <input class="btn" type="button" @click="searchAddress()" value="주소 찾기">
                <input class="input" type="text" id="detailAddress" placeholder="상세주소" v-model="detailAddress">
                <h4 class="item">장소 요약</h4>
                <textarea class="textarea" placeholder="장소 요약 정보를 입력해주세요" maxlength="250" v-model="placeSummary"/>
                <h4 class="item">장소 소개</h4>
                <textarea class="textarea" placeholder="장소 소개를 입력해주세요" maxlength="250" v-model="placeIntro" />
                <h4 class="item">이용 규칙</h4>
                <textarea class="textarea" placeholder="장소 이용 규칙을 입력해주세요" maxlength="250" v-model="rule" />
                <div style="text-align: center;">
                    <button @click="controlEdit" class="btn-red">취소</button>
                    <button @click="submit" class="btn">완료</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import MenuBar from './menuBar.vue';
import axios from '@/axios';
import { useStore } from 'vuex';
export default {
    components: {
        MenuBar,
    },
    setup() {
        const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
        const store = useStore();
        const companyInfo = ref({});
        const isEditing = ref(false);
        const placeName = ref('');
        const address = ref('');
        const detailAddress = ref('');
        const placeSummary = ref('');
        const placeIntro = ref('');
        const rule = ref('');

        const getInfo = async () => {
            await axios.get(`${proxy}/company/information/${store.state.companyId}`, {
                headers: {
                    Authorization: store.state.accessToken,
                }
            }).then((res) => {
                companyInfo.value = res.data;
                placeName.value = res.data.companyName;
                address.value = res.data.location;
                detailAddress.value = res.data.details;
                placeSummary.value = res.data.summary;
                placeIntro.value = res.data.info;
                rule.value = res.data.rules;
            })
        }

        getInfo();

        const controlEdit = () => {
            isEditing.value = !isEditing.value;
        }

        const searchAddress = () => {
            new daum.Postcode({
                oncomplete: function(data) {
                    // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                    // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                    var addr = ''; // 주소 변수

                    //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                        addr = data.roadAddress;
                    } else { // 사용자가 지번 주소를 선택했을 경우(J)
                        addr = data.jibunAddress;
                    }

                    address.value = addr;
                    // 커서를 상세주소 필드로 이동한다.
                    document.getElementById("detailAddress").focus();
                }
            }).open();
        }

        const submit = async () => {
            if(confirm('수정하시겠습니까?')) {
                if(placeName.value.length < 2) {
                    alert('업체 이름은 두 자리 이상이어야합니다');
                }else if(address.value === '') {
                    alert('주소를 입력해주세요');
                } else if(placeSummary.value.length < 10) {
                    alert('장소 요약은 열 자리 이상이어야합니다');
                } else if(placeIntro.value.length < 10) {
                    alert('장소 소개는 열 자리 이상이어야합니다');
                } else if(rule.value.length < 10) {
                    alert('이용 규칙은 열 자리 이상이어야합니다');
                } else {
                    try {
                        const form = new FormData();
                        form.append('companyName', placeName.value);
                        form.append('location', address.value);
                        form.append('details', detailAddress.value);
                        form.append('summary', placeSummary.value);
                        form.append('info', placeIntro.value);
                        form.append('rules', rule.value);
                        await axios.put(`${proxy}/company/update/${store.state.companyId}`, form, {
                            headers: {
                                Authorization: store.state.accessToken,
                            }
                        })
                            .then(() => {
                                alert('업체 정보가 수정되었습니다');
                                window.location.reload();
                            })
                    } catch (error) {
                        alert('오류가 발생했습니다');
                    }
                    
                }
            }
            
        }

        return {
            companyInfo,
            isEditing,
            controlEdit,
            searchAddress,
            placeName,
            address,
            detailAddress,
            placeSummary,
            placeIntro,
            rule,
            submit,
        }
    }
}
</script>

<style scoped>
.content {
    width: calc(100% - 200px);
    height:100vh;
}
textarea {
    width: 90%;height: 100px;resize: none;
    color: gray;
    border: 1px solid gray;
    border-radius: 1em;
}
.input {
    width: 60%;
    padding: 1em 1em 1em 1em;
    border:none;
    border-bottom: 1px solid gray;
}
.input:focus {
    outline: none;
    border-bottom: 1px solid black;
}
.btn {
    padding: 1em;
    background-color: #041461;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 1em;
    margin-left: 1em;
    cursor: pointer;
}
.btn-red {
    padding: 1em;
    background-color: white;
    color: red;
    font-weight: bold;
    border: 1px solid red;
    border-radius: 1em;
    margin-left: 1em;
    cursor: pointer;
}
</style>