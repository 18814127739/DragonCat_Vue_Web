import api from '@utils/http';

// 获取笔记分类列表
const getNoteTypes = params => api.get('/api/getNoteTypes', params);

// 新增笔记分类
const addNoteType = params => api.post('/api/addNoteType', params);

// 修改笔记分类
const updateNoteType = params => api.post('/api/updateNoteType', params);

// 删除笔记分类
const deleteNoteType = params => api.post('/api/deleteNoteType', params);

// 查询笔记
const getNotes = params => api.get('/api/getNotes', params);

// 新增笔记
const addNote = params => api.post('/api/addNote', params);

// 更新笔记
const updateNote = params => api.post('/api/updateNote', params);

// 删除笔记
const deleteNote = params => api.post('/api/deleteNote', params);

export default {
  getNoteTypes,
  addNoteType,
  updateNoteType,
  deleteNoteType,
  getNotes,
  addNote,
  updateNote,
  deleteNote,
};