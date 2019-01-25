export default {
  // 表单元素对象数组(搜索)
  searchItems: [
    {
      label: '',
      prop: 'stype',
      placeholder: '请选择',
      element: 'select',
      option: [
        {
          label: '姓名',
          value: 'name'
        }, {
          label: '手机号',
          value: 'tel'
        }
      ],
      labelWidth: 0
    }, {
      label: '',
      prop: 'sct',
      placeholder: '请输入搜索内容',
      icon: 'ios-search-strong',
      labelWidth: 0
    }, {
      button: [
        {
          name: 'submit',
          type: 'primary',
          text: '搜索'
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
      label: '姓名',
      prop: 'name',
      placeholder: '请输入姓名'
    }, {
      label: '入职时间',
      prop: 'entry',
      placeholder: '请选择入职时间',
      element: 'date'
    }, {
      label: '性别',
      prop: 'gender',
      element: 'radio',
      option: [
        {
          label: '男',
          value: '1'
        }, {
          label: '女',
          value: '0'
        }
      ]
    }, {
      label: '生日',
      prop: 'birth',
      placeholder: '请选择出生日期',
      element: 'date'
    }, {
      label: '电话号码',
      prop: 'tel',
      placeholder: '请输入电话号码',
      maxlength: 11
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
  ]

}
