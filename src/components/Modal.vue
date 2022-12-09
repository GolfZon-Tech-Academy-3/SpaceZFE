<template>
  <div class="modal-wrapper" @click="onClose">
    <div class="modal-dialog" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <slot name="title"></slot>
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
  z-index: 100;
}
.modal-dialog {
  width: 350px;
  height: 600px;
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modal-content {
  width: 100%;
  text-align: center;
  background-color: white;
  border-radius: 2em;
}
.modal-header {
  font-family: Archivo;
  color:#041461;
  width: 100%;
  height: 15%;
  font-size: 2em;
  margin-top: 1.5em;
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
  font-size:1.5em;
  float:right;
  margin: 0.2em;
  cursor: pointer;
}
</style>