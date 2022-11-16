<template>
  <Modal>
    <template v-slot:title>
      SpaceZ
    </template>
    <template v-slot:body>
      <div class="loginform">
        <input
          class="email"
          v-model="email"
          type="email"
          placeholder="이메일"
        />
        <input
          class="password"
          v-model="pw"
          type="password"
          placeholder="비밀번호"
        />
        <button type="button" class="login" @click="login">
          로그인
        </button>
      </div>
    </template>
    <template v-slot:footer>
      <span>
        <b><i>SpaceZ</i></b> 가 처음이신가요?
        </span>
        <br />
        <router-link class="submit" :to="{ name: 'SignUp' }" @click="onClose">
          회원가입
        </router-link>
    </template>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import { getCurrentInstance } from 'vue';
export default {
  components: {
    Modal,
  },
  setup() {
    const { emit } = getCurrentInstance();
    const onClose = () => {
      emit('close');
    }

    return {
      onClose
    }
  }
}
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
  color:white;
  padding: 1em;
  border-radius: 1em;
}
.login:hover {
  background-color: rgb(63, 149, 184);
}
.submit {
  color: grey;
  text-decoration: none;
}
</style>