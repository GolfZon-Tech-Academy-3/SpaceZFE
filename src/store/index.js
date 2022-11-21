import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

export default createStore({
    state: {
        currentPage: 1,
        searchType: 'all',
        searchDate: '',
        searchTime: '',
        searchWord: '',
    },
    mutations: {
        UPDATE_CURRENT_PAGE (state, payload) {
            state.currentPage = payload;
        },
        UPDATE_SEARCH_TYPE (state, payload) {
            state.searchType = payload;
        },
        UPDATE_SEARCH_DATE (state, payload) {
            state.searchDate = payload;
        },
        UPDATE_SEARCH_TIME (state, payload) {
            state.searchTime = payload;
        },
        UPDATE_SEARCH_WORD (state, payload) {
            state.searchWord = payload;
        },
    },
    actions: {
        updatePage({ commit }, newPage) {
            commit('UPDATE_CURRENT_PAGE', newPage);
        },
        updateType({ commit }, newType) {
            commit('UPDATE_SEARCH_TYPE', newType);
        },
        updateDate({ commit }, newDate) {
            commit('UPDATE_SEARCH_DATE', newDate);
        },
        updateTime({ commit }, newTime) {
            commit('UPDATE_SEARCH_TIME', newTime);
        },
        updateWord({ commit }, newWord) {
            commit('UPDATE_SEARCH_WORD', newWord);
        },
    },
    plugins: [
        createPersistedState()
    ]
});