<template>
  <ErrorHandle
    :show="!!errorContent"
    title="Error"
    @home="errorHome"
    @refresh="errorRef"
  >
    <p>{{ errorContent }}</p>
  </ErrorHandle>
  <Spinner v-if="loading" />
  <div style="height: auto; overflow: hidden; display: flex; min-height: 400px">
    <div class="sideBar">
      <p>
        <button class="btn" @click="myShow" v-show="!my">
          <img src="@/assets/myprof.png" class="sideImg" />프로필 정보
        </button>
      </p>
      <p>
        <button
          class="btn"
          style="background: rgba(114, 118, 197, 0.24); border-radius: 15px"
          v-show="my"
        >
          <img src="@/assets/myprof.png" class="sideImg" />프로필 정보
        </button>
      </p>
      <p>
        <button class="btn" @click="milShow" v-show="mil">
          <img src="@/assets/mil.png" class="sideImg" />마일리지 조회
        </button>
      </p>
      <p>
        <button
          class="btn"
          style="background: rgba(114, 118, 197, 0.24); border-radius: 15px"
          v-show="!mil"
        >
          <img src="@/assets/mil.png" class="sideImg" />마일리지 조회
        </button>
      </p>
      <p>
        <button class="btn" @click="resShow" v-show="res">
          <img src="@/assets/myres.png" class="sideImg" />나의 예약 정보
        </button>
      </p>
      <p>
        <button
          class="btn"
          style="background: rgba(114, 118, 197, 0.24); border-radius: 15px"
          v-show="!res"
        >
          <img src="@/assets/myres.png" class="sideImg" />나의 예약 정보
        </button>
      </p>
      <p>
        <button class="btn" @click="qnaShow" v-show="qna">
          <img src="@/assets/qna.png" class="sideImg" />문의 내용 확인
        </button>
      </p>
      <p>
        <button
          class="btn"
          style="background: rgba(114, 118, 197, 0.24); border-radius: 15px"
          v-show="!qna"
        >
          <img src="@/assets/qna.png" class="sideImg" />문의 내용 확인
        </button>
      </p>
    </div>

    <div v-show="my" class="form">
      <h1 v-show="editProf" style="margin-bottom: 2%; font-weight: 700">
        프로필 정보
      </h1>
      <h1 v-show="!editProf" style="margin-bottom: 2%; font-weight: 700">
        프로필 수정
      </h1>
      <div class="board">
        <img
          v-show="imgSelect"
          :src="profImg"
          class="profile"
          style="margin-bottom: 5%"
        />
        <img
          v-show="!imgSelect"
          :src="uploadImg"
          class="profile"
          style="margin-bottom: 5%"
        />
        <div v-show="!editProf">
          <label for="file">
            <div class="uploadBtn">사진 변경</div>
          </label>
          <input @change="onFileSelected" type="file" name="file" id="file" />
        </div>
        <h3 style="text-align: left; font-weight: 800">상세정보</h3>

        <table style="width: 100%">
          <tr style="width: 100%; padding-top: 3%">
            <td style="text-align: left; color: #9e9e9e; margin-right: 65vw">
              이메일
            </td>
            <td style="text-align: right">{{ useEmail }}</td>
          </tr>
          <tr style="width: 100%; padding-top: 3%">
            <td style="text-align: left; color: #9e9e9e; margin-right: 65vw">
              닉네임
            </td>
            <td v-show="editProf" style="text-align: right">{{ userNick }}</td>
            <td v-show="!editProf" style="text-align: right">
              <input
                class="nickInput"
                type="text"
                :placeholder="userNick"
                v-model="nick"
              />
              <button class="nickBtn" @click="duplCheck">중복확인</button>
              <p v-show="dupleNick" style="font-size: 1rem; color: red">
                이미 사용중인 아이디입니다
              </p>
              <p
                v-show="nDupleNick"
                style="font-size: 1rem; color: rgb(4, 20, 97, 1)"
              >
                사용가능한 아이디입니다
              </p>
              <p
                v-show="nickNull"
                style="font-size: 1rem; color: rgb(4, 20, 97, 1)"
              >
                아이디를 입력해주세요
              </p>
            </td>
          </tr>
        </table>
        <button v-show="editProf" class="profEdit" @click="profileEdit">
          프로필 편집
        </button>
        <button v-show="!editProf" class="profEdit" @click="profEditPut">
          수정 완료</button
        ><br />

        <button v-show="!editProf" class="editCancle" @click="profileEdit">
          수정 취소
        </button>
      </div>
    </div>

    <div v-show="!mil" class="otherForm">
      <Mileage />
    </div>
    <div v-show="!res" class="otherForm">
      <MyResVue />
    </div>
    <div v-show="!qna" class="otherForm">
      <QNA />
    </div>
  </div>
</template>

<script>
import ErrorHandle from "@/components/UI/BaseDialog.vue";
import Spinner from "@/components/UI/Spinner.vue";
import Mileage from "@/components/myPage/Mileage.vue";
import MyResVue from "@/components/myPage/MyRes.vue";
import QNA from "@/components/myPage/QNA.vue";

import { ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const proxy = window.location.hostname === "localhost" ? "" : "/proxy";

export default {
  components: {
    ErrorHandle,
    Spinner,
    Mileage,
    MyResVue,
    QNA,
  },
  setup() {
    const my = ref(true);
    const mil = ref(true);
    const res = ref(true);
    const qna = ref(true);

    const editProf = ref(true);

    const dupleNick = ref(false);
    const nDupleNick = ref(false);
    const dupleDone = ref(false);
    const nickNull = ref(false);
    const nick = ref("");

    const uploadImg = ref("");
    const imgSelect = ref(true);
    const File = ref("");
    const router = useRouter();
    const store = useStore();

    const errorContent = ref(null);
    const loading = ref(false);

    const token = store.state.accessToken;

    //토큰디코더
    const parseJwt = (token) => {
      try {
        return JSON.parse(
          decodeURIComponent(escape(atob(token.split(".")[1])))
        );
      } catch (e) {
        return null;
      }
    };

    const profImg = ref(store.state.profile);
    const useEmail = ref(parseJwt(token).USER_EMAIL);
    const userNick = ref(parseJwt(token).NICK_NAME);

    //프로필 수정으로 바꾸기
    const profileEdit = () => {
      editProf.value = !editProf.value;
    };

    //프로필 수정 put쏘기
    const profEditPut = async () => {
      loading.value = true;
      const formData = new FormData();
      formData.append("memberId", parseInt(store.state.memberId));
      formData.append("memberName", nick.value);
      formData.append("multipartFile", File.value);
      if (nick.value === "" && File.value === "") {
        return;
      } else if (nick.value === "" && dupleNick.value == false) {
        alert("닉네임중복 확인 해주세요");
        nick.value = "";
      } else {
        try {
          await axios
            .put(`${proxy}/member/profile`, formData, {
              headers: {
                Authorization: store.state.accessToken,
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.status < 300 && res.status >= 200) {
                store.dispatch("refreshToken").then(async () => {
                  try {
                    await axios
                      .post(`${proxy}/member/login`, {
                        email: store.state.memberEmail,
                        password: store.state.memberPw,
                      })
                      .then((res) => {
                        if (res.status < 300 && res.status >= 200) {
                          store.dispatch(
                            "setMemberId",
                            parseJwt(res.headers.authorization).MEMBER_ID
                          );
                          store.dispatch(
                            "setAuthority",
                            parseJwt(res.headers.authorization).AUTHORITY
                          );
                          store.dispatch(
                            "setProfile",
                            parseJwt(res.headers.authorization).IMAGE_NAME
                          );
                          store.dispatch(
                            "setCompanyId",
                            parseJwt(res.headers.authorization).COMPANY_ID
                          );
                          store.dispatch(
                            "setAccessToken",
                            res.headers.authorization
                          );
                          alert("프로필 변경이 성공하였습니다.");
                          router.go();
                        }
                      });
                  } catch (error) {
                    console.log(error);
                    alert("프로필 변경이 실패했습니다");
                    router.go();
                    return;
                  }
                });
              }
            });
        } catch (error) {
          if (error.response.status < 500 && error.response.status >= 400) {
            alert("입력을 다시 확인해주세요.");
            router.go();
          } else if (error.response.status >= 500) {
            errorContent.value =
              "일시적인 서버장애 오류입니다 나중에 다시 확인해주세요";
          }
        }
      }
      loading.value = false;
    };

    //get에러시 홈페이지로
    const errorHome = () => {
      errorContent.value = null;
      router.push({
        name: "Home",
      });
    };

    //get에러시 계속 호출
    const errorRef = () => {
      errorContent.value = null;
      profEditPut();
    };

    //프로필 바뀐거로 미리 보여주는 함수
    const onFileSelected = (e) => {
      uploadImg.value = URL.createObjectURL(e.target.files[0]);
      File.value = e.target.files[0];
      imgSelect.value = false;
    };

    //각각의 컴포넌트들 보여주는 함수
    const myShow = () => {
      my.value = !my.value;
      mil.value = true;
      res.value = true;
      qna.value = true;
    };
    const milShow = () => {
      mil.value = !mil.value;
      my.value = false;
      res.value = true;
      qna.value = true;
    };
    const resShow = () => {
      res.value = !res.value;
      my.value = false;
      mil.value = true;
      qna.value = true;
    };
    const qnaShow = () => {
      qna.value = !qna.value;
      my.value = false;
      res.value = true;
      mil.value = true;
    };

    //프로필 닉넴 바꿀때 쓰는 중복조회
    const duplCheck = async () => {
      if (nick.value === "") {
        nickNull.value = true;
      } else {
        nickNull.value = false;
        dupleNick.value = false;
        nDupleNick.value = false;
        await axios
          .post(`${proxy}member/name-check`, { memberName: nick.value })
          .then((res) => {
            if (res.data == 0) {
              dupleNick.value = true;
              nDupleNick.value = false;
              nick.value = "";
            } else {
              dupleNick.value = false;
              nDupleNick.value = true;
              dupleDone.value = true;
            }
          });
      }
    };

    return {
      imgSelect,
      my,
      mil,
      res,
      qna,
      token,
      File,
      profImg,
      useEmail,
      userNick,
      uploadImg,
      myShow,
      milShow,
      resShow,
      qnaShow,
      profileEdit,
      editProf,
      duplCheck,
      dupleNick,
      nDupleNick,
      dupleDone,
      nick,
      onFileSelected,
      nickNull,
      profEditPut,
      errorContent,
      loading,
      errorHome,
      errorRef,
    };
  },
};
</script>

<style scoped>
.sideBar {
  width: 15%;
  height: 75vh;
  float: left;
  background-color: #eeeff5;
  border-radius: 15px;
  padding-top: 0.5%;
}
.btn {
  font-family: "Inter";
  font-style: normal;
  font-weight: 800;
  font-size: 1.4rem;
  text-align: left;
  width: 100%;
  color: #7276c5;
  border-radius: 15px;
  border: 1px solid #eeeff5;
  height: 8vh;
  margin-bottom: 1%;
}
.btn:hover {
  background: rgba(114, 118, 197, 0.24);
  border-radius: 15px;
}
.sideImg {
  margin-right: 5%;
  width: 2.5vw;
  height: 4vh;
}
p {
  margin: 0;
}
.form {
  width: 85%;
  float: right;
  text-align: center;
  padding-top: 4%;
  padding-bottom: 5%;
}
.otherForm {
  width: 85%;
  float: right;
  text-align: center;
  overflow: hidden;
  height: auto;
  padding-bottom: 5%;
}
.board {
  margin: auto;
  width: 33vw;
  left: 50vw;
  border: 1px solid gray;
  border-radius: 15px;
  padding: 2%4%2%4%;
}
td {
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 1.2rem;
  padding-top: 4%;
}
.profile {
  min-width: 9vw;
  min-height: 19vh;
  max-width: 10vw;
  max-height: 20vh;
  border-radius: 90%;
}
.profEdit {
  margin-top: 10%;
  width: 60%;
  height: 6vh;
  font-family: "Inter";
  font-weight: 700;
  font-size: 1.2rem;
  border-radius: 10px;
  border: 1px solid white;
  color: #adadad;
}
.editCancle {
  background: white;
  border: 1px solid white;
  color: red;
}
.profEdit:hover {
  color: black;
}
#file {
  display: none;
}
.uploadBtn {
  width: 7vw;
  border: 1px solid gray;
  border-radius: 15px;
  padding: 2%;
}
.nickInput {
  width: 45%;
  height: 5vh;
  margin-right: 2%;
  border-radius: 10px;
  border: 1px solid gray;
  opacity: 0.6;
  padding-left: 3%;
}
.nickBtn {
  width: 25%;
  /* height: 4.5vh; */
  font-size: 1rem;
  color: gray;
  border-radius: 10px;
  border: 1px solid gray;
  background-color: white;
  opacity: 0.6;
  padding: 1% 0% 1% 0%;
}
</style>
