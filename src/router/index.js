import Vue from 'vue'
import Router from 'vue-router'
import routes from '@/router/routes'
import store from '@/store'

Vue.use(Router)

// 路由配置
const RouterConfig = {
  // mode: 'history',
  routes: routes
}

const router = new Router(RouterConfig)

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    localStorage.clear()
  }

  const user = JSON.parse(localStorage.getItem('userK'))
  if (!user && to.path !== '/login') {
    next({path: '/login'})
  } else {
    next()
    let menuPath = to.path
    if (menuPath === '/article/articleDetail' || menuPath === '/article/articleUpdate') {
      menuPath = '/article/articleList'
    }
    store.commit('MENU_ON', menuPath) // 选中菜单效果
  }
})

export default router
