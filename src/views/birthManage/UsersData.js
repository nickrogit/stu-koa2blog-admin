export default {
  // 表单元素对象数组(搜索)
  searchItems: [
    {
      label: '商户名称',
      prop: 'mname',
      placeholder: '请输入商户名称',
      icon: 'ios-search-strong',
      labelWidth: 60
    }, {
      label: '系统状态',
      prop: 'state',
      placeholder: '请选择系统状态',
      element: 'select',
      option: [],
      labelWidth: 60
    }, {
      button: [
        {
          name: 'submit',
          type: 'primary',
          text: '查询'
        }, {
          name: 'reset',
          type: 'ghost',
          text: '重置'
        }
      ]
    }
  ],
  // 表单元素对象数组(用户)
  userItems: [
    {
      label: '商户类型',
      prop: 'mtype',
      placeholder: '请选择',
      element: 'select',
      option: []
    }, {
      label: '商户名称',
      prop: 'mname',
      placeholder: '请输入商户名称'
    }, {
      label: '负责人',
      prop: 'name',
      placeholder: '请输入负责人'
    }, {
      label: '电话号码',
      prop: 'tel',
      placeholder: '请输入电话号码',
      maxlength: 11
    }, {
      label: '密保邮箱',
      prop: 'email',
      placeholder: '请输入密保邮箱'
    }, {
      label: '业务类型',
      prop: 'btype',
      element: 'checkbox',
      option: []
    }, {
      label: '上传合同',
      prop: 'file',
      element: 'file',
      placeholder: '请上传'
    }, {
      label: '商户端登录账号',
      prop: 'account',
      placeholder: '',
      disabled: true
    }, {
      button: [
        {
          name: 'submit',
          type: 'primary',
          text: '提交'
        }, {
          type: 'ghost',
          text: '返回'
        }
      ]
    }
  ],
  // 补丁数据(城市)
  mtype: [
    {
      label: '自营商户',
      value: '自营商户'
    }, {
      label: '合作商户',
      value: '合作商户'
    }
  ],
  btype: [
    {
      label: '订场',
      value: '订场'
    }, {
      label: '售票',
      value: '售票'
    }, {
      label: '培训',
      value: '培训'
    }, {
      label: '零售',
      value: '零售'
    }, {
      label: '会员卡',
      value: '会员卡'
    }
  ],
  // 补丁数据(城市)
  city: [
    {
      label: 'BeiJing',
      value: 'beijing'
    }, {
      label: 'ShangHai',
      value: 'shanghai'
    }, {
      label: 'ShenZhen',
      value: 'shenzhen'
    }, {
      label: 'GuangZhou',
      value: 'guangzhou'
    }, {
      label: 'HangZhou',
      value: 'hangzhou'
    }, {
      label: 'NingBo',
      value: 'ningbo'
    }
  ],
  // 补丁数据(爱好)
  hobby: [
    {
      label: 'Eat',
      value: 'eat'
    }, {
      label: 'Sleep',
      value: 'sleep'
    }, {
      label: 'Run',
      value: 'run'
    }, {
      label: 'Movie',
      value: 'movie'
    }
  ]
}
