<template>
<div id="main">
  <ComError></ComError>
  <!-- ComError -->
  <div id="login">
    <div class="logo-info">
      <img class="logo" src="../assets/logo.png">
      <p class="name">adminPro by vue</p>
    </div>
    <!-- .logo-info -->
    <Form ref="login" :model="login" :rules="loginRule" @keyup.enter.native="handleLogin('login')">
      <FormItem v-for="(item, index) in loginItems" :key="index" :prop="item.prop">
        <Input :type="item.type" v-model="login[item.prop]" :placeholder="item.placeholder"></Input>
      </FormItem>
      <FormItem>
        <Button long type="primary" :loading="this.$store.state.app.loading" @click="handleLogin('login')">登 录</Button>
      </FormItem>
    </Form>
    <!-- Form -->
    <!--<p class="version">Version: {{ remote.version }}</p>-->
    <!-- .version -->
    <div v-if="remote.visible" class="remote">
      <p class="address"> Remote Address: {{ remote.baseURL }} </p>
      <Form inline ref="remote" :model="remote" :rules="remoteRule" @keyup.enter.native="handleSave('remote')">
        <FormItem prop="host">
          <Input v-model="remote.host" placeholder="Remote Address" style="width: 240px;"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSave('remote')">Save</Button>
          <Button type="default" @click="handleReset('remote')" style="margin-left: 8px">R</Button>
        </FormItem>
      </Form>
    </div>
    <!-- .remote -->
  </div>
</div>
</template>
<script>
import {
  ax,
  config
} from '@/config/axios'
import {
  login
} from '@/services/app'
import ComError from './common/partials/Error'

export default {
  name: 'login',
  components: {
    ComError
  },
  data() {
    return {
      // 表单元素数组(登录)
      loginItems: [{
        prop: 'user',
        placeholder: 'Username'
      }, {
        prop: 'pwd',
        placeholder: 'Password',
        type: 'password'
      }],
      // 表单数据对象(登录)
      login: {
        user: '',
        pwd: ''
      },
      // 表单验证规则(登录)
      loginRule: {
        user: [{
          required: true,
          message: 'Please fill in the username',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: 'Please fill in the password',
          trigger: 'blur'
        }]
      },
      // 表单数据对象(接口域名)
      remote: {
        visible: false,
        version: '',
        host: '',
        baseURL: ''
      },
      // 表单验证规则(接口域名)
      remoteRule: {
        host: [{
          required: true,
          message: 'Please fill in the Remote Address',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
    const env = process.env.NODE_ENV
    const version = config.version
    switch (env) {
      case 'production':
        this.remote.version = `${version} Production`
        break
      case 'release':
        this.remote.version = `${version} Release`
        break
      default:
        this.remote = {
          visible: true,
          version: env === 'testing' ? `${version} Test` : `${version} Develop`,
          host: sessionStorage.getItem('hostK') || config.baseURL,
          baseURL: config.baseURL
        }
        this.login = {
          user: 'admin',
          pwd: '123456'
        }
    }
  },
  methods: {
    handleLogin(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const env = process.env.NODE_ENV
          if (env !== 'production' && env !== 'release') {
            // 配置默认接口地址
            ax.defaults.baseURL = sessionStorage.getItem('hostK') || config.baseURL
          }

          this.$store.commit('LOADING', true)
          // 请求参数
          let para = Object.assign({}, this.login)
          // 模拟异步请求
          setTimeout(() => {
            login(para).then(res => {
              // 响应数据
              if (res) {
                localStorage.setItem('userK', JSON.stringify(res.data))
                // 配置用户TOKEN
                // ax.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
                // 获取菜单信息
                this.$store.dispatch('handleMenu')
              }
              this.$store.commit('LOADING', false)
            }).catch(() => {
              this.$store.commit('LOADING', false)
            })
          }, 800)
        }
      })
    },
    handleSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          sessionStorage.setItem('hostK', this.remote.host)
          this.$Message.success('Save Success!')
        } else {
          this.$Message.error('Save Fail!')
        }
      })
    },
    handleReset(name) {
      this.remote.host = this.remote.baseURL
      sessionStorage.setItem('hostK', this.remote.baseURL)
      this.$Message.success('Reset Success!')
    }
  }
}
</script>
<style lang="scss" scoped>
#login {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 360px;
    height: 350px;
    margin: -175px 0 0 -180px;
    padding: 36px;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
    .logo-info {
        /*height: 64px;*/
        margin-bottom: 22px;
        text-align: center;
        .logo {
            width: 64px;
            height: 64px;
            /*margin-right: 10px;*/
            display: block;
            margin: 0 auto;
        }
        .name {
            /*position: relative;*/
            bottom: 14px;
            display: block;
            text-align: center;
            font-size: 18px;
            line-height: 20px;
            margin-top: 10px;
        }
        .sub {
            font-size: 12px;
        }
    }
    .version {
        text-align: center;
        color: #ccc;
    }
    .remote {
        position: fixed;
        top: 10px;
        left: 10px;
        padding: 10px;
        border: 1px dashed #ccc;
        background-color: #fff;
        .address {
            margin-bottom: 6px;
            text-align: left;
            color: #ccc;
        }
    }
}
</style>
