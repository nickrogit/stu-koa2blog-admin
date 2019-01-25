import {ax} from '@/config/axios'
// 文件上传
export const uploadFile = params => ax.post('/uploadFile', params) // 上传文件
// 文章
export const getArticleList = params => ax.get('/articles', {params: params})
export const getArticleDetail = params => ax.get('/articlesDetail', {params: params})
export const delArticle = params => ax.post('/articlesDel', params) // 删除文章
export const updateArticle = params => ax.post('/articlesUpdate', params) // 新增/更新文章
// 标签列表
export const getTagsList = params => ax.get('/tags', {params: params})
