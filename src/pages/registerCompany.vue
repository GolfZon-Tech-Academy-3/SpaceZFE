<template>
    <div style="width: 100%; height: 115vh;">
        <div class="wrapper">
            <h2>업체 등록하기</h2>
            <div class="item">업체 이름</div>
            <input class="input" type="text" placeholder="업체 이름" v-model="placeName" />
            <div class="item">업체 사진</div>
            <input class="file" id="file" type="file" accept="image/*" @change="changeImage" />
            <div class="item">주소</div>
            <input disabled class="input" type="text" id="address" placeholder="주소" v-model="address">
            <input class="btn" type="button" @click="searchAddress()" value="주소 찾기">
            <input class="input" type="text" id="detailAddress" placeholder="상세주소" v-model="detailAddress">
            <div class="item">장소 요약</div>
            <textarea class="textarea" placeholder="장소 요약 정보를 입력해주세요" maxlength="250" v-model="placeSummary"/>
            <div class="item">장소 소개</div>
            <textarea class="textarea" placeholder="장소 소개를 입력해주세요" maxlength="250" v-model="placeIntro" />
            <div class="item">이용 규칙</div>
            <textarea class="textarea" placeholder="장소 이용 규칙을 입력해주세요" maxlength="250" v-model="rule" />
            <div style="text-align: center;">
                <button class="submit" @click="submit">신청</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
    setup() {
        const store = useStore();
        const placeName = ref('');
        var file = null;
        const address = ref('');
        const detailAddress = ref('');
        const placeSummary = ref('');
        const placeIntro = ref('');
        const rule = ref('');
        const router = useRouter();

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

        const changeImage = (event) => {
            file = event.target.files[0];
        }

        const submit = async () => {
            if(store.state.authority == null) {
                alert('로그인을 먼저 진행해주세요');
            } else if(store.state.authority === 'member') {
                if(placeName.value.length < 2) {
                    alert('업체 이름은 두 자리 이상이어야합니다');
                } else if(document.getElementById('file').files.length === 0) {
                    alert('장소 대표 이미지를 하나 선택해주세요');
                } else if(address.value === '') {
                    alert('주소를 입력해주세요');
                } else if(placeSummary.value.length < 10) {
                    alert('장소 요약은 열 자리 이상이어야합니다');
                } else if(placeIntro.value.length < 10) {
                    alert('장소 소개는 열 자리 이상이어야합니다');
                } else if(rule.value.length < 10) {
                    alert('이용 규칙은 열 자리 이상이어야합니다');
                } else {
                    const form = new FormData()
                    form.append('companyName', placeName.value);
                    form.append('info', placeIntro.value);
                    form.append('rules', rule.value);
                    form.append('location', address.value);
                    form.append('details', detailAddress.value);
                    form.append('summary', placeSummary.value);
                    form.append('multipartFile', file);
                    try {
                        await axios.post('company/post', form, {
                            headers: {
                                Authorization: store.state.accessToken,
                                'Content-Type': 'multipart/form-data',
                            }
                        })
                            .then((res) => {
                                alert('업체 신청되었습니다');
                                router.push({
                                    name: 'Home',
                                })
                            })
                    } catch (error) {
                        alert('이미 업체 신청된 계정입니다');
                        router.push({
                            name: 'Home',
                        })
                    }
                    
                }
            } else {
                alert('잘못된 요청입니다');
            }
        }

        return {
            placeName,
            address,
            detailAddress,
            placeSummary,
            placeIntro,
            rule,
            searchAddress,
            submit,
            changeImage,
        }
    }
}
</script>

<style scoped>
.wrapper {
    width: 500px;
    height: 100%;
    margin: 0 auto;
}
.item {
    font-size: 1.3em;
    margin: 0.5em 0;
}
.file::file-selector-button {
    padding: 1em;
    background-color: #041461;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 1em;
    cursor: pointer;
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
.textarea {
    width: 485px;
    height: 90px;
    resize: none;
    padding: 0.5em;
    border-radius: 1em;
}
.submit {
    padding: 1em 3em;
    width: 90%;
    background-color: #041461;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 1em;
    margin: 2em 0;
    cursor: pointer;
}
</style>