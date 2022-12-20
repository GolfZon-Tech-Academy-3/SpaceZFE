<template>
    <div class="wrapper" @click="closeModal">
        <div style="width: 100%; height: 3.75em;" />
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
                query:{
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
    position: fixed;
    width: 100%;
    height: 100%;
    background-color:rgba(0, 0, 0, 0.5);
    z-index:  49;
}
@media (min-width: 950px) {
    .results {
        position: relative;
        width: 22.6%;
        height: auto;
        max-height: 90vh;
        background-color: white;
        z-index: 100;
        overflow:scroll;
        overflow-x:hidden;
        overflow-y:auto;
        margin: 0 auto;
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
</style>