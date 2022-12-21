<template>
    <div class="wrapper" @click="closeModal">
        <div class="modal-back" @click.stop>
            <textarea disabled :value="qna.inquiries" maxlength="500" style="width: 96%; height: 45%;resize:none;outline:none;background-color:#F5F7F8;border:none;padding: 2%;border-radius: 1em;">
            </textarea>
            <div style="width: 100%; height: 6%;">
                <button v-if="qna.isAnswer" class="btn" @click.stop="modifyAnswer(qna.inquiryId)">답변 수정</button>
                <button v-if="qna.isAnswer" class="btn" @click.stop="deleteAnswer(qna.inquiryId)">답변 삭제</button>
                <button v-else class="btn" @click.stop="registerAnswer(qna.inquiryId)">답변 등록</button>
            </div>
            <textarea placeholder="답변하려면 클릭" id="answer" v-model="qna.answers" maxlength="500" style="width: 96%; height: 45%;resize:none;outline:none;background-color:#F5F7F8;border:none;padding: 2%;border-radius: 1em;">
            </textarea>
        </div>
    </div>
</template>

<script>
import { ref, watch, getCurrentInstance } from 'vue';
import axios from '@/axios';
import { useStore } from 'vuex';
export default {
    props: {
        qna: {
            type: Object,
            required: true,
        }
    },
    setup() {
        const proxy = window.location.hostname === 'localhost' ? '' : '/proxy';
        const store = useStore();
        const { emit } = getCurrentInstance();

        const closeModal = () => {
            emit('close');
        }
        
        const deleteAnswer = async (inquiryId) => {
            if(confirm("답변을 삭제하시겠습니까?")) {
                try {
                    await axios.put(`${proxy}/inquiry/answer/delete/${inquiryId}`, null,
                        {
                            headers: {
                                Authorization: store.state.accessToken,
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
                    await axios.put(`${proxy}/inquiry/answer/${inquiryId}`, {
                        answers: answer.value,
                    },
                    {
                        headers: {
                            Authorization: store.state.accessToken,
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
                    await axios.put(`${proxy}/inquiry/answer/${inquiryId}`, {
                        answers: answer.value,
                    },
                    {
                        headers: {
                            Authorization: store.state.accessToken,
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
    min-width: 320px;
    height: 60%;
    min-height: 600px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    font-weight: bold;
    border-radius: 1em;
}
.close {
    border: none;
    background-color: white;
    float: right;
    cursor: pointer;
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