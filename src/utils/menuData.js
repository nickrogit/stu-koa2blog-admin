export default {
  // 菜单
  menuData: [
    {
      name: '主页',
      path: '/'
    }, {
      name: '文章管理',
      path: '/article',
      children: [
        {
          name: '文章列表',
          path: '/article/articleList'
        }
      ]
    }
  ]
}
