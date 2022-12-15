<template>
    <div>
        <div class="wrapper" >
            <div style="width: 100%;min-weight: 330px;height: 90%; background-color: transparent; text-align: center;">
                <img src="../assets/guide.png" style="width: 150px;margin-top: 20px;"/>
                <div style="height: 25%; color: #041461;font-weight:bold;font-size:1.5em;">
                    내 장소를 공유하고 손쉽게 수익을 올려보세요
                </div>
                <div style="height: 25%; color:#797979; font-weight: bold;">
                    오피스, 회의실, 데스크의 다양한 용도로 내 공간을 공유할 수 있어요
                </div>
            </div>
        </div>

        <div class="wrapper2">
            <div style="min-width: 330px;font-size: 1.5em; font-weight: bold;margin: 0.5em auto;text-align: center;">호스팅, 시작해볼까요?</div>
            <div style="color: grey;font-weight: bold;margin-bottom: 1em;text-align: center;">그 어떤 공간도 훌륭한 작업공간이 될 수 있어요</div>
            <div style="width: 330px;margin: 0 auto;">
                <span class="title"> ① </span><span style="font-weight: bold;"> 회원가입</span>
                <div style="font-weight:300">누구나 무료로 장소를 등록할 수 있어요</div>
                <hr style="color:#EDEDED;margin-bottom: 1em;">

                <span class="title"> ② </span><span style="font-weight: bold;"> 장소 등록하기</span>
                <div style="font-weight:300">내부 사진과 함께 상세 정보를 입력하세요</div>
                <div style="font-weight:300">호스트로 승인완료까지 1일정도 소요되며,</div>
                <div style="font-weight:300">입력해주신 이메일로 호스트 승인여부가 전달됩니다</div>
                <hr style="color:#EDEDED;margin-bottom: 1em;">

                <span class="title">③</span><span style="font-weight: bold;"> 예약 관리하기</span>
                <div style="font-weight:300">내 공간의 예약 가능 시간 조정이 가능합니다</div>
                <div style="font-weight:300">이용자의 예약 정보를 확인 후 취소 진행도 가능합니다</div>
                <hr style="color:#EDEDED;margin-bottom: 1em;">
                <button class="regPlace" @click="MoveToRegisterPage">장소 등록하러 가기</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
    setup() {
        const router = useRouter();
        const store = useStore();
        const MoveToRegisterPage = () => {
            if(store.state.authority === 'member') {
                router.push({
                    name: 'RegisterCompany'
                })
            } else if(store.state.authority === 'manager') {
                router.push({
                    name: 'ManagePlace'
                })
            } else {
                alert('잘못된 접근입니다');
            }
        }

        return {
            MoveToRegisterPage
        }
    }
}
</script>

<style scoped>
.wrapper {
    width: 100%;
    height: 300px;
    background-color: #F0F3F5;
    display : flex;
    justify-content: center;
    align-items : center;
}
.wrapper2 {
    width: 100%;
    height: 500px;
}
.regPlace {
    width: 100%;
    color:white;
    text-decoration: none;
    font-weight: bold;
    background-color: #041461;
    padding: 0.5em 1em;
    border: none;
    border-radius: 1em;
    cursor: pointer;
}
.title {
    font-size: 1em;
    color: #5271FF;
}
</style>