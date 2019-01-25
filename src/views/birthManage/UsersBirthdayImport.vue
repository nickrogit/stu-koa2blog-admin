<template>
<div id="usersimport" class="rbox">
  <Card>
    <div slot="title">
      <Icon type="ios-list-outline"></Icon> 批量上传
    </div>

    <div>
      <Upload
        :on-success="handleSuccess"
        :on-error="handleError"
        :format="['xlsx','xls']"
        :max-size="204800"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleUpload"
        action="//jsonplaceholder.typicode.com/posts/">
        <Button type="default" icon="ios-cloud-upload-outline">请选择上传文件</Button>
      </Upload>
      <div v-if="file !== null">上传文件: {{ file.name }} <Button type="primary" @click="upload" :loading="loadingStatus">{{ loadingStatus ? '上传中...' : '上传' }}</Button></div>
      <br/>
      <a href="" target="_blank">下载导入模板</a>
    </div>

  </Card>
</div>
</template>
<script>

export default {
  data() {
    return {
      file: null,
      loadingStatus: false,
      uploadList: []
    }
  },
  mounted() {

  },
  methods: {
    handleUpload (file) {
      this.file = file
      return false
    },
    upload () {
      this.loadingStatus = true
      /* setTimeout(() => {
        this.file = null
        this.loadingStatus = false
        this.$Message.success('Success')
      }, 1500) */
    },
    handleSuccess (res, file) {
      this.file = null
      this.loadingStatus = false
      this.$Message.success('Success')
    },
    handleError (err, file) {
      this.$Notice.warning({
        title: '上传失败',
        desc: err
      })
      this.file = null
      this.loadingStatus = false
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件须为表格'
      })
      this.file = null
      this.loadingStatus = false
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出上传文件量范围',
        desc: '文件最大支持200M.'
      })
      this.file = null
      this.loadingStatus = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .rbox{
    height: calc(100vh - 60px - 32px - 32px);
  }
</style>
