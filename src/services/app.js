import {ax} from '@/config/axios'

export const login = params => ax.post('/login', params) // 用户登录
export const modifyPwd = params => ax.post('/modify-pwd', params) // 修改密码
