<template>
    <div style="display:flex">
        <MenuBar />
        <div class="content">
            테스트
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
    background-color:azure;
    overflow:scroll;
    overflow-x: hidden;
    overflow-y: auto;
    text-align: center;
}
</style>