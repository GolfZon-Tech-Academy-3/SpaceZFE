<template>
  <Modal>
    <template v-slot:title> SPACEZ </template>
    <template v-slot:body>
      <div class="loginform">
        <input
          class="email"
          v-model="email"
          type="email"
          placeholder="이메일"
          @keyup.enter="login"
        />
        <input
          class="password"
          v-model="pw"
          type="password"
          placeholder="비밀번호"
          @keyup.enter="login"
        />
        <button type="button" class="login" @click="login">로그인</button>
      </div>
    </template>
    <template v-slot:footer>
      <span>
        <span style="font-family: Archivo; color: #041461">SPACEZ</span> 가
        처음이신가요?
      </span>
      <br />
      <router-link class="submit" :to="{ name: 'SignUp' }" @click="onClose">
        회원가입
      </router-link>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/Modal.vue";
import { ref, getCurrentInstance } from "vue";
import axios from "@/axios";
import { useStore } from "vuex";
export default {
  components: {
    Modal,
  },
  setup() {
    const proxy = window.location.hostname === "localhost" ? "" : "/proxy";
    const { emit } = getCurrentInstance();
    const store = useStore();
    const email = ref("");
    const pw = ref("");

    const onClose = () => {
      emit("close");
    };

    //이메일 형식 확인
    const email_check = (email) => {
      var regex =
        /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      return email != "" && email != "undefined" && regex.test(email);
    };

    const parseJwt = (token) => {
      try {
        return JSON.parse(
          decodeURIComponent(escape(atob(token.split(".")[1])))
        );
      } catch (e) {
        return null;
      }
    };

    //로그인
    const login = async () => {
      if (!email_check(email.value)) {
        alert("올바른 이메일 형식이 아닙니다");
      } else if (pw.value === "") {
        alert("비밀번호를 입력해주세요");
      } else {
        try {
          await axios
            .post(`${proxy}/member/login`, {
              email: email.value,
              password: pw.value,
            })
            .then((res) => {
              if (res.data === "") {
                store.dispatch("setMemberEmail", email.value);
                store.dispatch("setMemberPw", pw.value);
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
                store.dispatch("setAccessToken", res.headers.authorization);
                onClose();
                window.location.reload(true);
              }
            });
        } catch (error) {
          console.log(error);
          alert("로그인 정보가 알맞지 않습니다");
        }
      }
    };

    return {
      onClose,
      email,
      pw,
      login,
    };
  },
};
</script>

<style scoped>
.email {
  width: 50%;
  margin: 5%;
  border: 1px solid white;
  border-bottom: 1px solid gray;
  padding: 1em;
}
.password {
  width: 50%;
  margin: 5%;
  border: 1px solid white;
  border-bottom: 1px solid gray;
  padding: 1em;
}
.login {
  width: 50%;
  margin: 5%;
  background-color: #041461;
  border: none;
  color: white;
  padding: 1em;
  border-radius: 1em;
  cursor: pointer;
}
.submit {
  color: grey;
  text-decoration: none;
}
</style>
