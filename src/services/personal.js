import api from '@utils/http';

// 获取个人主页信息
const getHomePageInfo = params => api.get('/api/getHomePageInfo', params);

// 修改个人主页信息  专业技能/教育背景/项目经验/获奖情况/兴趣爱好
const updateHomePageInfo = params => api.post('/api/updateHomePageInfo', params);

// 获取工作年限下拉数据
const getWorkYearsData = params => api.get('/api/getWorkYearsData', params);

export default {
  getHomePageInfo,
  updateHomePageInfo,
  getWorkYearsData,
}