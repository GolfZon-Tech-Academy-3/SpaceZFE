<template>
  <div class="wrapper">
    <div class="deco">
      <img class="signUpLogo" src="../assets/signUpLogo.png" />
    </div>
    <div class="signUp">
      <div style="height: 10%;">
        <h2>회원가입</h2>
      </div>
      <div class="signUpForm">
        <div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 1vh);">
            <span>
              이메일
            </span>
          </div>
        
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 4vh);">
            <input :disabled="emailOK" class="input" type="text" placeholder="이메일" v-model="email">
            <button :disabled="emailOK" class="button" @click="sendCertification">인증번호 보내기</button>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 12vh);">
            <span>
              인증번호
            </span>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 15vh);">
            <input :disabled="certificationOK" class="input" type="text" placeholder="인증번호 입력" v-model="certificationNum">
            <button :disabled="certificationOK" class="button" @click="checkCertificationNum">확인</button>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 23vh);">
            <span>
              비밀번호
            </span>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 26vh);">
            <input class="input" type="password" placeholder="비밀번호 입력" v-model="pw">
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 33vh);">
            <input class="input" type="password" placeholder="비밀번호 재입력" v-model="pwCheck">
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 40vh);">
            <span>
              닉네임
            </span>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 43vh);">
            <input :disabled="nicknameOK" class="input" type="text" placeholder="닉네임 입력" v-model="nickname">
            <button :disabled="nicknameOK" class="button" @click="checkNickName">중복확인</button>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 50vh);">
            <button type="submit" class="submit" @click="signUp">회원가입 하기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from '@/axios';
import { useRouter } from 'vue-router';
export default {
  setup() {
    const router = useRouter();
    const email = ref('');
    const emailOK = ref(false);
    const certificationNum = ref();
    const certificationOK = ref(false);
    const pw = ref('');
    const pwCheck = ref('');
    const nickname = ref('');
    const nicknameOK = ref(false);

    const email_check = (email) => {
      var regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      return (email != '' && email != 'undefined' && regex.test(email));
    }

    const sendCertification = async () => {
      if(!email_check(email.value)) {
        alert('올바른 이메일 형식이 아닙니다');
      } else {
        try {
          await axios.post('member/mail', {email: email.value})
          .then(
            (res) => {
              console.log(res.data);
              localStorage.setItem('certificationNum', res.data);
              emailOK.value = true;
            }
          )
        } catch (error) {
          alert('사용 불가능한 아이디입니다');
        }
        
      }
    }

    const checkCertificationNum = () => {
      if(localStorage.getItem('certificationNum') === certificationNum.value) {
        alert('인증되었습니다');
        certificationOK.value = true;
        localStorage.removeItem('certificationNum');
      }
    }
    
    const checkNickName = async () => {
      if(nickname.value.length < 2) {
        alert('닉네임은 두 글자 이상 입력해야합니다');
      } else {
        await axios.post('member/name-check', {memberName: nickname.value})
          .then(
            (res) => {
              if(res.data === 1) {
                alert('사용 가능한 닉네임입니다');
                nicknameOK.value = true;
              } else {
                alert('사용 불가능한 닉네임입니다');
              }
            }
          )
      }
    }

    const pw_check = (pw) => {
      var regex=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return (pw != '' && pw != 'undefined' && regex.test(pw));
    }

    const signUp = async () => {
      if(localStorage.getItem('authority') != null) {
        alert('로그인 상태에서 회원가입할 수 없습니다');
      } else if(!emailOK.value) {
        alert('인증되지 않은 이메일입니다');
      } else if(!certificationOK.value) {
        alert('인증번호 인증을 해주세요');
      } else if(!pw_check(pw.value)) {
        alert('비밀번호는 최소 8자이며, 최소 하나의 문자와 하나의 숫자로 이루어져야합니다');
      } else if(pw.value !== pwCheck.value) {
        alert('비밀번호가 일치하지 않습니다');
      } else if(!nicknameOK.value) {
        alert('닉네임 중복확인을 해주세요');
      } else {
        await axios.post('member/signup', 
          {authority: "member", email: email.value, memberName: nickname.value, password: pw.value})
            .then(
              (res) => {
                alert(res.data);
                router.push({
                  name: 'Home'
                })
              }
            )
      }
    }

    return {
      email,
      emailOK,
      sendCertification,
      checkCertificationNum,
      certificationNum,
      certificationOK,
      nickname,
      checkNickName,
      signUp,
      nicknameOK,
      pw,
      pwCheck,
    }
  }
}
</script>

<style scoped>
.wrapper {
  width : 100%;
  height : 95vh;
  
}
.deco {
  width: 50%;
  height: 100%;
  background-color: #041461;
  text-align: center;
  display : flex;
  justify-content: center;
  align-items : center;
  float: left;
}
@media (max-width: 1000px) {
  .deco {
    display: none;
  }
}
.signUpLogo {
  width: 50vh;
}
.signUp {
  width: 50%;
  height: 100%;
  background-color: transparent;
  float: left;
}
.signUpForm {
  height: 90%;
}
h2 {
  color:#041461;
  float: left;
  padding-left: 5%;
}
.title {
  height: 10%;
  display : flex;
  justify-content: center;
  align-items : center;
}
.button {
  padding: 3%;
  background-color: #041461;
  color: white;
  border: none;
  border-radius: 2em;
  margin-left: 3%;
  cursor: pointer;
}
.button:hover {
  background-color: skyblue;
}
.input {
  width: 60%;
  border: 1px solid white;
  border-bottom: 1px solid gray;
  padding: 3%;
}
.input:focus {
  outline: none;
  border-bottom: 1px solid black;
}
.submit {
  width: 70%;
  padding: 3%;
  margin-top: 10%;
  background-color: #041461;
  color: white;
  border: none;
  border-radius: 2em;
  cursor: pointer;
}
.submit:hover {
  background-color: skyblue;
}
</style>