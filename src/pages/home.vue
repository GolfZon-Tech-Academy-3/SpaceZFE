<template>
    <div>
        <div class="wrapper">
            <h1 class="title">시작해보세요 사무 공간 임대</h1>
            <p>1인 데스크부터 20인 대형 사무실까지</p>
            <p>모두를 위한 임대 서비스</p>
            <img class="startLogo" src="../assets/startLogo.png" />
            <div style="font-family: Archivo;cursor: pointer;color: #041461;font-size: 2em;">
                SPACEZ
            </div>
            <div>
                <button class="button" @click="start">시작하기</button>
            </div>
        </div>
        <LoginModal v-if="showLoginModal" @close="closeModal" />
    </div>
  
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginModal from '@/components/LoginModal.vue';
export default {
    components: {
        LoginModal,
    },
    setup() {
        const showLoginModal = ref(false);
        const router = useRouter();
        const start = () => {
            if (localStorage.getItem("authority") != null) {
                router.push({
                    name: "Main",
                });
            } else {
                showLoginModal.value = true;
            }
        }

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
    text-align:center;
}
.startLogo {
    width: 150px;
}
.title {
    margin-top: 5em;
}
.button {
    border: none;
    background-color: transparent;
    font-weight: bold;
    cursor: pointer;
    font-size: 2em;
    margin: 1em;
}
.button:hover {
    color: grey;
}
</style>