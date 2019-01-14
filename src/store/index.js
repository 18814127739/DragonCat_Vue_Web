import Vuex from 'vuex';
import Vue from 'vue';
import api from '@services';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLogin: false,
    userInfo: {},
    themeList: [], // 诗歌主题数据
    typeList: [], // 诗歌类型数据
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
    userInfoSuccess(state, data) {
      state.isLogin = data.isLogin;
      state.userInfo = data.userInfo;
    },
    setThemeList(state, data) {
      state.themeList = data;
    },
    setTypeList(state, data) {
      state.typeList = data;
    }
  }
});

export default store;