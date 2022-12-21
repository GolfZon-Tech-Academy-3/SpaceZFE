import { ref, onUnmounted } from 'vue';
export const useToast = () => {
    const toastMessage = ref('');
    const showToast = ref(false); 
    const timeout = ref(null);

    //토스트 실행
    const triggerToast = (message) => {
          toastMessage.value = message;
          showToast.value = true;
          timeout.value = setTimeout(() => {
            toastMessage.value = '';
            showToast.value = false;
          }, 2000)
        }

    onUnmounted(() => {
        //타임 아웃 삭제
        clearTimeout(timeout.value);
    })
    return {
        toastMessage,
        showToast,
        triggerToast
    }
}