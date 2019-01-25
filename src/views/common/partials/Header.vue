<template>
<div id="com-header">
  <div class="logo-info">
    <img class="logo" src="../../../assets/logo.png">
    <p class="name">adminPro<br/>by vue</p>
  </div>
  <!-- .logo-info -->
  <div class="login-info">
    <Dropdown trigger="click" @on-click="handleDropdown">
      <strong class="user">
        <Avatar style="background-color: #3c3" icon="ios-person" size="small"></Avatar>
        {{ userName }}
      </strong>
      <DropdownMenu slot="list">
        <DropdownItem v-for="(item, index) in dropdownItems" :key="index" :name="item.name">
          <Icon :type="item.icon"></Icon> {{ item.label }}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
  <!-- .login-info -->
  <Modal v-model="modal.visible" :title="modal.title" footer-hide>
    <ModifyPwd :key="modal.visible" @on-click="modal.visible = false"></ModifyPwd>
  </Modal>
  <!-- Modal -->
</div>
</template>
<script>
import ModifyPwd from '@/views/common/pages/ModifyPwd'

export default {
  name: 'com-header',
  components: {
    ModifyPwd
  },
  data() {
    return {
      // 用户名
      userName: '',
      // 模态框属性对象
      modal: {
        title: '',
        visible: false
      },
      // 下拉菜单元素数组
      dropdownItems: [/* {
        label: '修改密码',
        name: 'modifyPwd',
        icon: 'unlocked'
      }, */{
        label: '退出登录',
        name: 'signout',
        icon: 'log-out'
      }]
    }
  },
  mounted() {
    // 获取用户信息
    const user = JSON.parse(localStorage.getItem('userK'))
    this.userName = user.name || 'Null'
  },
  methods: {
    // 下拉菜单项
    handleDropdown(name) {
      // 修改密码
      if (name === 'modifyPwd') {
        this.modal = {
          title: 'Modify Pwd',
          visible: true
        }
      }
      // 退出系统
      if (name === 'signout') {
        this.$Modal.confirm({
          title: 'Warning',
          content: '确认退出系统?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$router.push('/login') // 路由跳转登录页
            this.$store.commit('MENU_RESET') // 重置菜单
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#com-header {
    overflow: hidden;
    color: #fff;
    background-color: #2d8cf0;
    .logo-info {
        float: left;
        width: 300px;
        .logo {
            float: left;
            width: 40px;
            height: 40px;
            margin: 10px 16px 10px 24px;
        }
        .name {
            float: left;
            width: 200px;
            margin: 12px 0 6px;
            font-size: 14px;
            line-height: 20px;
        }
        .sub {
            font-size: 12px;
        }
    }
    .login-info {
        float: right;
        height: 60px;
        padding-right: 20px;
        line-height: 60px;
        .user {
            display: block;
            margin-left: 8px;
            cursor: pointer;
            color: #fff;
        }
    }
}
</style>
