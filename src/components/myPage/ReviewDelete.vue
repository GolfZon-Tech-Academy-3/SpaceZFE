// eslint-disable-next-line
<template>
  <div class="modal-wrapper">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title"></div>
          <button type="button" class="close">
            <span @click="onClose">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="ment">정말 삭제 하시겠습니까?</p>
          <button class="deleteBtn" @click="remove">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {
    const remove = () => {
      onClose();
    };

    const onClose = () => {
      emit("close");
    };

    return {
      onClose,
      remove,
    };
  },
};
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-title {
  padding-left: 160px;
  font-size: 40px;
}
.modal-header {
  height: 70px;
  border-bottom: 1px solid white;
}

.modal-content {
  height: 300px;
  text-align: center;
  border-radius: 20px;
}
.close {
  margin: 0;
}
.ment {
  margin-top: 5%;
  font-size: 30px;
}
.deleteBtn {
  font-size: 20px;
  margin-top: 20px;
  width: 100px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid blue;
  background: blue;
  color: white;
}
.logoutBtn:hover {
  border: 1px solid white;
  background: white;
  color: blue;
}
</style>
