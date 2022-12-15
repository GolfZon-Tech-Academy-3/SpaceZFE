<template>
    <div>
        <nav class="nav">
            <div v-if="width > 400" class="logo" @click="moveTo('Home')">
                SPACEZ
            </div>
            <img v-else style="width: 35px;height: 35px;margin-left: 3%;cursor: pointer;" src="../assets/startLogo.png" @click="moveTo('Home')" />
            <input v-if="isLogined" id="searchInput" autocomplete="off" @focus="openSearchModal" @keyup.enter="moveToSearch" :value="searchWord" @input="searchModal"/>
            <div v-if="isMaster" style="cursor: pointer;margin: 0 1em;" @click="moveTo('MasterCompany')">
                master
            </div>
            <div v-if="isManager" style="cursor: pointer;margin: 0 1em;" @click="moveTo('ManageCompany')">
                manager
            </div>
            <div class="element" style="cursor: pointer;margin: 0 1em;" v-if="!isLogined" @click= "openLoginModal" >
                login
            </div>
            <div class="element" style="cursor: pointer;margin: 0 1em;" v-if="isLogined" @click="logout">
                logout
            </div>
            <img style="width:1.8em; height:1.8em;border-radius: 50%;margin: 0 1em;cursor: pointer;" v-if="isLogined" :src="profile_image" @click="moveTo('MyPage')"/>
        </nav>
        <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
        <SearchModal v-if="showSearchModal" @close="closeSearchModal" :result="result" />
    </div>
    
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import LoginModal from '@/components/LoginModal.vue';
import SearchModal from '@/components/SearchModal.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from '@/axios';
export default {
    components: {
        LoginModal,
        SearchModal,
    },
    setup() {
        const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
        const width = ref(0);
        const showSearchModal = ref(false);
        const showClose = ref(false);
        const searchWord = ref('');
        const router = useRouter();
        const store = useStore();
        const isLogined = ref(false);
        const isManager = ref(false);
        const isMaster = ref(false);
        const profile_image = store.state.profile;
        const result = ref([]);
        width.value = window.innerWidth;

        onMounted(() => {
            window.addEventListener('resize', handleResize);
        })

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        })

        if(store.state.authority == null) {
            isLogined.value = false;
        } else if(store.state.authority === 'manager') {
            isLogined.value = true;
            isManager.value = true;
        } else if(store.state.authority === 'master') {
            isLogined.value = true;
            isMaster.value = true;
        } else {
            isLogined.value = true;
        }
        
        const searchModal = async (event) => {
            searchWord.value = event.target.value;
            await axios.post(`${proxy}/company/total?page=1`,
                    {
                        date: null,
                        time: null,
                        location: searchWord.value,
                    },
                    {
                        headers: {
                            Authorization: store.state.accessToken
                        }
                    })
                        .then((res) => {
                            result.value = res.data.company;
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
            store.dispatch('initToken');
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
            store.dispatch('updateType', 'total');
            store.dispatch('updateDate', null);
            store.dispatch('updateTime', null);
            store.dispatch('updateWord', searchWord.value);
            router.push({
                name: 'FindPlace',
            });
        }

        const moveTo = (page) => {
            router.push({
                name: page,
            })
            closeSearchModal();
        }

        const handleResize = () => {
            width.value = window.innerWidth;
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
            moveTo,
            width,
        }
    }
}
</script>

<style scoped>
.nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3.75em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 0 10px 0 gray;
    background-color: white;
    z-index: 100;
}
.logo{
    font-family: Archivo;
    cursor: pointer;
    color: #041461;
    font-size: 2em;
    margin-left: 3%;
    margin-right: 3%;
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
#searchInput {
    width: 50%;
    font-size: 1.4em;
    color: grey;
    border: none;
    background-color: #EDEDED;
    border-radius: 1em;
    padding: 0.2em 1em;
    margin-left: 3%;
}
#searchInput:focus {
    outline: none;
}
.closeBtn {
    background-color: white;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
}
</style>