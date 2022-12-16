<template>
  <nav aria-label="Page navigation example" class="nav" v-if="currentPage">
    <ul class="pagination">
      <li>
        <button
          id="prev"
          :disabled="currentPage == 1"
          style="cursor: pointer"
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
      <li>
        <button
          id="next"
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
  <nav aria-label="Page navigation example" class="nav" v-else>
    <ul class="pagination">
      <li>
        <button
          id="prev"
          :disabled="limit / 5 == 1"
          style="cursor: pointer"
          :class="limit / 5 !== 1 ? 'show' : 'nshow'"
          @click="onClick('back')"
        >
          이전
        </button>
      </li>
      <li
        v-for="page in numberOfPages"
        :key="page"
        class="page-item"
        :class="limit / 5 === page ? 'active' : ''"
      >
        <a style="cursor: pointer" class="page-link" @click="onClick(page)">
          {{ page }}
        </a>
      </li>
      <li>
        <button
          id="next"
          style="cursor: pointer"
          :disabled="numberOfPages == limit / 5"
          :class="numberOfPages !== limit / 5 ? 'show' : 'nshow'"
          @click="onClick('go')"
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
    currentQnaPage: {
      type: Object,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
  },

  emits: ["click"],
  setup(props) {
    console.log(props.currentQnaPage);
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
