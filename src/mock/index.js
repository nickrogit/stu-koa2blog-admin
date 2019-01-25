import Mock from 'mockjs'
import qs from 'qs'
import app from './app'
import users from './users'
import usersbirthday from './usersbirthday'

// 登录，菜单，改密
app(Mock, qs)
// 用户管理
users(Mock, qs)
// 用户生日管理
 usersbirthday(Mock, qs)
