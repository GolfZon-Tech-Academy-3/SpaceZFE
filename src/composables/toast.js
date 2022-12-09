import { ref, onUnmounted } from 'vue';
export const useToast = () => {
    const toastMessage = ref('');
    const showToast = ref(false); 
    const timeout = ref(null);
    const triggerToast = (message) => {
          toastMessage.value = message;
          showToast.value = true;
          timeout.value = setTimeout(() => {
            toastMessage.value = '';
            showToast.value = false;
          }, 2000)
        }

    onUnmounted(() => {
        clearTimeout(timeout.value);
    })
    return {
        toastMessage,
        showToast,
        triggerToast
    }
}