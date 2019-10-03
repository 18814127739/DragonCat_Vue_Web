import api from '@utils/http';

// 获取诗列表
const getPoemList = params => api.get('/api/getPoemList', params);

// 获取诗歌主题
const getPoemThemes = params => api.get('/api/getPoemThemes', params);

// 获取诗歌类型
const getPoemTypes = params => api.get('/api/getPoemTypes', params);

// 添加诗篇
const addPoem = params => api.post('/api/addPoem', params);

// 编辑诗篇
const updatePoem = params => api.post('/api/updatePoem', params);

// 添加诗篇
const deletePoem = params => api.post('/api/deletePoem', params);

export default {
  getPoemList,
  getPoemThemes,
  getPoemTypes,
  addPoem,
  updatePoem,
  deletePoem,
}