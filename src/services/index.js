import api from '@utils/http';

export default class {
  // 用户注册
  static register = params => api.post('/api/register', params);

  // 用户登录
  static login = params => api.post('/api/login', params);

  // 获取用户信息
  static getUserInfo = params => api.get('/api/getUserInfo', params);

  // 获取诗列表
  static getPoemList = params => api.get('/api/getPoemList', params);

  // 获取诗歌主题
  static getPoemThemes = params => api.get('/api/getPoemThemes', params);

  // 获取诗歌类型
  static getPoemTypes = params => api.get('/api/getPoemTypes', params);

  // 添加诗篇
  static addPoem = params => api.post('/api/addPoem', params);

  // 编辑诗篇
  static editPoem = params => api.post('/api/editPoem', params);

  // 添加诗篇
  static deletePoem = params => api.post('/api/deletePoem', params);

  // 查看照片墙身份验证
  static checkPhotoVerify = params => api.post('/api/checkPhotoVerify', params);

  // 获取个人介绍信息
  static getIntroduction = params => api.get('/api/getIntroduction', params);
}
