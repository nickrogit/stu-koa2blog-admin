<template>
  <div id="articleUpdate">
    <Card>
      <div slot="title">
        <Icon type="ios-create"></Icon> {{title}}
      </div>
      <a href="#" slot="extra" @click.prevent="handleBack()">返回</a>
      <div>
        <Form ref="detailForm" :model="detailData" :rules="detailRule" :label-width="50">
          <FormItem label="标题" prop="title">
            <Input v-model="detailData.title" placeholder="请输入文章标题" size="large" :maxlength="20"  style="width: 300px"></Input>
          </FormItem>
          <FormItem label="时间" prop="date">
            <DatePicker v-model="detailData.date" type="date" format="yyyy-MM-dd" :editable="false" :clearable="false" placeholder="请选择时间" style="width: 120px"></DatePicker>
          </FormItem>
          <FormItem label="标签" prop="tags">
            <CheckboxGroup v-model="detailData.tags">
              <Checkbox v-for="(opt, index) in tagsOption" :key="index" :label="opt.value">{{ opt.label }}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="封面" prop="photo">
            <div class="photo" v-if="detailData.photo">
              <img :src="detailData.photo">
            </div>
            <Upload
              ref="upload"
              :show-upload-list="false"
              :max-size="upload.maxsize"
              :format="upload.format"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBefore"
              :on-format-error="handleFormatError"
              :on-success="handleSuccess"
              :on-error="handleError"
              :data="upload.param"
              :headers = 'upload.headers'
              :action="upload.uploadUrl"
              style="">
              <Button type="default" :loading="upload.fileLoading" icon="ios-cloud-upload-outline">上传图片</Button>
            </Upload>
          </FormItem>
          <FormItem label="详情" prop="detail">
            <!--<Input v-model="detailData.detail" type="textarea" :rows="8" placeholder="请输入详情" style="width: 800px"></Input>-->
            <ckeditor :editor="editor" v-model="detailData.detail" :config="editorConfig"></ckeditor>
          </FormItem>
          <FormItem label="">
            <Button type="primary" :loading="loading.btn" long @click="submitArticle('detailForm')" size="large" style="width: 180px;">提交</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
    <Spin v-if="loading.page" size="large" fix></Spin>
  </div>
</template>

<script>
  import config from '@/config'
  import dayjs from 'dayjs'
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
  import {getTagsList, getArticleDetail, updateArticle} from '@/services/api'

export default {
  data() {
    return {
      upload: {
        maxsize: 102400,
        format: ['jpg', 'jpeg', 'png'],
        param: {},
        headers: {},
        uploadUrl: config.baseURL + '/uploadFile',
        fileLoading: false
      },
      editor: ClassicEditor,
      editorConfig: {
        // toolbar: [ 'bold', 'italic' ],
        language: 'zh',
        ckfinder: {
          uploadUrl: config.baseURL + '/uploadFile' // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段,
        },
        image: {
          styles: ['full', 'side']
        }
      },
      tagsOption: [],
      title: '添加文章',
      id: '',
      detailData: {
        id: '',
        title: '',
        date: '',
        tags: [],
        photo: '',
        detail: ''
      },
      detailRule: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        /* date: [{ required: true, message: '请选择日期', trigger: 'change' }], */
        tags: [{ required: true, type: 'array', min: 1, message: '选择标签', trigger: 'change' }],
        photo: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入详情', trigger: 'blur' }]
      },
      loading: {
        page: false,
        form: false,
        btn: false
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.detailData.id = Number(this.$route.query.id)
      this.handleDetail()
    } else {
      this.detailData.date = dayjs(new Date()).format('YYYY-MM-DD')
      this.handleTags()
    }
  },
  methods: {
    setHeaders() {
      const user = JSON.parse(localStorage.getItem('userK'))
      if (user) {
        this.upload.headers = {
          Authorization: user.token
        }
      }
    },
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
    handleDetail(type) {
      this.loading.page = true
      let para = {
        id: this.detailData.id
      }
      getArticleDetail(para).then(res => {
        if (res.code === 200) {
          this.detailData.title = res.data.title
          this.detailData.date = dayjs(res.data.date).format('YYYY-MM-DD')
          this.detailData.tags = String(res.data.tags).split(',')
          this.detailData.detail = res.data.detail
          this.detailData.photo = res.data.photo || null
          this.handleTags()
        }
        this.loading.page = false
      }).catch(() => {
        this.loading.page = false
      })
    },
    submitArticle(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading.btn = true
          let para = {
            id: this.detailData.id,
            title: this.detailData.title,
            date: dayjs(this.detailData.date).format('YYYY-MM-DD'), // dayjs(this.detailData.date).valueOf(),
            tags: this.detailData.tags.join(','),
            photo: this.detailData.photo,
            detail: this.detailData.detail
          }
          updateArticle(para).then(res => {
            if (res.code === 200) {
              this.$Message.success('提交成功')
              this.handleBack()
            }
            this.loading.btn = false
          }).catch(() => {
            this.loading.btn = false
          })
        }
      })
    },
    handleBack() {
      this.$router.push({path: '/article/articleList'})
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '图片文件格式不正确，请重新上传。'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小',
        desc: '文件太大, 请重新上传。'
      })
    },
    handleError (response, file) {
      this.$Notice.warning({
        title: '上传失败',
        desc: '请重新上传'
      })
    },
    handleBefore () {
      this.upload.fileLoading = true
    },
    handleSuccess (res, file) {
      if (res.code === 200) {
        this.$Message.success('上传成功')
        this.detailData.photo = res.data.absolutePath
        this.upload.fileLoading = false
      } else {
        this.upload.fileLoading = false
        this.$Notice.warning({
          title: '上传失败',
          desc: res.msg
        })
      }
    }
  }
}
</script>
<style>
  #articleUpdate{
    padding: 10px;
  }
  #articleUpdate .title {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 10px;
  }
  #articleUpdate .date {
    font-size: 12px;
    padding-bottom: 10px;
  }
  #articleUpdate .detail {
    font-size: 14px;
  }
  #articleUpdate .detail img {
    max-width: 100%;
  }
  #articleUpdate pre{
    background: #333;
    padding: 8px 10px;
    color: #fff;
  }
  #articleUpdate .photo{
    width: 180px;
    height: 100px;
  }
  #articleUpdate .photo img{
    width: 180px;
    height: 100px;
  }
</style>
