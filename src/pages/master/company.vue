<template>
    <div style="display:flex">
        <MenuBar />
        <div class="content">
            마스터 컴패니
        </div>
    </div>
</template>

<script>
import MenuBar from './menuBar.vue';
export default {
    components: {
        MenuBar,
    }
}
</script>

<style scoped>
.content {
    width: 85%;
    height:100vh;
    overflow:scroll;
    overflow-x: hidden;
    overflow-y: auto;
    text-align: center;
}
</style>