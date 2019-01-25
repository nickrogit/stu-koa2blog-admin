export default(Mock, qs) => {
  // 用户登录
  Mock.mock(/\/login/, config => {
    const para = qs.parse(config.body)
    if (para.user === 'admin' && para.pwd === '123456') {
      return {
        code: 200,
        msg: 'login success',
        data: {
          user_id: 1,
          real_name: 'Admin'
        }
      }
    }
    return {code: 500, msg: 'Your account username or password is incorrect'}
  })

  // 菜单获取
  Mock.mock(/\/menu/, {
    code: 200,
    msg: 'get menu success',
    data: [
      {
        name: '主页',
        path: '/'
      }, {
        name: '生日管理',
        path: '/birthManage',
        children: [
          {
            name: '用户管理',
            path: '/birthManage/users'
          },
          {
            name: '用户生日管理',
            path: '/birthManage/usersBirthday'
          },
          {
            name: '批量导入',
            path: '/birthManage/import'
          }
        ]
      }
    ]
  })

  // 密码修改
  Mock.mock(/\/modify-pwd/, config => {
    const para = qs.parse(config.body)
    if (para.oldPwd === '123456') {
      return {code: 200, msg: 'password modify success'}
    }
    return {code: 500, msg: 'Your old password is incorrect'}
  })
}
