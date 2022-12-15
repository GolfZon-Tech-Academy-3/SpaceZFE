<template>
    <ErrorHandle
    :show="!!errorContent || !!errorContetn1"
    title="Error"
    @home="errorHome"
    @refresh="errorRef"
  >
    <p>{{ errorContent }}</p>
  </ErrorHandle>
  <Spinner v-if="loading" />
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
            >예약상품<span style="color: #5271ff">{{ resStatuses.length + resDone.length }}</span></b
          >
        </span>
      </p>
      <div v-show="!resStatus" class="inner">
        <table>
          <tr v-for="num in resStatuses.length" :key="num">
            <td class="imgTd"><img :src="resStatuses[num - 1].imageName" /></td>
            <td class="centerTd">
              <p>
                <span  class="tooltip" style="font-size: 2rem; margin-right: 3%;" @mouseenter="showPopup" @click="toCompany(resStatuses[num - 1].companyId)">
                  <span  class="tooltiptext" v-show="popup">해당 공간으로 이동</span>
                  {{ resStatuses[num - 1].spaceName }}
                </span> 
                <span style="font-size: 1.3rem; color:#9E9E9E;margin-right: 5%" @mouseenter="showPopup" @click="toCompany(resStatuses[num - 1].companyId)">{{resStatuses[num - 1].type}}</span> 
                <span
                    v-if="resStatuses[num - 1].payStatus ==='003'"
                    class="payStatusBtn"
                    style="background-color: blue;
                            color: white;"
                  >보증금 결제완료</span>
                <span
                    v-if="resStatuses[num - 1].payStatus ==='002'"
                    class="payStatusBtn"
                    style="background-color: blue;
                            color: white;"
                  >결제완료</span>
                <span
                    v-if="resStatuses[num - 1].payStatus ==='001'"
                    class="payStatusBtn"
                    style="background-color: blue;
                            color: white;"
                  >결제 전</span>
                  <span
                    class="payStatusBtn"
                    style="background-color: white;
                        color: #041461;"
                        v-if="resStatuses[num - 1].status === '001'"
                  >예약 중</span>
                <span
                    class="payStatusBtn"
                    style="background-color: #041461;
                        color: white;"
                        v-if="resStatuses[num - 1].status === '004'"
                  >이용 완료</span>
              </p>
              <p v-if="resStatuses[num - 1].type ==='오피스'">
                {{ resStatuses[num - 1].startDate.slice(0,10) }} ~ {{ resStatuses[num - 1].endDate.slice(0,10) }}
              </p>
              <p v-if="resStatuses[num - 1].type !=='오피스'">
                {{ resStatuses[num - 1].startDate }} ~ {{ resStatuses[num - 1].endDate }}
              </p>
              <p>
                <p><span class="info">예약일</span> {{resStatuses[num - 1].reserveTime.slice(0,10)}}</p>
                <p><span class="info">예약번호</span> <span style="color:#5271FF;">{{resStatuses[num - 1].reservationId}}</span></p>
              </p>
              <p>
                <span class="info">총금액   </span> 
                <span style="color:#FF0000">
                {{resStatuses[num - 1].price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}원</span>
              </p>
            </td>
            <td class='btnTd'>
                <div style="border-left: 1px solid #dee2e6; padding-left: 10%;">
                    <p style="font-size:1.3rem">{{resStatuses[num - 1].companyIdId}}</p>
                    <p style="margin-left: 3%; font-size:0.7rem;color:#838383">{{resStatuses[num - 1].location}}</p>
                    <p style="margin-left: 3%; font-size:1rem;color:#838383">{{resStatuses[num - 1].details}}</p>
                    <p><button class="cancelBtn" @click="cancelRes(resStatuses[num - 1])">예약 취소하기</button></p>
                </div>
            </td>
          </tr>
        </table>
      </div>
      <div v-show="!resRecord" class="inner">
        <table v-for="num in resDone.length" :key="num">
          <tr>
            <td class="imgTd"><img :src="resDone[num-1].imageName" /></td>
            <td class="centerTd">
              <p>
                <span  class="tooltip" style="font-size: 2rem; margin-right: 3%;" @mouseenter="showPopup" @click="toCompany(resDone[num - 1].companyId)">
                  <span  class="tooltiptext" v-show="popup">해당 공간으로 이동</span>
                  {{ resDone[num - 1].spaceName }}
                </span> 
                <span style="font-size: 1.3rem; color:#9E9E9E;margin-right: 5%;" >{{resDone[num - 1].type}}</span> 
                <span
                    class="payStatusBtn"
                    style="background-color: white;
                        color: #041461;"
                        v-if="resDone[num - 1].status === '001'"
                  >예약 중</span>
                <span
                    class="payStatusBtn"
                    style="background-color: #041461;
                        color: white;"
                        v-if="resDone[num - 1].status === '004'"
                  >이용 완료</span>
                <span
                    class="payStatusBtn"
                    v-if="resDone[num - 1].status === '002'|| resDone[num - 1].status === '003'"
                    style="background-color: white;
                        color: red;
                        border: 1px solid red;"
                  >예약 취소</span>
              </p>
              <p>
                {{ resDone[num - 1].startDate.slice(0,10) }} ~ {{ resDone[num - 1].endDate.slice(0,10) }}
              </p>
              <p>
                <p><span class="info">예약일</span> {{resDone[num - 1].reserveTime.slice(0,10)}}</p>
                <p><span class="info">예약번호</span> <span style="color:#5271FF;">{{resDone[num - 1].reservationId}}</span></p>
              </p>
              <p>
                <span class="info">총금액   </span> 
                <span style="color:#FF0000">
                {{resDone[num - 1].price
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}원</span>
              </p>
            </td>
            <td class='btnTd'>
                <div style="border-left: 1px solid #dee2e6; padding-left: 10%;">
                    <p style="font-size:1.3rem">{{resDone[num - 1].companyId}}</p>
                    <p style="margin-left: 3%; font-size:0.7rem;color:#838383">{{resDone[num-1].location}}</p>
                    <p style="margin-left: 3%; font-size:1rem;color:#838383">{{resDone[num-1].details}}</p>
                      <p v-show="resDone[num - 1].status !== '002' && resDone[num - 1].status !== '003'">
                        <button v-show="!resDone[num - 1].review" 
                        :id="resDone[num - 1].reviewed"  
                        class="cancelBtn" 
                        
                        @click="writeReview(resDone[num-1].reservationId)">
                        리뷰작성
                      </button>
                    </p>
                      <p v-show="resDone[num - 1].status !== '002' && resDone[num - 1].status !== '003'">
                        <button 
                        v-show="resDone[num - 1].review" 
                        v-if="!resDone[num-1].reviewToggle"
                        class="nShowReviewlBtn" 
                        @click="reviewToggle(resDone[num-1].reservationId)">
                        리뷰 보기
                      </button>
                        <button 
                        v-show="resDone[num - 1].review" 
                        v-if="resDone[num-1].reviewToggle"
                        class="showReviewlBtn" 
                        @click="reviewToggle(resDone[num-1].reservationId)">
                        리뷰 접기
                      </button>
                      </p>
                      <ReviewWrite v-if="reviewShow" @close="closeModal" :writePack="writePack" :edit="editOrDel"/>
                </div>
            </td>
          </tr>
          <tr>
            <td class="reviewsho" colspan="3" style="border-bottom: 1px solid silver;" v-if="(resDone[num-1].review!==null)" v-show="resDone[num-1].reviewToggle">
              <MyReview   :reviewer="resDone[num-1].review" @editOrDel="showWrite" @reviewId="showWrite2"/>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>

</template>

<script>
import { ref } from "vue";
import axios from "@/axios";
import {useRouter} from 'vue-router'
import {useStore } from  'vuex'

import ErrorHandle from "@/components/UI/BaseDialog.vue";
import Spinner from "@/components/UI/Spinner.vue";
import ReviewWrite from '@/components/myPage/ReviewWrite.vue'
import MyReview from '@/components/myPage/MyReview.vue'


export default {
    components:{
        ReviewWrite,
        MyReview,
        ErrorHandle,
        Spinner
      },
setup() {
    const proxy = window.location.hostname === "localhost" ? "" : "/proxy"; 
    const resStatus = ref(false);
    const resRecord = ref(true);
    const reviewShow = ref(false);
    const router = useRouter()
    const store = useStore()

    const editOrDel = ref({})
    const writePack = ref({
      companyId:'',
      spaceId:'',
      reservationId:'',
    })
    const showDelete = ref(false)

    const reviewed = ref(false)
    const resStatuses = ref([])
    const resDone = ref([])
    const myReview = ref(false)

    const errorContent = ref(null);
    const errorContetn1 = ref(null);
    const loading = ref(false);
    const popup = ref(false)

    let find

    //예약 현황 띄우는 함수
    const getResStatuses = async ()=>{
      loading.value = true
      try {
        await axios.get(`${proxy}/mypage/reservation/proceeding/${store.state.memberId}`,{
        headers: { Authorization: store.state.accessToken },
      }).then((res)=>{
           for(let i = 0; i<res.data.length;i++){
               resStatuses.value.push(res.data[i])
            }
      })
      } catch (error) {
        if (error.response.status < 500 && error.response.status >= 400) {
            alert("입력을 다시 확인해주세요.");
            router.go()
          } else if (error.response.status >= 500) {
            errorContent.value =
              "일시적인 서버장애 오류입니다 나중에 다시 확인해주세요";
          }
      }
      loading.value = false
      console.log(resStatuses.value)
    }
    getResStatuses()

    //예약 이력 띄우는 함수
    const getResDones = async()=>{
      try {
        await axios.get(`${proxy}/mypage/reservation/total/${store.state.memberId}`,{
        headers: { Authorization: store.state.accessToken },
      }).then((res)=>{
          for(let i = 0;i<res.data.length;i++){
                  resDone.value.push(res.data[i])
                  resDone.value[i].reviewToggle=false
                }
      })
      } catch (error) {
         if (error.response.status < 500 && error.response.status >= 400) {
            alert("입력을 다시 확인해주세요.");
            window.location.reload(true);
          } else if (error.response.status >= 500) {
            errorContetn1.value =
              "일시적인 서버장애 오류입니다 나중에 다시 확인해주세요";
          }
      }
      loading.value = false
      console.log(resDone.value)
    }
    getResDones()

    //get에러시 홈페이지로
     const errorHome = () => {
      errorContent.value = null;
      router.push({
        name: "Home",
      });
    };

    //get에러시 계속 호출
    const errorRef = () => {
      if(errorContent.value){
        errorContent.value = null;
        getResStatuses();
      }
      else if(errorContetn1.vaue){
        errorContetn1.value = null;
        getResDones()
      }
    };

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
    const cancelRes = async(resId)=>{
      let con = confirm('정말 취소하시겠습니까?')
      if(con==true){
        let url
        if(resId.type=='오피스'){
          url = `${proxy}/reservation/office-cancel/`
        } else{
          url=`${proxy}/reservation/desk-cancel/`
        }
        try {
        await axios.put(url+resId.reservationId,{
          headers: { Authorization: store.state.accessToken },
        }).then(res=>{
          if(res.status < 300 && res.status >= 200){
            alert('취소가 완료되었습니다')
            router.go()
          }
        })  
        } catch (error) {
          if (error.response.status < 500 && error.response.status >= 400) {
            alert("다시 확인해주세요.");
            router.go()
          } else if (error.response.status >= 500) {
            alert("일시적인 서버장애 오류입니다 나중에 다시 확인해주세요");
            router.go()
          }
        }
      }else{
        return
      }
    }

    const showPopup = ()=>{
      popup.value = true
    }

    //리뷰 작성 함수
    const writeReview=  (e)=>{
        let i=e
        find = resDone.value.find(e=>e.reservationId===i)
        console.log(find)
        if(find.status === '002'|| find.status ==='003'){
          alert('예약을 취소하시면 리뷰를 작성할 수 없습니다')
        }else if(find.status ==='004'){
          writePack.value.companyId = find.companyId 
          writePack.value.spaceId =  find.spaceId
          writePack.value.reservationId = find.reservationId
          reviewShow.value= !reviewShow.value
          editOrDel.value.edit = ''
          // editOrDel.value.id.rating = 0
        }
    }

    //모달 닫을 함수
    const closeModal = () => {
      reviewShow.value = false;
      showDelete.value = false
    };


    //예약 정보들 객체에 담긴 불린값(리뷰토글)을 이용해 각각의 버튼들을 리뷰 작성을 보기로 바꾸는 함수
    const reviewToggle = (e)=>{
      let i = e;
      find = resDone.value.find(e=>e.reservationId===i)
      find.reviewToggle = !find.reviewToggle
      console.log(find)
    }

    //마이리뷰에서 수정을 누르면 emit으로 수정할 리뷰에게 수정할 것이라고 알려주고 ReviewWrite컴포넌트에게 수정을 전달해줘서 수정페이지로 변환
    const showWrite=(todo)=>{
      if(todo ==='edit'){
        editOrDel.value.edit = todo

        console.log(todo)
        reviewShow.value = !reviewShow.value;
      }else{
        
        showDelete.value = true
      }
    }

    //자식 컴포넌트인 MyReview에서 리뷰 아이디 받아오기
    const showWrite2=(id)=>{
      editOrDel.value.id = id
    }
    
    //상세로 갈 함수
    const toCompany = (id)=>{
      router.push({
        name: "PlaceDetail",
        query: {
          id: id,
        },
      });
    }

    return {
      resStatus,
      resRecord,
      showResRecord,
      showResStatus, 
      resStatuses,
      resDone,
      writeReview,
      closeModal,
      reviewShow,
      reviewed,
      cancelRes,
      reviewToggle,
      myReview,
      showWrite,
      showWrite2,
      writePack,
      editOrDel,
      showDelete,
      loading,
errorHome,
errorRef,
errorContent,
errorContetn1,
popup,
showPopup,
toCompany,
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
.cancelBtn:hover{
  border: 1px solid gray;
  color: gray;
  transition:  0.2s;
}
.nShowReviewlBtn{
    margin-top: 8%;
    width: 70%;
    height: 6vh;
    background-color: #9E9E9E;
    border: 1px solid #9E9E9E;
    color:white;
    border-radius: 10px;
}
.showReviewlBtn{
   margin-top: 8%;
    width: 70%;
    height: 6vh;
   border: 1px solid #9E9E9E;
  background-color: #9E9E9E;
   color:white;
    border-radius: 10px;
}
.nShowReviewlBtn:hover{
  border: 1px solid #e1dfdf;
  /* background-color: #e1dfdf; */
  transition:  0.2s;
}
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: fit-content;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px ;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 0.4em;
  white-space:nowrap;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
.reviewsho{
 transition: 0.5s;
}
</style>