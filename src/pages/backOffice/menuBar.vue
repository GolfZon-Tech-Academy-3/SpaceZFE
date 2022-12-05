<template>
    <div class="wrapper">
        <div :class="[link === '/backoffice/reservationstatus' ? 'menuSelected' : 'menu']" @click="moveToReservationStatus">
            <div style="text-decoration:none; color:white">
                예약 현황
            </div>
        </div>
        <div :class="[link === '/backoffice/manageplace' ? 'menuSelected' : 'menu']" @click="moveToManagePlace">
            <div style="text-decoration:none; color:white">
                공간 정보/수정
            </div>
        </div>
        <div :class="[link === '/backoffice/qna' ? 'menuSelected' : 'menu']" @click="moveToQna">
            <div style="text-decoration:none; color:white">
                문의
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter();
        const link =  window.location.pathname;
        const moveToReservationStatus = () => {router.push({name:'ReservationStatus'})}
        const moveToManagePlace = () => {router.push({name: 'ManagePlace'})}
        const moveToQna = () => {router.push({name: 'Qna'})}

        return {
            moveToReservationStatus,
            moveToManagePlace,
            moveToQna,
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
    cursor: pointer;
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
    cursor: pointer;
}
</style>