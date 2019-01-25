// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview' // iView 完整引入
import 'iview/dist/styles/iview.css'
import vCom from './components' // 自定义组件引入
import Utils from './utils' // 工具函数引入
import './mock' // mock 数据引入
import CKEditor from '@ckeditor/ckeditor5-vue' // 富文本ckedit

Vue.use(iView)
Vue.use(vCom)
Vue.use(CKEditor)
Object.defineProperty(Vue.prototype, '$Utils', {value: Utils})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
