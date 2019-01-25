import axios from 'axios'
import qs from 'qs'
import {Message} from 'iview'
import config from '@/config'
import router from '@/router'
import store from '@/store'

const ax = axios.create({
  // withCredentials: true,  配置默认跨域访问凭证(Cookie)
  baseURL: sessionStorage.getItem('hostK') || config.baseURL, // 配置默认接口地址
  timeout: config.timeout // 配置默认请求超时
})

// 获取用户TOKEN
// const user = JSON.parse(localStorage.getItem('userK'))
// if (user) {
// 配置用户TOKEN
// ax.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
// }
// 配置默认请求头
// ax.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 配置版本号
// ax.defaults.headers.common['Accept'] = config.headers.Accept
// ax.defaults.headers.post['Accept'] = config.headers.Accept

// 添加请求拦截器
ax.interceptors.request.use(config => {
  // 参数序列化
  config.data = qs.stringify(config.data)
  return config
}, error => {
  return Promise.reject(error)
})

// 添加响应拦截器
ax.interceptors.response.use(response => {
  const env = process.env.NODE_ENV
  // 控制台输出响应数据
  if (env !== 'production' && env !== 'release') {
    console.log(response.data)
  }
  // 返回正确响应数据
  const {code, msg} = response.data
  if (code === 200) {
    return response.data
  }
  // TOKEN 失效
  if (code === 5000) {
    router.push('/login') // 路由跳转登录页
    store.commit('MENU_RESET') // 重置菜单
  }
  // 错误数据显示方式
  if (env !== 'production' && env !== 'release') {
    store.commit('RES_ERROR', response) // 响应错误数据
  } else {
    Message.error(msg) // 提示错误信息
  }
}, error => {
  const {status, timeout} = error.request
  if (status === 0 && timeout === config.timeout) {
    Message.error({content: '服务器断开连接 或 请求超时 请检查网络状态', duration: 8})
  } else {
    store.commit('RES_ERROR', error.response) // 响应错误数据
  }
  return Promise.reject(error)
})

export {
  ax,
  config
}
