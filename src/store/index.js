import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    searchType: "total",
    searchDate: "",
    searchTime: "none",
    searchWord: "",
    memberId: null,
    companyId: null,
    authority: null,
    profile: null,
    accessToken: null,
    memberEmail: null,
    memberPw: null,
  },
  mutations: {
    SET_MEMBER_ID(state, payload) {
      state.memberId = payload;
    },
    SET_COMPANY_ID(state, payload) {
      state.companyId = payload;
    },
    SET_MEMBER_MAIL(state, payload) {
      state.memberEmail = payload;
    },
    SET_MEMBER_PW(state, payload) {
      state.memberPw = payload;
    },
    SET_AUTHORITY(state, payload) {
      state.authority = payload;
    },
    SET_PROFILE(state, payload) {
      state.profile = payload;
    },
    SET_ACCESS_TOKEN(state, payload) {
      state.accessToken = payload;
    },
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
    setMemberId({ commit }, memberId) {
      commit("SET_MEMBER_ID", memberId);
    },
    setMemberEmail({ commit }, memberEmail) {
      commit("SET_MEMBER_MAIL", memberEmail);
    },
    setMemberPw({ commit }, memberPw) {
      commit("SET_MEMBER_PW", memberPw);
    },
    setCompanyId({ commit }, companyId) {
      commit("SET_COMPANY_ID", companyId);
    },
    setAuthority({ commit }, authority) {
      commit("SET_AUTHORITY", authority);
    },
    setProfile({ commit }, profile) {
      commit("SET_PROFILE", profile);
    },
    setAccessToken({ commit }, accessToken) {
      commit("SET_ACCESS_TOKEN", accessToken);
    },
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
    initToken({ commit }) {
      commit("SET_MEMBER_ID", null);
      commit("SET_COMPANY_ID", null);
      commit("SET_AUTHORITY", null);
      commit("SET_PROFILE", null);
      commit("SET_ACCESS_TOKEN", null);
      commit("SET_MEMBER_MAIL", null);
      commit("SET_MEMBER_PW", null);
    },
    refreshToken({ commit }) {
      commit("SET_MEMBER_ID", null);
      commit("SET_COMPANY_ID", null);
      commit("SET_AUTHORITY", null);
      commit("SET_PROFILE", null);
      commit("SET_ACCESS_TOKEN", null);
    },
  },
  plugins: [createPersistedState()],
});
