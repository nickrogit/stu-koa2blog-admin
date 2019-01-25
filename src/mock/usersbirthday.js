export default(Mock, qs) => {
  let data = Mock.mock({
    'users|87': [
      {
        'id|+1': 1,
        'name': '@name',
        'entry': '@date',
        'gender|1': [
          '0', '1'
        ],
        'birth': '@date',
        'tel': /^1[0-9]{10}$/
      }
    ]
  })
  let Users = data.users

  // 用户列表
  Mock.mock(/\/user-birthday-list/, config => {
    let {page, pageSize, name} = qs.parse(config.url.split('?')[1])
    let mockUsers = Users.filter(u => {
      if (name && u.name.indexOf(name) === -1) {
        return false
      }
      return true
    })
    let total = mockUsers.length
    let pageMax = Math.ceil(total / pageSize)
    page = page > pageMax
      ? pageMax
      : page
    mockUsers = mockUsers.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1))
    return {
      code: 200,
      msg: 'get users success',
      data: {
        total: total,
        users: mockUsers
      }
    }
  })

  // 删除用户
  Mock.mock(/\/user-birthday-delete/, config => {
    let {id} = qs.parse(config.body)
    Users = Users.filter(u => u.id !== parseInt(id))
    return {code: 200, msg: 'delete success'}
  })

  // 编辑用户
  Mock.mock(/\/user-birthday-edit/, config => {
    let {
      id,
      name,
      entry,
      gender,
      birth,
      tel
    } = qs.parse(config.body)
    Users.some(u => {
      if (u.id === parseInt(id)) {
        u.name = name
        u.entry = entry
        u.gender = gender
        u.birth = birth
        u.tel = tel
        return true
      }
    })
    return {code: 200, msg: 'update success'}
  })

  // 新增用户
  Mock.mock(/\/user-birthday-create/, config => {
    let {
      name,
      entry,
      gender,
      birth,
      tel
    } = qs.parse(config.body)
    Users.unshift({
      id: Users.length + 1,
      name: name,
      entry: entry,
      gender: gender,
      birth: birth,
      tel: tel
    })
    return {code: 200, msg: 'create success'}
  })
}
