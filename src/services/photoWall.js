import api from '@utils/http';

// 获取照片墙信息
const getPhotoWallInfo = params => api.get('/api/getPhotoWallInfo', params);

// 修改照片墙信息
const updatePhotoWallInfo = params => api.post('/api/updatePhotoWallInfo', params);

// 清空照片
const clearPhotos = params => api.post('/api/clearPhotos', params);

// 查看照片墙身份验证
const checkPhotoVerify = params => api.post('/api/checkPhotoVerify', params);

export default {
  getPhotoWallInfo,
  updatePhotoWallInfo,
  clearPhotos,
  checkPhotoVerify,
}