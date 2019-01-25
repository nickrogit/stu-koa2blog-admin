// 路由配置
export default[
  { path: '/login', name: 'login', component: () => import('@/views/Login') },
  {
    path: '/',
    redirect: '/',
    name: 'Layout',
    component: () => import('@/views/common/layouts/Layout'),
    children: [
      {path: '/', name: 'Dashboard', component: () => import('@/views/Dashboard')},
      {path: '/hello/hello-world', name: 'HelloWorld', component: () => import('@/components/HelloWorld')},
      {path: '/article/articleList', name: 'articleList', component: () => import('@/views/article/articleList')},
      {path: '/article/articleDetail', name: 'articleDetail', component: () => import('@/views/article/articleDetail')},
      {path: '/article/articleUpdate', name: 'articleUpdate', component: () => import('@/views/article/articleUpdate')}
    ]
  },
  { path: '*', name: '404', component: () => import('@/views/common/pages/NotFound') }
]
