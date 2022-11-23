<template>
    <div class="wrapper">
        <div :class="[link === '/backoffice/dashboard' ? 'menuSelected' : 'menu']">
            <router-link style="text-decoration:none; color:white" :to="{name: 'Dashboard'}">
                대시보드
            </router-link>
        </div>
        <div :class="[link === '/backoffice/reservationstatus' ? 'menuSelected' : 'menu']">
            <router-link style="text-decoration:none; color:white" :to="{name: 'ReservationStatus'}">
                예약 현황
            </router-link>
        </div>
        <div :class="[link === '/backoffice/manageplace' ? 'menuSelected' : 'menu']">
            <router-link style="text-decoration:none; color:white" :to="{name: 'ManagePlace'}">
                공간 정보/수정
            </router-link>
        </div>
        <div :class="[link === '/backoffice/payment' ? 'menuSelected' : 'menu']">
            <router-link style="text-decoration:none; color:white" :to="{name: 'Payment'}">
                결제
            </router-link>
        </div>
        <div :class="[link === '/backoffice/qna' ? 'menuSelected' : 'menu']">
            <router-link style="text-decoration:none; color:white" :to="{name: 'Qna'}">
                문의
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
    background-color: #041461;
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
    background-color: #4B5170;
}
.menuSelected {
    width: 100%;
    color: white;
    font-weight: bold;
    font-size: 1.3em;
    padding: 7% 0;
    text-decoration: none;
    background-color: #4B5170;
}
</style>