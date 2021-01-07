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
      <a-form-model-item ref="tel" label="电话" prop="tel">
        <a-input v-model="form.tel" placeholder="请输入电话" />
      </a-form-model-item>
      <a-form-model-item ref="banner" label="Banner" prop="banner">
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
        ></wang-editor>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSave">确定</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script>
import { getDoctor, saveDoctor } from '@/api'
import WangEditor from '@/components/WangEditor'
import Computed from '@/components/Computed'

export default {
  name: 'doctor',
  metaInfo: {
    title: '药师管理',
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
        banner: '',
        content: '',
        tel: ''
      },
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      fileList: []
    }
  },
  components: {
    WangEditor
  },
  mounted() {
    this.getDoctor()
  },
  methods: {
    async getDoctor() {
      let response = await getDoctor()
      if (response.code == 200 && response.data) {
        this.form.id = response.data.id
        this.form.title = response.data.title
        this.form.banner = response.data.banner
        this.form.content = response.data.content
        this.form.tel = response.data.tel
        this.fileList.push({
          uid: 1,
          name: '图片',
          status: 'done',
          url: response.data.banner
        })
      }
    },
    onSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm({
            title: '确定提交？',
            content: '您即将提交一个修改',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
              let response = await saveDoctor(this.form)
              if (response.code == 200) {
                this.$message.success('保存成功')
              }
            },
            onCancel: () => {
              //
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
          this.form.banner = file.response.data.url
        }
      }
    },
    handleRemove(file) {
      this.fileList = []
      this.form.activityBanner = null
    },
    updateContent(content) {
      this.form.content = content
    }
  }
}
</script>
