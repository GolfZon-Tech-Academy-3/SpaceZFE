<template>
    <div>
        <nav class="nav">
            <router-link v-if="width > 500" class="logo" :to="isLogined ? {name: 'Main'} : {name: 'Home'}">
                SPACEZ
            </router-link>
            <router-link v-else :to="isLogined ? {name: 'Main'} : {name: 'Home'}" style="margin-left: 3%;">
                <img src="../assets/startLogo.png" @click="closeSearchModal" style="width: 35px;height: 35px;cursor: pointer;" />
            </router-link>
            <input v-if="isLogined && width > 355" placeholder="검색" id="searchInput" autocomplete="off" @focus="openSearchModal" @keyup.enter="moveToSearch" :value="searchWord" @input="searchModal"/>
            <div class="element" v-if="!isManager && !isMaster && isLogined" @click="controlMapModal">
                map
            </div>
            <router-link v-if="isMaster" class="element" :to="{name: 'MasterCompany'}" @click="closeSearchModal">
                master
            </router-link>
            <router-link v-if="isManager" class="element" :to="{name: 'ManageCompany'}" @click="closeSearchModal">
                manager
            </router-link>
            <div class="element" v-if="!isLogined" @click= "openLoginModal" >
                login
            </div>
            <router-link class="element" v-if="isLogined" :to="{name: 'Home'}" @click="logout">
                logout
            </router-link>
            <router-link v-if="isLogined" :to="{name: 'MyPage'}" style="margin: 0 1em;" @click="closeSearchModal">
                <img style="width:1.8em; height:1.8em;border-radius: 50%;cursor: pointer;" :src="profile_image"/>
            </router-link>
        </nav>
        <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
        <SearchModal v-if="showSearchModal" @close="closeSearchModal" :result="result" />
        <MapModal v-if="showMapModal" @close="controlMapModal" />
        <Toast v-if="showToast" :message="toastMessage" />
    </div>
    
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import LoginModal from '@/components/LoginModal.vue';
import SearchModal from '@/components/SearchModal.vue';
import MapModal from '@/components/MapModal.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from '@/axios';
import Toast from '@/components/Toast.vue'
import { useToast } from '@/composables/toast';
export default {
    components: {
        LoginModal,
        SearchModal,
        MapModal,
        Toast,
    },
    setup() {
        const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
        const width = ref(0);
        const showSearchModal = ref(false);
        const showMapModal = ref(false);
        const showClose = ref(false);
        const searchWord = ref('');
        const router = useRouter();
        const store = useStore();
        const isLogined = ref(false);
        const isManager = ref(false);
        const isMaster = ref(false);
        const profile_image = store.state.profile;
        const result = ref([]);
        const {
            toastMessage, showToast, triggerToast,
        } = useToast();

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

        const logout = () => {
            store.dispatch('initToken');
            isLogined.value = false;
                router.push({name: 'Home'});
            setTimeout(() => {
                window.location.reload();
            }, 500);
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

        const controlMapModal = () => {
            if(showMapModal.value === false) {
                triggerToast('지도를 닫으려면 더블클릭');
            }
            showMapModal.value = !showMapModal.value;
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
            showMapModal,
            moveToSearch,
            searchWord,
            isLogined,
            isManager,
            isMaster,
            profile_image,
            searchModal,
            result,
            width,
            toastMessage,
            showToast,
            triggerToast,
            controlMapModal,
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
@media (min-width: 780px) {
    #searchInput {
        position: fixed;
        width: 20%;
        font-size: 1em;
        border: none;
        box-shadow: 0 0 5px 0 gray;
        background-color: #EDEDED;
        border-radius: 1em;
        left: 38.7%;
        padding: 0.4em 1.3%;
    }
    .logo{
        font-family: Archivo;
        cursor: pointer;
        color: #041461;
        font-size: 2em;
        margin-left: 3%;
        margin-right: 50%;
    }
}
@media (max-width: 779px) {
    #searchInput {
        width: 50%;
        font-size: 1em;
        border: none;
        box-shadow: 0 0 5px 0 gray;
        background-color: #EDEDED;
        border-radius: 1em;
        padding: 0.4em 1.3%;
        margin-left: 3%;
    }
    .logo{
        font-family: Archivo;
        cursor: pointer;
        color: #041461;
        font-size: 2em;
        margin-left: 3%;
        margin-right: 3%;
    }
}
#searchInput:hover {
    background-color: rgb(190, 190, 190);
}
.closeBtn {
    background-color: white;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
}
a {
    color: black;
}
.element {
    cursor: pointer;margin: 0 1em;
    padding: 0.5em;
}
.element:hover {
    cursor: pointer;
    margin: 0 1em;
    background-color: rgb(190, 190, 190);
    padding: 0.5em;
    border-radius: 1em;
}
</style>
