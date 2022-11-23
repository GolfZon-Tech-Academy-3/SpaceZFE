<template>
    <div class="wrapper">
        <div class="modal-back">
            <div style="width: 100%; height: 1.7em;">
                <button class="close">X</button>
            </div>
            <div class="question">
                현재 대학교에서 영상
            </div>
            <div style="width: 90%; height: 10%;margin: auto;">
                <button class="btn">답변 달기</button>
                <button class="btn">답변 수정</button>
            </div>
            <div class="answer">
                <div style="width: 90%; height: 90%; padding: 1em;margin: auto">
                    안됩니다
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, getCurrentInstance } from 'vue';
export default {
    props: {
        space: {
            type: Object,
            required: true,
        }
    },
    setup() {
    }
}
</script>

<style scoped>
.wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
}
.modal-back {
    width: 70%;
    min-width: 700px;
    height: 60%;
    min-height: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    font-weight: bold;
}
.close {
    border: none;
    background-color: white;
    float: right;
    cursor: pointer;
}
.question {
    width: 90%;
    height: 40%;
    margin: auto;
    color: #858589;
}
.answer {
    width: 90%;
    height: 40%;
    margin: auto;
    color: #858589;
    background-color: #F1EEEE;
    border-radius: 1em;
}
.btn {
    padding: 1% 3%;
    background-color: #041461;
    color: white;
    border: none;
    border-radius: 2em;
    cursor: pointer;
    float: right;
}
.btn:hover {
    background-color: skyblue;
}
</style>