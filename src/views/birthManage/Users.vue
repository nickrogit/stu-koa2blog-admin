<template>
<div id="users">
  <Card>
    <div slot="title">
      <Icon type="ios-search-strong"></Icon> 查询
    </div>
    <ComForm inline ref="search" :items="searchItems" :model="search" @on-submit="handleDataList(true)" @on-reset="handleDataList(true)"></ComForm>
  </Card>
  <br>
  <Card>
    <div slot="title">
      <Icon type="ios-list-outline"></Icon> 商户列表
    </div>
    <div slot="extra">
      <a href="#" @click.prevent="handleCreate"> 添加商户 </a>
    </div>
    <Table border :loading="loading.list" :columns="columns" :data="data"></Table>
    <br>
    <Page v-if="data.length" show-elevator show-total show-sizer placement="top" :current="page" :total="total" :page-size="pageSize" @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange"></Page>
  </Card>
  <Modal v-model="modal.visible" :title="modal.title" footer-hide>
    <ComForm :key="modal.visible" ref="user" :items="userItems" :model="user" :rules="userRule" :loading="loading.form" :btn-loading="loading.btn" :label-width="120" @on-submit="handleSubmit('user')" @on-click="modal.visible = false" style="width: 400px;"></ComForm>
  </Modal>
</div>
</template>
<script>
import {
  getUserList,
  delUser,
  editUser
} from '@/services/birthManage/users'
import usersData from './UsersData'

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
        title: '商户名称',
        key: 'mname'
      }, {
        title: '负责人',
        key: 'name'
      }, {
        title: '电话号码',
        key: 'tel'
      }, {
        title: '入驻时间',
        key: 'date'
      }, {
        title: '场地数量',
        key: 'nums'
      }, {
        title: '商户类型',
        key: 'mtype'
      }, {
        title: '业务类型',
        key: 'btype',
        render: (h, params) => h('span', params.row.btype.join(' '))
      }, {
        title: '系统状态',
        key: 'state',
        render: (h, params) => h('span', params.row.state === '1' ? '上线' : '下线')
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
                params.row.state === '1' ? this.handleView(params.row) : this.handleEdit(params.row)
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
          }), params.row.state === '1' ? '详情' : '编辑']),
          h('Poptip', {
            props: {
              confirm: true,
              transfer: true,
              title: '确认删除?',
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
        mname: '',
        state: ''
      },
      // 表单数据对象(用户)
      user: {
        mtype: '',
        mname: '',
        name: '',
        tel: '',
        email: '',
        btype: [],
        filename: '',
        fileurl: '',
        account: ''
      },
      files: {
        name: '',
        url: ''
      },
      // 初始表单数据对象(用户)
      initUser: {},
      // 表单验证对象(用户)
      userRule: {
        mtype: [{
          required: true,
          message: '请选择商户类型',
          trigger: 'change'
        }],
        mname: [{
          required: true,
          message: '商户名称不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '负责人不能为空',
          trigger: 'blur'
        }],
        tel: [{
          required: true,
          validator: validTel,
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '邮箱不能为空',
          trigger: 'blur'
        }, {
          message: '邮箱格式不正确',
          trigger: 'blur',
          type: 'email'
        }],
        btype: [{
          required: true,
          message: '请选择业务类型',
          trigger: 'change',
          type: 'array',
          min: 1
        }],
        file: [{
          required: true,
          message: '合同不能为空',
          trigger: 'blur'
        }],
        account: [{
          required: true,
          message: '商户账号不能为空',
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
        name: this.search.name,
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
        console.log(this.user)
        this.handlePatch() // 获取补丁数据
      }, 800)
    },
    /**
     * 查看
     * @param  {object} row 当前行数据
     */
    handleView(row) {
      this.handleModal(true, true)
      // 模拟异步请求(获取详情)
      setTimeout(() => {
        this.user = Object.assign({}, row)
        console.log(this.user)
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
    handleModal(type, detail) {
      /* this.userItems.forEach(function (item, index) {
        item.disabled = true
      }) */
      this.loading.form = true // 表单加载状态
      this.modal = {
        title: '编辑',
        visible: true
      }
      if (!type) {
        this.modal.title = '添加'
        this.user = Object.assign({}, this.initUser)
      }
      if (detail) {
        this.modal.title = '查看'
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
        if (obj.prop === 'mtype') {
          // 模拟异步请求(获取补丁数据-城市)
          setTimeout(() => {
            obj.option = this.mtype
            total--
            this.loading.form = total === 0 ? _false : true // 补丁完成状态
          }, 800)
        }
        if (obj.prop === 'btype') {
          // 模拟异步请求(获取补丁数据-爱好)
          setTimeout(() => {
            obj.option = this.btype
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
