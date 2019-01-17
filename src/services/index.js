import api from '@utils/http';

export default class {
  // 用户注册
  static register = params => api.post('/api/register', params);

  // 用户登录
  static login = params => api.post('/api/login', params);

  // 获取用户信息
  static getUserInfo = params => api.get('/api/getUserInfo', params);

  // 获取个人主页信息
  static getHomePageInfo = params => api.get('/api/getHomePageInfo', params);

  // 修改个人主页信息  专业技能/教育背景/项目经验/获奖情况/兴趣爱好
  static updateHomePageInfo = params => api.post('/api/updateHomePageInfo', params);

  // 获取诗列表
  static getPoemList = params => api.get('/api/getPoemList', params);

  // 获取诗歌主题
  static getPoemThemes = params => api.get('/api/getPoemThemes', params);

  // 获取诗歌类型
  static getPoemTypes = params => api.get('/api/getPoemTypes', params);

  // 添加诗篇
  static addPoem = params => api.post('/api/addPoem', params);

  // 编辑诗篇
  static updatePoem = params => api.post('/api/updatePoem', params);

  // 添加诗篇
  static deletePoem = params => api.post('/api/deletePoem', params);

  // 查看照片墙身份验证
  static checkPhotoVerify = params => api.post('/api/checkPhotoVerify', params);

  // 获取个人介绍信息
  static getIntroduction = params => api.get('/api/getIntroduction', params);
}
