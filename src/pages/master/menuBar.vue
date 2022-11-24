<template>
    <div class="wrapper">
        <div :class="[link === '/master/company' ? 'menuSelected' : 'menu']">
            <router-link style="text-decoration:none; color:white" :to="{name: 'MasterCompany'}">
                업체 관리
            </router-link>
        </div>
        <div :class="[link === '/master/account' ? 'menuSelected' : 'menu']">
            <router-link style="text-decoration:none; color:white" :to="{name: 'MasterAccount'}">
                계정 관리
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    setup() {
        const link =  window.location.pathname;

        return {
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
}
.menu {
    width: 100%;
    padding: 7% 0;
    color: white;
    font-weight: bold;
    font-size: 1.3em;
    text-decoration: none;
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
}
</style>