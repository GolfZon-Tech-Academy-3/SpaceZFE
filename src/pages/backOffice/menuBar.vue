<template>
  <div>
    <span v-if="!showMenuBar" @click="controlMenuBar" style="position:fixed;margin: 0.5em;cursor: pointer;" class="material-symbols-outlined">
      menu
    </span>
    <div v-else class="wrapper">
      <div :class="[ link === '/backoffice/managecompany' ? 'menuSelected' : 'menu', ]" @click="moveTo('ManageCompany')" >
        <div style="text-decoration: none; color: white">장소 정보/수정</div>
      </div>
      <div :class="[ link === '/backoffice/reservationstatus' ? 'menuSelected' : 'menu', ]" @click="moveTo('ReservationStatus')" >
        <div style="text-decoration: none; color: white">예약 현황</div>
      </div>
      <div :class="[link === '/backoffice/manageplace' ? 'menuSelected' : 'menu']" @click="moveTo('ManagePlace')" >
        <div style="text-decoration: none; color: white">공간 정보/수정</div>
      </div>
      <div :class="[link === '/backoffice/qna' ? 'menuSelected' : 'menu']" @click="moveTo('Qna')" >
        <div style="text-decoration: none; color: white">문의</div>
      </div>
      <div :class="[link === '/backoffice/managerchat' ? 'menuSelected' : 'menu']" @click="moveTo('ManagerChat')" >
        <div style="text-decoration: none; color: white">마스터 문의</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const link = window.location.pathname;
    const showMenuBar = ref(false);

    const moveTo = (link) => {
      showMenuBar.value = !showMenuBar.value;
      router.push({
        name: link,
      });
    };

    const controlMenuBar = () => {
      showMenuBar.value = !showMenuBar.value;
    }

    return {
      moveTo,
      controlMenuBar,
      showMenuBar,
      link,
    };
  },
};
</script>

<style scoped>
.wrapper {
  width: 200px;
  height: calc(100vh - 3.75em);
  background-color: #041461;
  text-align: center;
  position: fixed;
  z-index: 75;
}
.menu {
  width: 100%;
  padding: 7% 0;
  color: white;
  font-weight: bold;
  font-size: 1.3em;
  text-decoration: none;
  cursor: pointer;
}
.menu:hover {
  background-color: #4b5170;
}
.menuSelected {
  width: 100%;
  color: white;
  font-weight: bold;
  font-size: 1.3em;
  padding: 7% 0;
  text-decoration: none;
  background-color: #4b5170;
  cursor: pointer;
}
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48
}
</style>
