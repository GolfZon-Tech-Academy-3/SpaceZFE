<template>
  <div class="form">
    <h1 style="margin-bottom: 2%; font-weight: 700">나의 예약 정보</h1>
    <div class="outer">
      <p>
        <span class="res">
          <span v-show="resStatus" class="resBtn" @click="showResStatus"
            >예약 현황</span
          >
          <span
            v-show="!resStatus"
            style="color: #7276c5"
            class="resBtn"
            @click="showResStatus"
            >예약 현황</span
          >
          <span v-show="resRecord" class="resBtn" @click="showResRecord"
            >예약 이력</span
          >
          <span
            v-show="!resRecord"
            style="color: #7276c5"
            class="resBtn"
            @click="showResRecord"
            >예약 이력</span
          >
        </span>
        <span class="res1">
          <b class="resConduct"
            >예약상품<span style="color: #5271ff">{{ resInfo.length }}</span></b
          >
        </span>
      </p>
      <div v-show="!resStatus" class="inner">
        <table>
          <tr v-for="num in resStatuses.length" :key="num">
            <td class="imgTd"><img src="@/assets/img_0001.png" /></td>
            <td class="centerTd">
              <p>
                <span style="font-size: 2rem; margin-right: 3%;">{{ resStatuses[num - 1].SPACEID }}rkskekfk</span> 
                <span style="font-size: 1.3rem; color:#9E9E9E;margin-right: 5%">{type}</span> 
                <span
                    class="payStatusBtn"
                    style="background-color: blue;
                            color: white;"
                  v-if="resStatuses[num - 1].STATUS === 1"
                  >결제완료</span>
              </p>
              <p>
                {{ resStatuses[num - 1].STARTDATE.slice(0,10) }} ~ {{ resStatuses[num - 1].ENDDATE.slice(0,10) }}
              </p>
              <p>
                <p><span class="info">예약일</span> {{resStatuses[num - 1].RESERVE_TIME.slice(0,10)}}</p>
                <p><span class="info">예약번호</span> <span style="color:#5271FF;">{{resStatuses[num - 1].PREPAY_UID}}</span></p>
              </p>
              <p>
                <span class="info">총금액   </span> 
                <span style="color:#FF0000">
                {{resStatuses[num - 1].PRICE
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}원</span>
              </p>
            </td>
            <td class='btnTd'>
                <div style="border-left: 1px solid #dee2e6; padding-left: 10%;">
                    <p style="font-size:1.3rem">{{resInfo[num - 1].COMPANYID}} 하나 프라자 빌딩</p>
                    <p style="margin-left: 3%; font-size:0.7rem;color:#838383">{장소 위치}서울특별시 어딘가 어쩌구<br>자고싶다</p>
                    <p style="margin-left: 3%; font-size:1rem;color:#838383">{장소 번호}</p>
                    <p><button class="cancelBtn" @click="cancelRes">취소하기</button></p>
                </div>
            </td>
          </tr>
        </table>
      </div>
      <div v-show="!resRecord" class="inner">
        <table v-for="num in resDone.length" :key="num">
          <tr>
            <td class="imgTd"><img src="@/assets/img_0001.png" /></td>
            <td class="centerTd">
              <p>
                <span style="font-size: 2rem; margin-right: 3%;">{{ resDone[num - 1].SPACEID }}rkskekfk</span> 
                <span style="font-size: 1.3rem; color:#9E9E9E;margin-right: 5%">{type}</span> 
                <span
                    class="payStatusBtn"
                    style="background-color: #041461;
                        color: white;"
                        v-if="resDone[num - 1].STATUS === 2"
                  >이용 완료</span>
                <span
                    class="payStatusBtn"
                    v-if="resDone[num - 1].STATUS === 3"
                    style="background-color: white;
                        color: red;
                        border: 1px solid red;"
                  >결제 취소</span>
              </p>
              <p>
                {{ resDone[num - 1].STARTDATE.slice(0,10) }} ~ {{ resDone[num - 1].ENDDATE.slice(0,10) }}
              </p>
              <p>
                <p><span class="info">예약일</span> {{resDone[num - 1].RESERVE_TIME.slice(0,10)}}</p>
                <p><span class="info">예약번호</span> <span style="color:#5271FF;">{{resDone[num - 1].PREPAY_UID}}</span></p>
              </p>
              <p>
                <span class="info">총금액   </span> 
                <span style="color:#FF0000">
                {{resDone[num - 1].PRICE
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}원</span>
              </p>
            </td>
            <td class='btnTd'>
                <div style="border-left: 1px solid #dee2e6; padding-left: 10%;">
                    <p style="font-size:1.3rem">{{resInfo[num - 1].COMPANYID}} 하나 프라자 빌딩</p>
                    <p style="margin-left: 3%; font-size:0.7rem;color:#838383">{장소 위치}서울특별시 어딘가 어쩌구<br>자고싶다</p>
                    <p style="margin-left: 3%; font-size:1rem;color:#838383">{장소 번호}</p>
                    <p>
                      <button v-show="!resDone[num - 1].reviewed" 
                      v-if="resDone[num - 1].STATUS === 2" 
                      :id="resDone[num - 1].reviewed"  
                      class="cancelBtn" 
                      @click="writeReview(resDone[num-1].RESERVATIONID)">
                      리뷰작성
                    </button>
                  </p>
                    <p>
                      <button 
                      v-show="resDone[num - 1].reviewed" 
                      v-if="resDone[num - 1].STATUS === 2 "  
                      class="showReviewlBtn" 
                      @click="reviewToggle(resDone[num-1].RESERVATIONID)">
                      리뷰 보기
                    </button>
                    </p>
                      <ReviewWrite v-if="reviewShow" @close="closeModal" @reviewed='changeRevBtn' :editOrDel="editOrDel"/>
                </div>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="border-bottom: none;">
              <MyReview v-show="resDone[num-1].reviewShow" :reviewer="resDone[num-1].MEMBERID" @editOrDel="showWrite"/>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <ReviewDelete v-if="showDelete" @close="closeModal"/>
  </div>

</template>

<script>
import { ref } from "vue";
import axios from "@/axios";
import ReviewWrite from '@/components/myPage/ReviewWrite.vue'
import MyReview from '@/components/myPage/MyReview.vue'
import ReviewDelete from '@/components/myPage/ReviewDelete.vue'

export default {
    components:{
        ReviewWrite,
        MyReview,
        ReviewDelete
    },
  setup() {
    const resStatus = ref(false);
    const resRecord = ref(true);
    const reviewShow = ref(false)

    const resInfo = ref([
      {
        RESERVATIONID: 8,
        SPACEID: 12,
        MEMBERID: 23,
        STARTDATE: "2022-11-04 00:00",
        ENDDATE: "2022-11-05 23:59",
        STATUS: 1,
        PAYSTATUS: "001",
        PRICE: 60000,
        PREPAY: "002",
        RESERVE_TIME: "2022-11-02 20:10",
        IMP_UID: "imp_164388488105",
        COMPANYID: 1,
        PREPAY_UID: "z1667387382826",
        POSTPAY_UID: "z1667387401039",
        reviewed:false,
        reviewShow:false
      },
      {
        RESERVATIONID: 5,
        SPACEID: 1,
        MEMBERID: 23,
        STARTDATE: "2022-11-2 20:00",
        ENDDATE: "2022-11-2 22:00",
        STATUS: 1,
        PAYSTATUS: "001",
        PRICE: 20000,
        PREPAY: "002",
        RESERVE_TIME: "2022-11-02 18:56",
        IMP_UID: "imp_454983509878",
        COMPANYID: 1,
        PREPAY_UID: "i1667382971786",
        POSTPAY_UID: "m1667382996581",
        reviewed:false,
        reviewShow:false
      },
      {
        RESERVATIONID: 6,
        SPACEID: 2,
        MEMBERID: 23,
        STARTDATE: "2022-11-2 20:00",
        ENDDATE: "2022-11-2 21:00",
        STATUS: 2,
        PAYSTATUS: "002",
        PRICE: 10000,
        PREPAY: "000",
        RESERVE_TIME: "2022-11-02 19:06",
        IMP_UID: "imp_271602906633",
        COMPANYID: 1,
        PREPAY_UID: "o1667383590257",
        POSTPAY_UID: "000",
        reviewed:false,
        reviewShow:false
      },
      {
        RESERVATIONID: 7,
        SPACEID: 3,
        MEMBERID: 23,
        STARTDATE: "2022-11-2 21:00",
        ENDDATE: "2022-11-2 22:00",
        STATUS: 2,
        PAYSTATUS: "002",
        PRICE: 10000,
        PREPAY: "000",
        RESERVE_TIME: "2022-11-02 19:09",
        IMP_UID: "imp_461747776134",
        COMPANYID: 1,
        PREPAY_UID: "b1667383733352",
        POSTPAY_UID: "000",
        reviewed:false,
        reviewShow:false
      },
      {
        RESERVATIONID: 9,
        SPACEID: 4,
        MEMBERID: 23,
        STARTDATE: "2022-11-21 21:00",
        ENDDATE: "2022-11-21 22:00",
        STATUS: 3,
        PAYSTATUS: "002",
        PRICE: 100000,
        PREPAY: "000",
        RESERVE_TIME: "2022-11-02 19:09",
        IMP_UID: "imp_461747776134",
        COMPANYID: 1,
        PREPAY_UID: "b1667383733352",
        POSTPAY_UID: "000",
        reviewed:false,
        reviewShow:false
      },
    ]);

    const editOrDel = ref('')
    const showDelete = ref(false)

    const reviewed = ref(false)
    const resStatuses = ref([])
    const resDone = ref([])
    const myReview = ref(false)
    const dis = ref('')

    let find

    //예약 정보들 분류
    const sortRes = ()=>{
        for(let i = 0; i<resInfo.value.length; i++){
            if(resInfo.value[i].STATUS === 1){
                resStatuses.value.push(resInfo.value[i])
            } else if(resInfo.value[i].STATUS !==1) {
                resDone.value.push(resInfo.value[i])
            } 
        } 
    }
    sortRes()

    //예약 이력 보이는 함수
    const showResRecord = () => {
      resRecord.value = !resRecord.value;
      resStatus.value = true;
    };
    //예약 현황 보이는 함수
    const showResStatus = () => {
      resStatus.value = !resStatus.value;
      resRecord.value = true;
    };

    //예약 취소시킬 함수
    const cancelRes = ()=>{
    }

    //리뷰 작성 함수
    const writeReview=  (e)=>{
        reviewShow.value= !reviewShow.value
        let i=e
        find = resDone.value.find(e=>e.RESERVATIONID===i)
        console.log(find)
    }

    //모달 닫을 함수
    const closeModal = () => {
      reviewShow.value = false;
      showDelete.value = false
    };

    //리뷰 보기로 바꿀 함수
    const changeRevBtn = ()=>{
        find.reviewed = true
    }

    //리뷰 바꾸면서 예약 정보들 객체에 접근해서 각각의 버튼들을 리뷰 작성 완료로 바꾸는 함수
    const reviewToggle = (e)=>{
      let i = e;
      find = resDone.value.find(e=>e.RESERVATIONID===i)
      // myReview.value = !myReview.value
      find.reviewShow = !find.reviewShow
    }

    //마이리뷰에서 수정, 삭제를 누를시 여기에 임포트된 컴포넌트들을 조절하는 함수
    const showWrite=(todo)=>{
      if(todo==='edit'){
        editOrDel.value = todo
        reviewShow.value = !reviewShow.value;
      }else{
        // console.log(todo);
        showDelete.value = true
      }
    }

    // const resGet =async()=>{
    //     const res= await axios.get()
    // }
    return { 
      resStatus,
      resRecord,
      showResRecord,
      showResStatus, 
      resInfo,
      resStatuses,
      resDone,
      writeReview,
      closeModal,
      reviewShow,
      reviewed,
      cancelRes,
      changeRevBtn,
      reviewToggle,
      myReview,
      dis ,
      showWrite,
      editOrDel,
      showDelete,
      };
  },
};
</script>

<style scoped>
.form {
  width: 85%;
  float: right;
  text-align: center;
  padding: 2%4%04%;
}
.outer {
  background-color: #e7eaee;
  border-radius: 10px;
  padding: 3%0.3% 0% 0.3%;
  font-size: 1.1rem;
  font-family: "Inter";
  font-style: normal;
  font-weight: 800;
}
.inner {
  background-color: white;
  border-radius: 10px;
  text-align: center;
  padding: 3%;
}
.res {
  width: 20vw;
  float: left;
}
.res1 {
  width: 20vw;
  margin-left: 50%;
}
.resBtn {
  color: silver;
  margin-right: 5%;
  font-weight: 800;
  font-size: 1.3rem;
}
.resBtn:hover {
  color: #7276c5;
}
.resConduct {
  margin-left: 5%;
  font-weight: 800;
  font-size: 1.2rem;
}
table{
    margin: auto;
    width: 100%;
}
td{
    padding-top: 1.5%;
    padding-bottom: 1.5%;
   border-bottom: 1px solid #dee2e6;
}
img{
    border-radius: 10px;
    width: 80%;
}
.centerTd{
    text-align: left;
}
.centerTd p{
    margin-bottom: 1%;
}
.imgTd{
    width: 20%;
}

.btnTd{
    text-align: left;
    width: 20%;
    margin-top: 2%;
    margin-bottom: 2%;
    
}
.btnTd p{
    margin-bottom: 1%;
}
.payStatusBtn{
    
    border-radius: 10px;
    padding: 1.1%;
    font-size: 0.9rem;
    font-weight: 300;
}
.info{
    color: #9E9E9E;
}
.cancelBtn{
    margin-top: 8%;
    width: 70%;
    height: 6vh;
    background-color: white;
    border-radius: 10px;
}
.showReviewlBtn{
     margin-top: 8%;
    width: 70%;
    height: 6vh;
    background-color: #9E9E9E;
    border: 1px solid #9E9E9E;
    color:white;
    border-radius: 10px;
}

</style>
