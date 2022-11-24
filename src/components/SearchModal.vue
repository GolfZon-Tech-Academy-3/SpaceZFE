<template>
    <div class="wrapper">
        <div class="results">
            <div class="result">
                용인
            </div>
            <div class="result">
                용인
            </div>
            <div class="result">
                용인
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.wrapper {
    position: fixed;
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
        max-height: 40vh;
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
    padding:2%;
    cursor:pointer;
}
</style>