<template>
    <nav class="nav">
        <div class="menu">
            <router-link class="logo" :to="{name: 'Home'}">
                SpaceZ
            </router-link>

            
        </div>
        <ul class="elements">
            <li>
                <img class="searchIcon" src="../assets/searchIcon.png" />
            </li>
            <li>
                <router-link class="element" :to="{name: 'RegisterPlace'}">
                    장소 등록
                </router-link>
            </li>
            <li>
                <router-link class="element" :to="{name: 'ManagePlaceManager'}">장소 관리</router-link>
            </li>
            <li>
                <router-link class="element" :to="{name: 'ManagePlaceMaster'}">장소 관리</router-link>
            </li>
            <li>
                <span class="element" @click="openLoginModal">로그인</span>
            </li>
            <li>
                <span class="element" @click="logout">로그아웃</span>
            </li>
            <li>
                <router-link class="element" :to="{name: 'MyPage'}">마이페이지</router-link>
            </li>
            <li>
                <img style="width:1em; height:1em;" src="../assets/logo.png"/>
            </li>
        </ul>
    </nav>
    <LoginModal v-if="showLoginModal" @close="closeModal" />
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import LoginModal from '@/components/LoginModal.vue';
export default {
    components: {
        LoginModal,
    },
    setup() {
        const {emit} = getCurrentInstance();
        const closeModal = () => {
            showLoginModal.value = false;
        }

        const showLoginModal = ref(false);

        const openLoginModal = () => {
            showLoginModal.value = true;
        }

        const logout = () => {
            //구현 필요
            localStorage.removeItem("memberId");
            localStorage.removeItem("companyId");
            localStorage.removeItem("authority");
            window.location.reload(true);
        }

        return {
            showLoginModal,
            openLoginModal,
            closeModal,
            logout,
        }
    }
}
</script>

<style scoped>
.nav {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 0.5vh 0.5vw;
    border-bottom: 1px solid grey;
}
.menu {
    height: 100%;
}
.logo{
    font-size: 5vh;
    float:left;
    cursor: pointer;
    color: #041461;
    margin-left: 1em;
}
.logo:hover {
    color: rgb(63, 149, 184);
}
.searchIcon {
    width:1em;
    height:1em;
}
ul {
    list-style: none;
}
li {
    float: left;
    font-size: 1.5em;
    color: grey;
    cursor: pointer;
    margin-right: 1em;
}
a {
    text-decoration: none;
    color: grey;
}
a:hover {
    color: #041461;
}
.element:hover {
    color: #041461;
}
</style>