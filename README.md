# adminPro by vue (koa2 server)

## 服务端+后台端+C端

服务数据库端：https://github.com/nickrogit/stu-koa2blog-server (koa2 + mysql)

后台管理端：https://github.com/nickrogit/stu-koa2blog-admin (vue + iview)

多平台C端：https://github.com/nickrogit/stu-koa2blog-client (计划中，将采用多端开发框架uni-app或taro)

## 路由懒加载

安装：https://www.npmjs.com/package/babel-plugin-syntax-dynamic-import

配置：

.babelrc

{
  "plugins": ["syntax-dynamic-import"]
}

![Image text](./1.png)

路由：

![Image text](./2.png)


> -   Username: admin
> -   Password: 123456

## 特性

基于 Vue, iView, Axios, Mock，懒加载 企业级后台管理系统最佳实践。

### 技术栈

-   Axios @0.x
-   iView @3.x
-   Mockjs @1.x
-   Vue @2.5.x
-   Vue-Router @3.x
-   Vuex @3.x
-   ES6
-   SCSS
-   dynamic-import

## 开发构建

### 目录结构

```bash
├── /build/          # 项目构建(webpack)相关配置
├── /config/         # 项目开发环境配置
├── /src/            # 源码目录
│ ├── /assets/       # 组件静态资源(图片)
│ ├── /components/   # 公共组件
│ ├── /config/       # 基础配置
│ ├── /mock/         # 数据模拟
│ ├── /router/       # 路由配置
│ ├── /services/     # 数据接口
│ ├── /store/        # vuex状态管理
│ ├── /utils/        # 工具函数
│ ├── /views/        # 路由组件(页面维度)
│ ├── App.vue        # 组件入口
│ └── main.js        # 程序入口
├── /static/         # 非组件静态资源
├── .babelrc         # ES6语法编译配置
├── .editorconfig    # 定义代码格式
├── .eslintignore    # ES6规范忽略文件
├── .eslintrc.js     # ES6语法规范配置
├── .gitignore       # git忽略文件
├── index.html       # 页面入口
├── package.json     # 项目依赖
└── README.md        # 项目文档
```

开发主流程

1, 进入 router 目录, 打开 routes.js 文件, 添加路由组件, 如 Users

```javascript
{
  path: '/manage/users',
  name: 'Users',
  component: resolve => {
    require(['@/views/manage/Users'], resolve)
  }
}
```

具体阅读 router/routes.js 源码

2, 进入 views 目录, 新建路由组件, 如 Users.vue

```bash
├── /src/
│ ├── /views/
│ │ ├── /manage/
│ │ │ ├── Users.vue
```

具体阅读 views/manage/Users.vue 源码

3, 进入 services 目录, 新建数据接口文件, 如 users.js

```bash
├── /src/
│ ├── /services/
│ │ ├── /manage/
│ │ │ ├── users.js
```

具体阅读 services/manage/users.js 源码

4, 进入 mock 目录, 打开 app.js 文件添加临时菜单, 如 Users

```javascript
{
  name: 'Manage',
  path: '/manage',
  children: [{
    name: 'Users',
    path: '/manage/users'
  }]
}
```

具体阅读 mock/app.js 源码

5, 如需 mock 数据, 进入 mock 目录, 新建数据模拟文件, 如 users.js

```bash
├── /src/
│ ├── /mock/
│ │ ├── users.js
```

具体阅读 mock/users.js 源码

6, 进入 mock 目录, 打开 index.js 文件添加数据模拟文件, 如 users

```javascript
import users from './users'

// 用户管理
users(Mock, qs)
```

具体阅读 mock/index.js 源码

7, 如需使用 vuex 存储状态请阅读 views/common/partials/Sidebar.vue 组件和 store 目录源码


### 注意点
如果项目不是放在服务器根目录，而是在其中一个文件夹如admin目录下，这时webpack打包需要调整static路径，
以免有找不到资源的问题，默认是'/'路径
修改如下：

1、config/index.js文件下build: {assetsPublicPath: './'}解决项目不在根目录问题；
```javascript
build: {
    index: path.resolve(__dirname, `../dist_${process.env.NODE_ENV}/index.html`),
    assetsRoot: path.resolve(__dirname, `../dist_${process.env.NODE_ENV}`),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
```
2、build/utils.js文件，修改publicPath字段为'../../'，解决字体找不到情况；
```javascript
if (options.extract) {
  return ExtractTextPlugin.extract({
    use: loaders,
    fallback: 'vue-style-loader',
    publicPath: '../../'
  })
} else {
  return ['vue-style-loader'].concat(loaders)
}
```

### 快速开始


进入项目安装依赖:

```bash
# 安装依赖
yarn
# 或
npm i
```

开发：

```bash
# 启用热加载到 localhost:8090
npm start
# 或
npm run dev
```

构建：

```bash
# 构建最小测试
npm run test

# 构建最小预发布
npm run release

# 构建最小生产
npm run build
```
