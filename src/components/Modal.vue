<template>
  <div class="modal-wrapper">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="close-button">
          <button type="button" class="close">
            <span @click="onClose">&times;</span>
          </button>
        </div>
        <div class="modal-header">
          <div class="modal-title">
            <slot name="title"></slot>
          </div>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
export default {
  setup() {
    const { emit } = getCurrentInstance();
    const onClose = () => {
      emit('close');
    };

    return {
      onClose,
    }
  },
};
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
}
.modal-dialog {
  width: 25%;
  min-width: 300px;
  height: 70%;
  min-height: 500px;
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.close-button {
  width: 100%;
  height:10%;
}
.modal-content {
  width: 100%;
  text-align: center;
  background-color: white;
  border-radius: 2rem;
}
.modal-header {
  font-family: Archivo;
  color:#041461;
  width: 100%;
  height: 15%;
  font-size: 2em;
}
.modal-body {
  width: 100%;
  height: 60%;
}
.modal-footer {
  width: 100%;
  height: 25%;
}
.close {
  background-color: transparent;
  border: none;
  font-size:2em;
  float:right;
  margin: 0.2em;
  cursor: pointer;
}
.close:hover {
  color: grey;
}
</style>