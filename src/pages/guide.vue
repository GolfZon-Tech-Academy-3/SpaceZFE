<template>
    <div>
        <div class="wrapper" >
            <div style="width: 100%;height: 60%; background-color: transparent; text-align: center;">
                <img src="../assets/guide.png" style="height: 60%;"/>
                <div style="height: 20%; color: #041461;font-weight:bold;font-size:2em;">
                    내 장소를 공유하고 손쉽게 수익을 올려보세요
                </div>
                <div style="height: 20%; color:#797979; font-weight: bold;">
                    오피스, 회의실, 데스크의 다양한 용도로 내 공간을 공유할 수 있어요
                </div>
            </div>
        </div>

        <div class="wrapper2">
        <div style="height: 25%; position: absolute;top: 50%;left: 50%;transform: translate(-50%, 5%); text-align: center;">
            <div style="min-width: 350px;padding-top: 3%;padding-bottom: 1%; font-size: 1.5em; font-weight: bold;">호스팅, 시작해볼까요?</div>
            <div style="color: grey;font-weight: bold;">그 어떤 공간도 훌륭한 작업공간이 될 수 있어요</div>
        </div>
        <div style="min-width: 350px;width: 29%;height: 30%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, 45%);">
            <span class="title"> ① </span><span style="font-weight: bold;font-size: 1.3em;"> 회원가입</span>
            <div style="margin: 3% 0%; font-weight:lighter">누구나 무료로 장소를 등록할 수 있어요</div>
            <hr style="color:#EDEDED;margin-top: 1%;">
        </div>

        <div style="min-width: 350px;width: 29%;height: 50%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, 55%);">
            <span class="title"> ② </span><span style="font-weight: bold;font-size: 1.3em;"> 장소 등록하기</span>
            <div style="margin-top: 3%; font-weight:lighter">내부 사진과 함께 상세 정보를 입력하세요</div>
            <div style="font-weight:lighter">호스트로 승인완료까지 1일정도 소요되며,</div>
            <div style="margin-bottom: 3%; font-weight:lighter">입력해주신 이메일로 호스트 승인여부가 전달됩니다</div>
            <hr style="color:#EDEDED;margin-top: 1%;">
        </div>

        <div style="min-width: 350px;width: 29%;height: 40%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, 115%);">
            <span class="title">③</span><span style="font-weight: bold;font-size: 1.3em;"> 예약 관리하기</span>
            <div style="margin-top: 3%; font-weight:lighter">내 공간의 예약 가능 시간 조정이 가능합니다</div>
            <div style="margin-bottom: 3%; font-weight:lighter">이용자의 예약 정보를 확인 후 취소 진행도 가능합니다</div>
            <hr style="height:0.5px; color:#EDEDED;margin-top: 1%;">
        </div>

        <div style="min-width: 350px;width: 25%;height: 15%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, 430%);text-align: center;">
            <button class="regPlace" @click="MoveToRegisterPage">장소 등록하러 가기</button>
        </div>
    </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter();
        const MoveToRegisterPage = () => {
            if(localStorage.getItem('authority') === 'member') {
                router.push({
                    name: 'RegisterCompany'
                })
            } else if(localStorage.getItem('authority') === 'manager') {
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
    height: 40vh;
    background-color: #F0F3F5;
    display : flex;
    justify-content: center;
    align-items : center;
}
.wrapper2 {
    width: 100%;
    height: 80vh;
}
.regPlace {
    color:white;
    text-decoration: none;
    font-weight: bold;
    background-color: #041461;
    padding: 1vh 4vw;
    border: none;
    border-radius: 1vw;
    cursor: pointer;
}
.regPlace:hover {
    background-color: rgb(63, 149, 184);
}
.title {
    font-size: 1.3em;
    border-radius: 50%;
    color: #5271FF;
}
</style>