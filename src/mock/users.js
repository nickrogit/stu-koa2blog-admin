export default(Mock, qs) => {
  let data = Mock.mock({
    'users|87': [
      {
        'id|+1': 1,
        'mname': '@name',
        'name': '@name',
        'tel': /^1[0-9]{10}$/,
        'email': '@email',
        'date': '@date',
        'nums|1-50': 1,
        'mtype|1': [
          '自营商户',
          '合作商户'
        ],
        'btype': [
          '订场', '售票'
        ],
        'state|1': [
          '0', '1'
        ],
        'filename': 'a42bdcc1178e62b4694c830f028db5c0',
        'fileurl': 'http://www.baidu.com',
        'account': 'bdht123456'
      }
    ]
  })
  let Users = data.users

  // 用户列表
  Mock.mock(/\/user-list/, config => {
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
  Mock.mock(/\/user-delete/, config => {
    let {id} = qs.parse(config.body)
    Users = Users.filter(u => u.id !== parseInt(id))
    return {code: 200, msg: 'delete success'}
  })

  // 编辑用户
  Mock.mock(/\/user-edit/, config => {
    let {
      id,
      name,
      age,
      gender,
      email,
      city,
      hobby,
      birth,
      desc
    } = qs.parse(config.body)
    Users.some(u => {
      if (u.id === parseInt(id)) {
        u.name = name
        u.age = parseInt(age)
        u.gender = gender
        u.email = email
        u.city = city
        u.hobby = hobby
        u.birth = birth
        u.desc = desc
        return true
      }
    })
    return {code: 200, msg: 'update success'}
  })

  // 新增用户
  Mock.mock(/\/user-create/, config => {
    let {
      name,
      age,
      gender,
      email,
      city,
      hobby,
      birth,
      desc
    } = qs.parse(config.body)
    Users.unshift({
      id: Users.length + 1,
      name: name,
      age: parseInt(age),
      gender: gender,
      email: email,
      city: city,
      hobby: hobby,
      birth: birth,
      desc: desc
    })
    return {code: 200, msg: 'create success'}
  })
}
