<template>
    <nav class="nav">
        <div class="menu">
            <router-link class="logo" :to="{name: 'Home'} " @click="closeSearchModal">
                SpaceZ
            </router-link>

            
        </div>
        <input id="searchInput" @focus="openSearchModal" />
        <button v-if="showClose" class="closeBtn" @click="closeSearchModal">X</button>
        <ul class="elements">
            <!-- <li>
                <router-link class="element" :to="{name: 'RegisterPlace'}" @click="closeSearchModal">
                    장소 등록
                </router-link>
            </li>
            <li>
                <router-link class="element" :to="{name: 'ManagePlaceManager'}" @click="closeSearchModal">장소 관리</router-link>
            </li>
            <li>
                <router-link class="element" :to="{name: 'ManagePlaceMaster'}" @click="closeSearchModal">장소 관리</router-link>
            </li> -->
            <li>
                <span class="element" @click= "openLoginModal" >로그인</span>
            </li>
            <li>
                <span class="element" @click="logout">로그아웃</span>
            </li>
            <li>
                <router-link class="element" :to="{name: 'MyPage'}" @click="closeSearchModal">마이페이지</router-link>
            </li>
            <li>
                <img style="width:1em; height:1em;" src="../assets/logo.png" @click="closeSearchModal"/>
            </li>
        </ul>
    </nav>
    <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
    <SearchModal v-if="showSearchModal" />
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import LoginModal from '@/components/LoginModal.vue';
import SearchModal from '@/components/SearchModal.vue';

export default {
    components: {
        LoginModal,
        SearchModal,
    },
    setup() {
        const {emit} = getCurrentInstance();
        const showSearchModal = ref(false);
        const showClose = ref(false);

        const openSearchModal = () => {
            showSearchModal.value = true;
            showClose.value = true;
        }

        const closeSearchModal = () => {
            showSearchModal.value = false;
            showClose.value = false;
            let input = document.getElementById('searchInput');
            input.value = '';
        }

        const closeLoginModal = () => {
            showLoginModal.value = false;
        }

        const showLoginModal = ref(false);

        const openLoginModal = async () => {
            showSearchModal.value = false;
            showClose.value = false;
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
            closeLoginModal,
            logout,
            showSearchModal,
            openSearchModal,
            closeSearchModal,
            showClose,
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
    margin-left: 3em;
}
.logo:hover {
    color: rgb(63, 149, 184);
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
#searchInput {
    width: 10em;
    font-size: 1.4em;
    color: grey;
    border: none;
    background-color: #EDEDED;
    border-radius: 5vw;
    padding: 0.7% 2%;
}
#searchInput:focus {
    outline: none;
}
.element:hover {
    color: #041461;
}
.closeBtn {
    background-color: white;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
}
</style>