<template>
  <div class="wrapper">
    <h1 class="title">시작해보세요 사무 공간 임대</h1>
    <p>1인 데스크부터 20인 대형 사무실까지</p>
    <p>모두를 위한 임대 서비스</p>
    <img class="startLogo" src="../assets/startLogo.png" />
    <div>
        <button class="button" @click="start">시작하기</button>
    </div>
  </div>
  <LoginModal v-if="showLoginModal" @close="closeModal" />
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import LoginModal from '@/components/LoginModal.vue';
export default {
    components: {
        LoginModal,
    },
    setup() {
        const showLoginModal = ref(false);
        const start = () => {
            if (localStorage.getItem("memberId")) {
                router.push({
                    name: "Main",
                });
            } else {
                showLoginModal.value = true;
            }
        }

        const { emit } = getCurrentInstance();
        const closeModal = () => {
            showLoginModal.value = false;
        }

        return {
            showLoginModal,
            start,
            closeModal,
        }
    }
}
</script>

<style scoped>
.wrapper {
    width: 100%;
    height: 80vh;
    text-align:center;
}
.startLogo {
    width: 15em;
}
.title {
    margin-top: 20vh;
}
.button {
    border: none;
    background-color: transparent;
    font-weight: bold;
    cursor: pointer;
    font-size: 2em;
}
.button:hover {
    color: grey;
}
</style>