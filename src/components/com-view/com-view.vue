<template>
<div id="com-view" @keyup.enter="handleSubmit('submit')">
  <Form ref="comView" :model="model" :rules="rules" :inline="inline" :label-width="labelWidth" :label-position="labelPosition">
    <slot> </slot>
    <FormItem v-for="(item, index) in items" :key="index" :prop="item.prop" :label="item.label" :label-width="item.labelWidth">
      <template v-if="!item.button">
        <!-- 输入框 -->
        <Input v-if="!item.element" :type="item.type" v-model="model[item.prop]" :size="item.size" :placeholder="item.placeholder" :disabled="item.disabled" :icon="item.icon" :number="item.number" :rows="item.rows" :autosize="item.autosize" :maxlength="item.maxlength"></Input>
        <!-- 数字输入框 -->
        <InputNumber v-if="item.element === 'number'" :max="item.max" :min="item.min" v-model="model[item.prop]" :size="item.size" :disabled="item.disabled"></InputNumber>
        <!-- 选择器 -->
        <Select v-if="item.element === 'select'" v-model="model[item.prop]" :multiple="item.multiple" :disabled="item.disabled" :filterable="item.filterable" :size="item.size" :placeholder="item.placeholder" :style="{width: item.width + 'px'}">
          <Option v-for="(opt, index) in item.option" :key="index" :value="opt.value" :disabled="opt.disabled">{{ opt.label }}</Option>
        </Select>
        <!-- 日期选择器 -->
        <DatePicker v-if="item.element === 'date'" :type="item.type" v-model="model[item.prop]" :format="item.format" :placeholder="item.placeholder" :size="item.size" :disabled="item.disabled"></DatePicker>
        <!-- 时间选择器 -->
        <TimePicker v-if="item.element === 'time'" :type="item.type" v-model="model[item.prop]" :format="item.format" :placeholder="item.placeholder" :size="item.size" :disabled="item.disabled"></TimePicker>
        <!-- 单选框 -->
        <RadioGroup v-if="item.element === 'radio'" v-model="model[item.prop]" :type="item.type" :size="item.size" :vertical="item.vertical">
          <Radio v-for="(opt, index) in item.option" :key="index" :label="opt.value" :disabled="opt.disabled" :size="item.size">{{ opt.label }}</Radio>
        </RadioGroup>
        <!-- 多选框 -->
        <CheckboxGroup v-if="item.element === 'checkbox'" v-model="model[item.prop]" :size="item.size">
          <Checkbox v-for="(opt, index) in item.option" :key="index" :label="opt.value" :disabled="opt.disabled" :size="item.size">{{ opt.label }}</Checkbox>
        </CheckboxGroup>
        <Upload v-if="item.element === 'file'"
                :max-size="102400"
                :on-exceeded-size="handleMaxSize"
                :format="['jpg','jpeg','png']"
                :on-format-error="handleFormatError"
                :on-success="handleSuccess"
                :on-error="handleError"
                action="//jsonplaceholder.typicode.com/posts/">
          <Button type="default" icon="ios-cloud-upload-outline">请上传</Button>
        </Upload>
        <span v-if="item.element === 'file'">{{model.filename}} {{model.fileurl}}</span>
      </template>
      <template v-else>
        <!-- 按钮 -->
        <Button v-for="(item, index) in item.button" :key="index" :type="item.type" :long="item.long" :disabled="item.disabled" :loading="item.name === 'submit' ? btnLoading : false" :icon="item.icon" @click="handleSubmit(item.name)" class="button">{{ item.text }}</Button>
      </template>
    </FormItem>
    <slot name="foot"> </slot>
  </Form>
  <Spin v-if="loading" size="large" fix></Spin>
</div>
</template>
<script>
export default {
  name: 'com-view',
  props: {
    inline: Boolean, // 行内表单模式
    labelWidth: Number, // 表单域标签宽度
    labelPosition: String, // 表单域标签位置
    items: Array, // 表单元素数组
    model: Object, // 表单数据对象
    rules: Object, // 表单验证对象
    // 表单加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 按钮加载状态
    btnLoading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {

  },
  methods: {
    validate() {
      let validate = false
      // 对整个表单进行校验
      this.$refs['comForm'].validate(valid => {
        validate = valid
      })
      return validate
    },
    validateField(name) {
      // 对部分表单字段进行校验的方法
      this.$refs['comForm'].validateField(name)
    },
    resetFields() {
      // 对整个表单进行重置
      this.$refs['comForm'].resetFields()
    },
    handleSubmit(name) {
      if (name === 'submit') {
        // 对整个表单进行校验
        this.$refs['comForm'].validate(valid => {
          if (valid) {
            this.$emit('on-submit')
          }
        })
      } else if (name === 'reset') {
        this.resetFields()
        this.$emit('on-reset')
      } else {
        this.$emit('on-click')
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '请选择图片或PDF'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小',
        desc: '文件：  ' + file.name + ' 太大, 不能超过100M.'
      })
    },
    handleSuccess (response, file) {
      this.$Utils.global.fileName = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      this.$Utils.global.fileUrl = '7eb99afb9d5f317c912f08b5212fd69a'
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      file.name = '7eb99afb9d5f317c912f08b5212fd69a'
    },
    handleError (response, file) {
      this.$Notice.warning({
        title: '上传失败',
        desc: '请重新上传'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#com-form {
    position: relative;
    .button {
        margin-right: 8px;
        &:last-child {
            margin-right: 0;
        }
    }
    .hiddenClass{
      display: none;
    }
}
</style>
