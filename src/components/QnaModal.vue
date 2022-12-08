<template>
    <div class="wrapper">
        <div class="modal-back">
            <div style="width: 100%; height: 1.7em;">
                <button class="close" @click="closeModal">X</button>
            </div>
            <div class="question">
                {{qna.inquiries}}
            </div>
            <div style="width: 90%; height: 10%;margin: auto;">
                <button v-if="qna.isAnswer" class="btn" @click="modifyAnswer(qna.inquiryId)">답변 수정</button>
                <button v-if="qna.isAnswer" class="btn" @click="deleteAnswer(qna.inquiryId)">답변 삭제</button>
                <button v-else class="btn" @click="registerAnswer(qna.inquiryId)">답변 등록</button>
            </div>
            <div class="answer">
                <textarea id="answer" v-model="qna.answers" maxlength="500" style="width: 96%; height: 88%;padding:2%;resize:none;outline:none;background-color:#F5F7F8;border:none;border-radius: 1em;">
                </textarea>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, getCurrentInstance } from 'vue';
import axios from '@/axios';
export default {
    props: {
        qna: {
            type: Object,
            required: true,
        }
    },
    setup() {
        const { emit } = getCurrentInstance();

        const closeModal = () => {
            emit('close');
        }
        
        const deleteAnswer = async (inquiryId) => {
            if(confirm("답변을 삭제하시겠습니까?")) {
                try {
                    await axios.put(`/inquiry/answer/delete/${inquiryId}`,
                        {
                            headers: {
                                Authorization: localStorage.getItem('access_token'),
                            }
                        }).then((res) => {console.log(res.data);})
                    alert('답변이 삭제되었습니다');
                } catch (error) {
                    alert('error');
                }
            }
        }

        const modifyAnswer = async (inquiryId) => {
            if(confirm("답변을 수정하시겠습니까?")) {
                var answer = document.getElementById('answer');
                if(answer.value.length < 3) {
                    alert('답변은 세 글자 이상 입력되어야합니다');
                    return
                }
                try {
                    await axios.put(`/inquiry/answer/${inquiryId}`, {
                        answers: answer.value,
                    },
                    {
                        headers: {
                            Authorization: localStorage.getItem('access_token'),
                        }
                    })
                    alert('답변이 수정되었습니다');
                } catch (error) {
                    alert('error');
                }
            }
        }

        const registerAnswer = async (inquiryId) => {
            if(confirm("답변을 등록하시겠습니까?")) {
                var answer = document.getElementById('answer');
                if(answer.value.length < 3) {
                    alert('답변은 세 글자 이상 입력되어야합니다');
                    return
                }
                try {
                    await axios.put(`/inquiry/answer/${inquiryId}`, {
                        answers: answer.value,
                    },
                    {
                        headers: {
                            Authorization: localStorage.getItem('access_token'),
                        }
                    })
                    alert('답변이 등록되었습니다');
                } catch (error) {
                    alert('error');
                }
                
            }
        }

        return {
            closeModal,
            modifyAnswer,
            deleteAnswer,
            registerAnswer,
        }
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
    margin-left: 1em;
}
</style>