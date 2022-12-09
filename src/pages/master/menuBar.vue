<template>
    <div>
        <div class="wrapper">
            <div :class="[link === '/master/company' ? 'menuSelected' : 'menu']" @click="moveToCompany">
                <div style="text-decoration:none; color:white">
                    업체 관리
                </div>
            </div>
            <div :class="[link === '/master/account' ? 'menuSelected' : 'menu']" @click="moveToAccount">
                <div style="text-decoration:none; color:white">
                    계정 관리
                </div>
            </div>
        </div>
        <div class="fake">

        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter();
        const link =  window.location.pathname;

        const moveToCompany = () => {
            router.push({
                name: 'MasterCompany',
            })
        }

        const moveToAccount = () => {
            router.push({
                name: 'MasterAccount',
            })
        }

        return {
            moveToCompany,
            moveToAccount,
            link
        }
    }
}
</script>

<style scoped>
.wrapper {
    min-width: 200px;
    width: 15%;
    height: 100vh;
    background-color: #6F5EBE;
    text-align: center;
    position: fixed;
}
.fake {
    min-width: 200px;
    width: 15%;
    height: 100vh;
    background-color: #6F5EBE;
    text-align: center;
}
.menu {
    width: 100%;
    padding: 7% 0;
    color: white;
    font-weight: bold;
    font-size: 1.3em;
    text-decoration: none;
    cursor: pointer;
}
.menu:hover {
    background-color: #7D6EC4;
}
.menuSelected {
    width: 100%;
    color: white;
    font-weight: bold;
    font-size: 1.3em;
    padding: 7% 0;
    text-decoration: none;
    background-color: #7D6EC4;
    cursor: pointer;
}
</style>