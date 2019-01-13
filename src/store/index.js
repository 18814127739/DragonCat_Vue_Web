import Vuex from 'vuex';
import Vue from 'vue';
import api from '@services';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLogin: false,
    userReqStatus: -1, // 用户信息请求状态  -1:未请求，0:请求中 1:已请求 2:请求失败
    userInfo: {},
    themeList: [], // 诗歌主题数据
    typeList: [], // 诗歌类型数据
  },
  actions: {
    async getUserInfo({ commit }) {
      try {
        const res = await api.getUserInfo();
        commit('userInfoSuccess', { isLogin: true, userInfo: res.userInfo });
        return true;
      } catch {
        commit('userInfoFail');
        return false;
      }
    },
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
      state.userReqStatus = 1;
      state.userInfo = data.userInfo;
    },
    userInfoFail(state) {
      state.userReqStatus = 2;
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