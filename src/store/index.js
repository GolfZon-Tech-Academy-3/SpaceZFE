import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    searchType: "total",
    searchDate: "",
    searchTime: "none",
    searchWord: "",
    // memberId: "",
    // authority: "",
    // token: "",
  },
  mutations: {
    // GET_MEMBERID(state, payload) {
    //   state.memberId = payload;
    // },
    // GET_AUTHORITY(state, payload) {
    //   state.authority = payload;
    // },
    // LOGOUT(state) {
    //   state.memberId = "";
    //   state.authority = "";
    // },
    // GET_TOKEN(state, payload) {
    //   state.token = payload;
    // },
    UPDATE_SEARCH_TYPE(state, payload) {
      state.searchType = payload;
    },
    UPDATE_SEARCH_DATE(state, payload) {
      state.searchDate = payload;
    },
    UPDATE_SEARCH_TIME(state, payload) {
      state.searchTime = payload;
    },
    UPDATE_SEARCH_WORD(state, payload) {
      state.searchWord = payload;
    },
  },
  actions: {
    updateType({ commit }, newType) {
      commit("UPDATE_SEARCH_TYPE", newType);
    },
    updateDate({ commit }, newDate) {
      commit("UPDATE_SEARCH_DATE", newDate);
    },
    updateTime({ commit }, newTime) {
      commit("UPDATE_SEARCH_TIME", newTime);
    },
    updateWord({ commit }, newWord) {
      commit("UPDATE_SEARCH_WORD", newWord);
    },
  },
  plugins: [createPersistedState()],
});
