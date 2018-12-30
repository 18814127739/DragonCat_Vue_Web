import Vuex from 'vuex';
import Vue from 'vue';
import api from '@services';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    themeList: [],
    typeList: [],
  },
  actions: {
    async getThemeList({ commit }) {
      if (this.state.themeList.length < 1) {
        const list = await api.getPoemThemes();
        commit('setThemeList', list);
      }
    },
    async getTypeList({ commit }) {
      if (this.state.typeList.length < 1) {
        const list = await api.getPoemTypes();
        commit('setTypeList', list);
      }
    },
  },
  mutations: {
    setThemeList(state, data) {
      state.themeList = data;
    },
    setTypeList(state, data) {
      state.typeList = data;
    }
  }
});

export default store;