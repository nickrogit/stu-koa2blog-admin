<template>
<div id="users">
  <Card>
    <div slot="title">
      <Icon type="ios-search-strong"></Icon> 搜索
    </div>
    <ComForm inline ref="search" :items="searchItems" :model="search" @on-submit="handleDataList(true)" @on-reset="handleDataList(true)"></ComForm>
  </Card>
  <br>
  <Card>
    <div slot="title">
      <Icon type="ios-list-outline"></Icon> 用户列表
    </div>
    <div slot="extra">
      <a href="#" @click.prevent="handleCreate"> 添加用户 </a>
    </div>
    <Table border :loading="loading.list" :columns="columns" :data="data"></Table>
    <br>
    <Page v-if="data.length" show-elevator show-total placement="top" :current="page" :total="total" :page-size="pageSize" @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange"></Page>
  </Card>
  <Modal v-model="modal.visible" :title="modal.title" footer-hide>
    <ComForm :key="modal.visible" ref="user" :items="userItems" :model="user" :rules="userRule" :loading="loading.form" :btn-loading="loading.btn" :label-width="80" @on-submit="handleSubmit('user')" @on-click="modal.visible = false" style="width: 360px;"></ComForm>
  </Modal>
</div>
</template>
<script>
import {
  getUserList,
  delUser,
  editUser
} from '@/services/birthManage/usersbirthday'
import usersData from './UsersBirthdayData'

export default {
  data() {
    // 自定义验证(手机号)
    const validTel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      if (!(/^1[3-9]\d{9}$/.test(value))) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      ...usersData,
      // 列表描述数据对象数组(用户)
      columns: [{
        title: '姓名',
        key: 'name'
      }, {
        title: '入职时间',
        key: 'entry'
      }, {
        title: '姓别',
        key: 'gender',
        render: (h, params) => h('span', params.row.gender === '1' ? '男' : '女')
      }, {
        title: '生日日期',
        key: 'birth'
      }, {
        title: '联系电话',
        key: 'tel'
      }, {
        title: '操作',
        key: 'operation',
        align: 'center',
        width: 160,
        render: (h, params) => h('div', [
          h('a', {
            style: {
              marginRight: '16px'
            },
            on: {
              click: () => {
                this.handleEdit(params.row)
              }
            }
          }, [h('Icon', {
            props: {
              type: 'edit',
              size: 16
            },
            style: {
              marginRight: '4px'
            }
          }), '编辑']),
          h('Poptip', {
            props: {
              confirm: true,
              transfer: true,
              title: 'Are you sure delete this task?',
              'ok-text': 'yes',
              'cancel-text': 'no'
            },
            on: {
              'on-ok': () => {
                this.handleDelete(params.row)
              }
            }
          }, [
            h('a', [h('Icon', {
              props: {
                type: 'trash-a',
                size: 16
              },
              style: {
                marginRight: '4px'
              }
            }), '删除'])
          ])
        ])
      }],
      // 列表数据
      data: [],
      // 当页页码
      page: 1,
      // 每页条数
      pageSize: 10,
      // 数据总数
      total: 0,
      // 加载状态
      loading: {
        list: false, // 列表
        form: false, // 表单
        btn: false // 按钮
      },
      // 模态框属性对象
      modal: {
        title: '',
        visible: false
      },
      // 表单数据对象(搜索)
      search: {
        stype: 'name',
        sct: ''
      },
      // 表单数据对象(用户)
      user: {
        name: '',
        entry: '',
        gender: '',
        birth: '',
        tel: ''
      },
      // 初始表单数据对象(用户)
      initUser: {},
      // 表单验证对象(用户)
      userRule: {
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }],
        entry: [{
          required: true,
          message: '请选择入职时间',
          trigger: 'change',
          type: 'date'
        }],
        gender: [{
          required: true,
          message: '请选择姓别',
          trigger: 'change'
        }],
        birth: [{
          required: true,
          message: '请选择出生日期',
          trigger: 'change',
          type: 'date'
        }],
        tel: [{
          required: true,
          validator: validTel,
          trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
    this.initUser = Object.assign({}, this.user) // 复制初始表单数据对象
    this.handleDataList() // 获取用户列表
  },
  methods: {
    /**
     * 获取用户列表
     * @param  {boolean} type 是否使用搜索, 默认值, false
     */
    handleDataList(type) {
      this.loading.list = true
      this.page = type ? 1 : this.page
      let para = {
        stype: this.search.stype,
        sct: this.search.sct,
        page: this.page,
        pageSize: this.pageSize
      }
      // 模拟异步请求(查询)
      setTimeout(() => {
        getUserList(para).then(res => {
          let {
            users,
            total
          } = res.data
          this.data = users
          this.total = total
          this.loading.list = false
        }).catch(() => {
          this.loading.list = false
        })
      }, 500)
    },
    /**
     * 改变页码
     * @param  {number} page 改变后的页码
     */
    handlePageChange(page) {
      this.page = page
      this.handleDataList()
    },
    /**
     * 切换每页条数
     * @param  {number} page 切换后的每页条数
     */
    handlePageSizeChange(page) {
      this.pageSize = page
      this.handleDataList()
    },
    /**
     * 删除用户
     * @param  {object} row 当前行数据
     */
    handleDelete(row) {
      this.loading.list = true
      let para = {
        id: row.id
      }
      // 模拟异步请求(删除)
      setTimeout(() => {
        delUser(para).then(res => {
          this.$Message.success(res.msg)
          this.handleDataList()
        }).catch(() => {
          this.loading.list = false
        })
      }, 500)
    },
    /**
     * 编辑界面
     * @param  {object} row 当前行数据
     */
    handleEdit(row) {
      this.handleModal(true)
      // 模拟异步请求(获取详情)
      setTimeout(() => {
        this.user = Object.assign({}, row)
        this.handlePatch() // 获取补丁数据
      }, 800)
    },
    // 新增界面
    handleCreate() {
      this.handleModal() // 显示模态框
      this.handlePatch() // 获取补丁数据
    },
    /**
     * 模态框显示
     * @param  {boolean} type 是否显示编辑界面, 默认值, false
     */
    handleModal(type) {
      this.loading.form = true // 表单加载状态
      this.modal = {
        title: '编辑',
        visible: true
      }
      if (!type) {
        this.modal.title = '添加'
        this.user = Object.assign({}, this.initUser)
      }
    },
    // 获取补丁数据
    handlePatch() {
      let {
        patch,
        total
      } = this.$Utils.patchData(this.userItems) // 返回补丁对象数据和对象总数
      let _false = false
      if (total === 0) {
        this.loading.form = _false // 表单加载状态
        return _false
      }
      patch.map(obj => {
        if (obj.prop === 'city') {
          // 模拟异步请求(获取补丁数据-城市)
          setTimeout(() => {
            obj.option = this.city
            total--
            this.loading.form = total === 0 ? _false : true // 补丁完成状态
          }, 800)
        }
        if (obj.prop === 'hobby') {
          // 模拟异步请求(获取补丁数据-爱好)
          setTimeout(() => {
            obj.option = this.hobby
            total--
            this.loading.form = total === 0 ? _false : true // 补丁完成状态
          }, 400)
        }
      })
    },
    // 表单提交
    handleSubmit() {
      this.loading.btn = true
      let para = Object.assign({}, this.user)
      para.birth = para.birth ? this.$Utils.formatDate.format(new Date(para.birth), 'yyyy-MM-dd') : ''
      para.entry = para.entry ? this.$Utils.formatDate.format(new Date(para.entry), 'yyyy-MM-dd') : ''
      // 模拟异步请求(编辑 Or 新增)
      setTimeout(() => {
        editUser(para).then(res => {
          this.$Message.success(res.msg)
          this.handleDataList()
          this.loading.btn = false
          this.modal.visible = false
        }).catch(() => {
          this.loading.btn = false
        })
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
