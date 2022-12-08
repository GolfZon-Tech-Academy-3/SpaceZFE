<template>
  <div style="width : 400px;height : 600px;margin: 0 auto;">
    <h2 style="width: 100%;">회원가입</h2>
      <div style="width: 400px;height: 600px;margin: 0 auto;">
          <div style="width: 100%">
            이메일
          </div>
          <div style="width: 100%;margin-bottom: 1em;">
            <input :disabled="emailOK" class="input" type="text" placeholder="이메일" v-model="email">
            <button :disabled="emailOK" class="button" @click="sendCertification">인증번호 보내기</button>
          </div>
          <div style="width: 100%">
            인증번호
          </div>
          <div style="width: 100%;margin-bottom: 1em;">
            <input :disabled="certificationOK" class="input" type="text" placeholder="인증번호 입력" v-model="certificationNum">
            <button :disabled="certificationOK" class="button" @click="checkCertificationNum">확인</button>
          </div>
          <div style="width: 100%;">
            비밀번호
          </div>
          <div style="width: 100%;margin-bottom: 1em;">
            <input class="input" type="password" placeholder="비밀번호 입력" v-model="pw">
          </div>
          <div style="width: 100%;margin-bottom: 1em;">
            <input class="input" type="password" placeholder="비밀번호 재입력" v-model="pwCheck">
          </div>
          <div style="width: 100%;">
            닉네임
          </div>
          <div style="width: 100%;margin-bottom: 1em;">
            <input :disabled="nicknameOK" class="input" type="text" placeholder="닉네임 입력" v-model="nickname">
            <button :disabled="nicknameOK" class="button" @click="checkNickName">중복확인</button>
          </div>
          <div style="text-align: center;">
            <button class="submit" @click="signUp">회원가입 하기</button>
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
.button {
  padding: 1em;
  background-color: #041461;
  color: white;
  border: none;
  border-radius: 2em;
  margin-left: 1em;
  cursor: pointer;
}
.input {
  width: 60%;
  border: 1px solid white;
  border-bottom: 1px solid gray;
  padding: 1em;
}
.input:focus {
  outline: none;
  border-bottom: 1px solid black;
}
.submit {
  width: 70%;
  padding: 1em;
  margin: 1em 0;
  background-color: #041461;
  color: white;
  border: none;
  border-radius: 2em;
  cursor: pointer;
}
</style>