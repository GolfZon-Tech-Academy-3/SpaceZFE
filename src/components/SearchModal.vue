<template>
    <div class="wrapper" @click="closeModal">
        <div class="results">
            <div v-for="res in result" :key="res.companyId" class="result" @click="moveToPlaceDetail(res.companyId)">
                <div style="float:left">{{res.companyName}}</div>
                <div style="float:right">{{res.location}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
export default {
    props: {
        result: {
            type: Array,
            required: true,
        }
    },
    setup() {
        const { emit } = getCurrentInstance();
        const router = useRouter();

        const closeModal = () => {
            emit('close');
        }

        const moveToPlaceDetail = (companyId) => {
            router.push({
                name: 'PlaceDetail',
                params:{
                    id: companyId,
                }
            })
        }

        return {
            closeModal,
            moveToPlaceDetail,
        }
    }
}
</script>

<style scoped>
.wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0, 0, 0.5);
    z-index:  50;
}
@media (min-width: 950px) {
    .results {
        position: relative;
        width: 40%;
        height: auto;
        max-height: 90vh;
        background-color: white;
        z-index: 100;
        left: 28%;
        overflow:scroll;
        overflow-x:hidden;
        overflow-y:auto;
    }
}
@media (max-width: 950px) {
  .results {
    background-color: white;
  }
}
.result {
    height: 1em;
    padding:1em;
    cursor:pointer;
}
.result:hover {
    background-color: #EDEDED;
}
</style>