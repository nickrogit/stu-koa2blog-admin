<template>
<div id="newsList">
  <Card>
    <div slot="title">
      <Icon type="ios-search-strong"></Icon> 搜索
    </div>
    <Form ref="orderSearch" :model="search" :label-width="65" inline>
      <FormItem label="时间" prop="date">
        <DatePicker v-model="search.date" format="yyyy-MM-dd" type="daterange" placeholder="请选择时间" style="width: 220px"></DatePicker>
      </FormItem>
      <FormItem label="标题" prop="keyword">
        <Input v-model="search.keyword" placeholder="请输入标题" style="" :maxlength="30"></Input>
      </FormItem>
      <FormItem label="" :label-width="50">
        <Button type="primary" @click="handleDataList(true)">搜索</Button>
        <Button type="default" @click="resetSearch()" style="margin-left: 10px">重置</Button>
      </FormItem>
    </Form>
  </Card>
  <br>
  <Card>
    <div slot="title">
      <Icon type="ios-list-outline"></Icon> 文章列表
    </div>
    <div slot="extra">
      <a href="#" @click.prevent="handleCreate"> 添加文章 </a>
    </div>
    <Table border :loading="loading.list" :columns="columns" :data="data"></Table>
    <br>
    <Page v-if="data.length" show-elevator show-total placement="top" :current="page" :total="total" :page-size="pageSize" @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange"></Page>
  </Card>
</div>
</template>
<script>
  import { getArticleList, delArticle, getTagsList } from '@/services/api'
  import dayjs from 'dayjs'

export default {
  data() {
    return {
      columns: [{
        title: '标题',
        key: 'title',
        render: (h, params) => h('a', {
          style: {
            marginRight: '16px'
          },
          on: {
            click: () => {
              this.handleView(params.row)
            }
          }
        }, params.row.title)
      }, {
        title: '标签',
        key: 'tags',
        render: (h, params) => {
          let tagsName = []
          let tagsIds = params.row.tags.split(',')
          this.tagsOption.map(item => {
            if (tagsIds.indexOf(String(item.value)) > -1) {
              tagsName.push(item.label)
            }
          })
          return h('span', tagsName.join(','))
        }
      }, {
        title: '时间',
        key: 'date',
        render: (h, params) => h('span', dayjs(params.row.date).format('YYYY-MM-DD'))
      }, {
        title: '操作',
        key: 'operation',
        align: 'center',
        width: 220,
        render: (h, params) => h('div', [
          h('a', {
            style: {
              marginRight: '16px'
            },
            on: {
              click: () => {
                this.handleView(params.row)
              }
            }
          }, [h('Icon', {
            props: {
              type: 'md-eye',
              size: 16
            },
            style: {
              marginRight: '4px'
            }
          }), '查看']),
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
              type: 'md-create',
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
              title: '确认删除?',
              'ok-text': '确认',
              'cancel-text': '取消'
            },
            on: {
              'on-ok': () => {
                this.handleDelete(params.row)
              }
            }
          }, [
            h('a', [h('Icon', {
              props: {
                type: 'md-trash',
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
        date: [],
        keyword: ''
      },
      tagsOption: []
    }
  },
  mounted() {
    this.initUser = Object.assign({}, this.user) // 复制初始表单数据对象
    this.handleDataList()
    this.handleTags()
  },
  methods: {
    handleTags() {
      getTagsList().then(res => {
        if (res.code === 200) {
          let resData = res.data
          let resArrType = []
          resData.map((item) => {
            resArrType.push({label: item.tag, value: String(item.tagId)})
          })
          this.tagsOption = resArrType
        }
      }).catch(() => {
      })
    },
    handleDataList(type) {
      this.loading.list = true
      this.page = type ? 1 : this.page
      let para = {
        startDate: this.search.date[0] ? dayjs(this.search.date[0]).format('YYYY-MM-DD') : '',
        endDate: this.search.date[1] ? dayjs(this.search.date[1]).format('YYYY-MM-DD') : '',
        keyword: this.search.keyword,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      getArticleList(para).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          this.data = res.data
          this.total = res.total
        }
        this.loading.list = false
      }).catch(() => {
        this.loading.list = false
      })
    },
    resetSearch() {
      this.search = {
        keyword: '',
        date: []
      }
      this.handleDataList(true)
    },
    handlePageChange(page) {
      this.page = page
      this.handleDataList()
    },
    handlePageSizeChange(page) {
      this.pageSize = page
      this.handleDataList()
    },
    handleDelete(row) {
      this.loading.list = true
      let para = {
        id: row.id
      }
      delArticle(para).then(res => {
        if (res.code === 200) {
          this.$Message.success(res.msg)
          this.handleDataList()
        }
        this.loading.list = false
      }).catch(() => {
        this.loading.list = false
      })
    },
    handleView(row) {
      this.$router.push({path: '/article/articleDetail', query: {id: row.id}})
    },
    // 新增界面
    handleCreate() {
      this.$router.push({path: '/article/articleUpdate'})
    },
    // 编辑界面
    handleEdit(row) {
      this.$router.push({path: '/article/articleUpdate', query: {id: row.id}})
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
