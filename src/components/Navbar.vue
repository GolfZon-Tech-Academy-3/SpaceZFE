<template>
    <div>
        <nav class="nav">
            <div class="logo" @click="moveTo('Home')">
                SPACEZ
            </div>
            <input v-if="isLogined" id="searchInput" autocomplete="off" @focus="openSearchModal" @keyup.enter="moveToSearch" :value="searchWord" @input="searchModal"/>
            <div v-if="!isManager && !isMaster && isLogined" style="cursor: pointer;margin: 0 1em;" @click="controlMapModal">
                map
            </div>
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
        <MapModal v-if="showMapModal" @close="controlMapModal" />
        <Toast v-if="showToast" :message="toastMessage" />
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
            await axios.post(`/company/total?page=1`,
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

        const controlMapModal = () => {
            if(showMapModal.value === false) {
                triggerToast('지도를 닫으려면 회색 영역을 더블클릭');
            }
            showMapModal.value = !showMapModal.value;
        }

        const moveTo = (page) => {
            router.push({
                name: page,
            })
            closeSearchModal();
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
            moveTo,
            toastMessage,
            showToast,
            triggerToast,
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
    margin-left: 1em;
    margin-right:21%;
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
    width: 10em;
    font-size: 1.4em;
    color: grey;
    border: none;
    background-color: #EDEDED;
    border-radius: 1em;
    padding: 0.2em 1em;
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