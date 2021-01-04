<template>
  <a-spin :spinning="spinning">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="title" label="标题" prop="title">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-model-item>
      <a-form-model-item ref="bannerUrl" label="Banner" prop="bannerUrl">
        <a-upload
          :action="uploadURL"
          :file-list="fileList"
          :multiple="false"
          :withCredentials="true"
          name="wechatFile"
          @change="handleChange"
          :beforeUpload="handleBeforeUpload"
          :remove="handleRemove"
          list-type="picture"
          accept="image/png, image/jpeg"
          class="upload-list-inline"
        >
          <a-button> <a-icon type="upload" /> 上传 </a-button>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item label="内容" prop="content">
        <wang-editor
          ref="editor"
          :content="form.content"
          @update-content="updateContent"
          v-if="isReset"
        ></wang-editor>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button @click="onCancel">取消</a-button>
        <a-button
          style="margin-left: 10px"
          type="primary"
          @click="isUpdate ? onUpdate() : onSave()"
          >确定</a-button
        >
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script>
import { getNotice, saveNotice } from '@/api'
import WangEditor from '@/components/WangEditor'
import Computed from '@/components/Computed'

export default {
  name: 'notice-editor',
  metaInfo: {
    title: '公告编辑',
    titleTemplate: '%s | 中康智慧药箱'
  },
  ...Computed,
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        id: '',
        title: '',
        bannerUrl: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      fileList: [],
      isUpdate: false,
      isReset: false
    }
  },
  components: {
    WangEditor
  },
  mounted() {
    console.log(this.$router)
    if (this.$route.query.id) {
      this.isUpdate = true
      this.getNotice(this.$route.query.id)
    } else {
      this.isUpdate = false
      this.isReset = true
    }
  },
  methods: {
    async getNotice(id) {
      let response = await getNotice({ id: id })
      if (response.code == 200 && response.data) {
        this.form.title = response.data.title
        this.form.bannerUrl = response.data.bannerUrl
        this.form.content = response.data.content
        this.fileList.push({
          uid: 1,
          name: '图片',
          status: 'done',
          url: response.data.bannerUrl
        })
      }
      this.isReset = true
    },
    onSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm({
            title: '确定提交？',
            content: '您即将提交一个公告',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
              let response = await saveNotice(this.form)
              if (response.code == 200) {
                this.$message.success('保存成功')
              }
            },
            onCancel: () => {
              console.log('Cancel')
            }
          })
        }
      })
    },
    onUpdate() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm({
            title: '确定提交？',
            content: '您即将提交一个公告',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
              this.form.id = this.$route.query.id
              let response = await saveNotice(this.form)
              if (response.code == 200) {
                this.$message.success('保存成功')
              }
            },
            onCancel: () => {
              console.log('Cancel')
            }
          })
        }
      })
    },
    handleBeforeUpload(file, fileList) {
      if (this.fileList.length >= 1) {
        this.$message.warning('只能上传一张图片')
        return Promise.reject(false)
      }
    },
    handleChange({ file, fileList }) {
      this.fileList = [...fileList]
      if (file.status === 'done') {
        if (file.response.code == 200) {
          this.form.bannerUrl = file.response.data.url
        }
      }
    },
    updateContent(content) {
      this.form.content = content
    },
    handleRemove(file) {
      this.fileList = []
      this.form.bannerUrl = null
    },
    onCancel() {
      this.$router.go(-1)
    }
  }
}
</script>
