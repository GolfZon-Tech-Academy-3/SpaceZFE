<template>
  <div class="modal-wrapper">
    <div class="modal-dialog">
      <div class="modal-content">
        <button type="button" class="close">
          <span @click="onClose">&times;</span>
        </button>
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
import { getCurrentInstance } from "vue";
export default {
  setup() {
    const { emit } = getCurrentInstance();
    const onClose = () => {
      emit("close");
    };

    return {
      onClose,
    };
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
  width: 40%;
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
  height: 10%;
}
.modal-content {
  width: 100%;
  text-align: left;
  background-color: white;
}
.modal-header {
  font-family: Archivo;
  color: #041461;
  width: 100%;
  height: 10%;
  font-size: 2em;
  border-bottom: 1px solid rgb(224, 224, 224);
}
.modal-body {
  width: 96%;
  height: 60%;
  padding: 2%;
}
.modal-footer {
  width: 100%;
  height: 25%;
}
.close {
  background-color: transparent;
  border: none;
  font-size: 2em;
  float: right;
  margin: 0.2em;
  cursor: pointer;
}
@media all and (max-width: 768px) {
  .modal-title {
    font-size: 0.7em;
  }
  li {
    font-size: 1em;
  }
  .modal-dialog {
    width: 40%;
    min-width: 300px;
    height: 50%;
    min-height: 100%;
    display: flex;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .close > span {
    font-size: 0.9em;
  }
}
</style>
