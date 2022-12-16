<template>
  <div>
    <span v-if="!showMenuBar" @click="controlMenuBar" style="cursor: pointer;" class="material-symbols-outlined">
      menu
    </span>
    <div v-else style="width: 100%;height: 100%;display:flex;">
      <span style="cursor: pointer;" class="material-symbols-outlined">
        menu
      </span>
      <div class="wrapper">
        <div :class="[link === '/master/company' ? 'menuSelected' : 'menu']" @click="moveTo('MasterCompany')" >
          <div style="text-decoration: none; color: white">업체 관리</div>
        </div>
        <div :class="[link === '/master/account' ? 'menuSelected' : 'menu']" @click="moveTo('MasterAccount')" >
          <div style="text-decoration: none; color: white">계정 관리</div>
        </div>
        <div :class="[link === '/master/masterchat' ? 'menuSelected' : 'menu']" @click="moveTo('MasterChat')" >
          <div style="text-decoration: none; color: white">마스터 문의</div>
        </div>
      </div>
      <div @click="controlMenuBar" style="position: fixed;left:200px;width: calc(100vw - 200px);height: calc(100vh - 3.75em)" />
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
  background-color: #6f5ebe;
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
  background-color: #7d6ec4;
}
.menuSelected {
  width: 100%;
  color: white;
  font-weight: bold;
  font-size: 1.3em;
  padding: 7% 0;
  text-decoration: none;
  background-color: #7d6ec4;
  cursor: pointer;
}
.material-symbols-outlined {
  padding: 0.5em;
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48
}
.material-symbols-outlined:hover {
  padding: 0.5em;
  background-color: rgb(190, 190, 190);
  border-radius: 50%;
}
</style>
