import api from '@utils/http';

// 用户注册
const register = params => api.post('/api/register', params);

// 用户登录
const login = params => api.post('/api/login', params);

// 获取用户信息
const getUserInfo = params => api.get('/api/getUserInfo', params);

export default {
  register,
  login,
  getUserInfo,
}