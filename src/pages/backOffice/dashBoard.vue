<template>
    <div style="display:flex">
        <MenuBar />
        <div class="content">
            <div class="status">
                <div class="reserved">
                    <div style="font-weight: bold;">
                        금일 예약 5 건
                    </div>
                </div>
                <div class="canceled">
                    <div style="font-weight: bold;">
                        금일 취소 예약 2 건
                    </div>
                </div>
            </div>

            <div class="calender">

            </div>

            <div class="memo">
                <div class="title">
                    관리 메모
                </div>
                <div class="memos">
                    <div v-for="num in 10" :key="num" class="one">
                        {{num}}
                    </div>
                </div>
            </div>
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
.status {
    width: 50%;
    height: 4em;
    margin: 1em auto;
}
.reserved {
    width: 40%;
    height: 100%;
    background-color:#EDF8E7;
    float: left;
    text-align: center;
    border-radius: 1em;
    display : flex;
    justify-content: center;
    align-items : center;
}
.canceled {
    width: 40%;
    height: 100%;
    background-color:#FCDDDD;
    float: right;
    text-align: center;
    border-radius: 1em;
    display : flex;
    justify-content: center;
    align-items : center;
}
.calender {
    width: 80%;
    height: 27em;
    background-color:#EDF8E7;
    margin: 2em auto;
}
.memo {
    width: 80%;
    height: 10em;
    margin: 3em auto;
}
.title {
    width: 100%;
    min-height: 20px;
    height: 25%;
    background-color:#F1EEEE;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;
    color: #6C6969;
    font-weight: bold;
    display : flex;
    justify-content: center;
    align-items : center;
}
.memos {
    width: 100%;
    height: 75%;
    background-color:#FFFCFC;
    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>