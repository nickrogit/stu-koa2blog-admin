<template>
  <div id="articleDetail">
    <Card>
      <div slot="title">
        <Icon type="ios-search-strong"></Icon> 文章详情
      </div>
      <a href="#" slot="extra" @click.prevent="handleBack()">返回</a>
      <div>
        <div class="title">{{detailData.title}}</div>
        <div class="date">{{detailData.date}}</div>
        <div class="date" v-if="detailData.tags.length > 0">
          <Tag :color=tagsColor[index] v-for="(item,index) in detailData.tags" :key="index">{{item}}</Tag>
        </div>
        <div class="photo" v-if="detailData.photo">
          <img :src="detailData.photo">
        </div>
        <div class="detail" v-html="detailData.detail"></div>
      </div>
    </Card>
    <Spin v-if="loading.page" size="large" fix></Spin>
  </div>

</template>
<script>
  import dayjs from 'dayjs'
  import { getArticleDetail, getTagsList } from '@/services/api'

export default {
  data() {
    return {
      id: '',
      detailData: {
        title: '',
        date: '',
        photo: '',
        detail: '',
        tags: []
      },
      tagsColor: ['primary', 'success', 'warning', 'error', 'blue', 'green', 'red', 'yellow', 'pink', 'magenta', 'volcano', 'orange', 'gold', 'lime', 'cyan', 'geekblue', 'purple'],
      loading: {
        page: false
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.detailData.id = Number(this.$route.query.id)
      this.handleDetail()
    } else {
      this.handleBack()
    }
  },
  methods: {
    handleTags() {
      getTagsList().then(res => {
        if (res.code === 200) {
          let resData = res.data
          let resArr = []
          resData.map((item) => {
            if (this.tagsIds.indexOf(String(item.tagId)) > -1) {
              resArr.push(item.tag)
            }
          })
          this.detailData.tags = resArr
        }
      }).catch(() => {
      })
    },
    handleDetail(type) {
      this.loading.page = true
      let para = {
        id: this.detailData.id
      }
      getArticleDetail(para).then(res => {
        if (res.code === 200) {
          this.detailData.title = res.data.title
          this.detailData.date = dayjs(res.data.date).format('YYYY-MM-DD')
          this.detailData.photo = res.data.photo
          this.detailData.detail = res.data.detail
          this.tagsIds = String(res.data.tags).split(',')
          this.handleTags()
        }
        this.loading.page = false
      }).catch(() => {
        this.loading.page = false
      })
    },
    handleBack() {
      this.$router.push({path: '/article/articleList'})
    }
  }
}
</script>
<style>
  #articleDetail{
    padding: 10px;
  }
  #articleDetail .title {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 10px;
  }
  #articleDetail .date {
    font-size: 12px;
    padding-bottom: 10px;
  }
  #articleDetail .detail {
    font-size: 14px;
  }
  #articleDetail .detail img {
    max-width: 100%;
  }
  #articleDetail pre{
    background: #333;
    padding: 8px 10px;
    color: #fff;
  }
  #articleDetail .photo{
    width: 180px;
    height: 100px;
    margin-bottom: 10px;
  }
  #articleDetail .photo img{
    width: 180px;
    height: 100px;
  }
</style>
