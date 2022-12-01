<template>
    <div>
        <nav class="nav">
            <div class="menu">
                <router-link class="logo" :to="{name: 'Home'} ">
                    SPACEZ
                </router-link>
            </div>
            <input id="searchInput" autocomplete="off" @focus="openSearchModal" @keyup.enter="moveToSearch" :value="searchWord" @input="searchModal"/>
            <button v-if="showClose" class="closeBtn" @click="closeSearchModal">X</button>
            <ul class="elements">
                <li v-if="!isManager && !isMaster && isLogined" @click="controlMapModal">
                    지도
                </li>
                <li>
                    <router-link class="element" v-if="isMaster" :to="{name: 'MasterCompany'}" @click="closeSearchModal">마스터</router-link>
                </li>
                <li>
                    <router-link class="element" v-if="isManager" :to="{name: 'Dashboard'}" @click="closeSearchModal">매니저</router-link>
                </li>
                <li>
                    <span class="element" v-if="!isLogined" @click= "openLoginModal" >로그인</span>
                </li>
                <li>
                    <span class="element" v-if="isLogined" @click="logout">로그아웃</span>
                </li>
                <li>
                    <router-link class="element" :to="{name: 'MyPage'}" @click="closeSearchModal">마이페이지</router-link>
                </li>
                <li>
                    <img style="width:1.2em; height:1.2em;border-radius: 50%;" v-if="isLogined" :src="profile_image" @click="closeSearchModal"/>
                </li>
            </ul>
        </nav>
        <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
        <SearchModal v-if="showSearchModal" @close="closeSearchModal" :result="result" />
        <MapModal v-if="showMapModal" @close="controlMapModal" />
    </div>
    
</template>

<script>
import { ref } from 'vue';
import LoginModal from '@/components/LoginModal.vue';
import SearchModal from '@/components/SearchModal.vue';
import MapModal from '@/components/MapModal.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from '@/axios';
export default {
    components: {
        LoginModal,
        SearchModal,
        MapModal,
    },
    setup() {
        const showSearchModal = ref(false);
        const showMapModal = ref(false);
        const showClose = ref(false);
        const searchWord = ref('');
        const router = useRouter();
        const store = useStore();
        const isLogined = ref(false);
        const isManager = ref(false);
        const isMaster = ref(false);
        const profile_image = localStorage.getItem("profile_image");
        const result = ref([]);

        if(localStorage.getItem('authority') == null) {
            isLogined.value = false;
        } else if(localStorage.getItem('authority') === 'manager') {
            isLogined.value = true;
            isManager.value = true;
        } else if(localStorage.getItem('authority') === 'master') {
            isLogined.value = true;
            isMaster.value = true;
        } else {
            isLogined.value = true;
        }
        
        const searchModal = async (event) => {
            searchWord.value = event.target.value;
            await axios.post(`../../../company/total?page=1`,
                    {
                        date: null,
                        time: null,
                        location: searchWord.value,
                    },
                    {
                        headers: {
                            Authorization: localStorage.getItem('access_token')
                        }
                    })
                        .then((res) => {
                            result.value = res.data.company;
                            console.log(res.data.company);
                        })
        }

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

        const logout = async () => {
            localStorage.clear();
            isLogined.value = false;
            await router.push({
                name: 'Home'
            });
            window.location.reload(true);
        }

        const moveToSearch = async () => {
            showSearchModal.value = false;
            showClose.value = false;
            document.getElementById('searchInput').blur();
            store.dispatch('updatePage', 1);
            store.dispatch('updateType', 'total');
            store.dispatch('updateDate', null);
            store.dispatch('updateTime', null);
            store.dispatch('updateWord', searchWord.value);
            router.push({
                name: 'FindPlace',
            });
        }

        const controlMapModal = () => {
            showMapModal.value = !showMapModal.value;
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
            moveToSearch,
            searchWord,
            isLogined,
            isManager,
            isMaster,
            profile_image,
            searchModal,
            result,
            controlMapModal,
            showMapModal,
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
    font-family: Archivo;
    float:left;
    cursor: pointer;
    color: #041461;
    margin-left: 2em;
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