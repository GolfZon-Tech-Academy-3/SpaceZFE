<template>
  <nav aria-label="Page navigation example" class="nav">
    <ul class="pagination">
      <!-- v-show="currentPage !== 1" -->
      <li>
        <button
          style="cursor: pointer"
          :disabled="currentPage == 1"
          :class="currentPage !== 1 ? 'show' : 'nshow'"
          @click="onClick(currentPage - 1)"
        >
          이전
        </button>
      </li>
      <li
        v-for="page in numberOfPages"
        :key="page"
        class="page-item"
        :class="currentPage === page ? 'active' : ''"
      >
        <a style="cursor: pointer" class="page-link" @click="onClick(page)">
          {{ page }}
        </a>
      </li>
      <!--  v-show="numberOfPages !== currentPage" class="page-item" -->
      <li>
        <button
          style="cursor: pointer"
          :disabled="numberOfPages == currentPage"
          :class="numberOfPages !== currentPage ? 'show' : 'nshow'"
          @click="onClick(currentPage + 1)"
        >
          다음
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { getCurrentInstance } from "vue";
export default {
  props: {
    numberOfPages: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
  },

  emits: ["click"],
  setup() {
    const { emit } = getCurrentInstance();
    const onClick = (page) => {
      emit("click", page);
    };
    return {
      onClick,
    };
  },
};
</script>

<style scoped>
.nav {
  display: grid;
}
ul {
  width: 100%;
  display: inline-flex;
  list-style: none;
}
li {
  margin: 0%2%0%2%;
}
.active {
  color: blue;
}
.show {
  background: white;
  border: 1px solid white;
  font-size: 0.8em;
}
.nshow {
  background: white;
  border: 1px solid white;
  font-size: 0.8em;
  opacity: 0.5;
}
</style>
