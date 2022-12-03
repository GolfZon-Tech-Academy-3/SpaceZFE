// eslint-disable-next-line
<template>
  <Modal>
    <template v-slot:title>
      <div class="modal-title"><b>이용안내</b></div>
    </template>
    <template v-slot:body>
      <div class="modal-body">
        <p style="font-size: 1.4rem; margin-bottom: 1%; margin-left: 3%">
          기본정보
        </p>
        <ul class="basicInfo">
          <li>
            {{ details.type }}
            <a v-show="details.type == '오피스'">(일별계산)</a>
            <a v-show="details.type != '오피스'">(시간별계산)</a>
          </li>
          <li>
            <p>
              영업시간 : {{ details.openTime }}시 ~ {{ details.closeTime }}시
            </p>
          </li>
          <li>
            <p>
              청소시간 : {{ details.breakOpen }}시 ~ {{ details.breakClose }}시
            </p>
          </li>
        </ul>
        <hr style="opacity: 0.5" />

        <p style="font-size: 1.4rem; margin-bottom: 1%; margin-left: 3%">
          편의시설
        </p>
        <ul class="basicInfo">
          <li>
            {{ details.facilities }}
          </li>
        </ul>
        <hr style="opacity: 0.5" />
        <p style="font-size: 1.4rem; margin-bottom: 1%; margin-left: 3%">
          결제정보
        </p>
        <ul class="basicInfo">
          <li v-show="details.type == '오피스'">
            후불결제 : 예약등록한 카드로 마지막 이용일에 결제 처리가 됩니다.
          </li>
          <li v-show="details.type != '오피스'">
            선결제: 결제 금액의 5%가 적립
          </li>
          <li v-show="details.type != '오피스'">
            보증금 결제: 전체 금액의 20%만 결제 하되 이용 후 마이페이지에서 남은
            금액을 결제 가능.
          </li>
        </ul>
        <hr style="opacity: 0.5" />
      </div>
    </template>
    <template v-slot:footer> </template>
  </Modal>
</template>

<script>
import Modal from "@/components/BigModal.vue";
export default {
  components: {
    Modal,
  },
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
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
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-title {
  padding-left: 5%;
  padding-top: 2%;
  font-size: 1.5rem;
  text-align: left;
}
.modal-header {
  height: 70px;
}
.basicInfo {
  padding-left: 5%;
  opacity: 0.5;
  margin: 1%2%5%2%;
}
.modal-content {
  height: fit-content;
  /* text-align: center; */
}
.close {
  margin: 0;
}
li {
  font-size: 1.2rem;
}
</style>
