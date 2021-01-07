<template>
  <a-spin :spinning="spinning">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="groupTitle" label="标题" prop="groupTitle">
        <a-input v-model="form.groupTitle" placeholder="请输入标题" />
      </a-form-model-item>
      <a-form-model-item ref="groupBanner" label="Banner" prop="groupBanner">
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
      <a-form-model-item label="内容" prop="groupContent">
        <wang-editor
          ref="editor"
          :content="form.groupContent"
          @update-content="updateContent"
        ></wang-editor>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="isUpdate ? onUpdate() : onSave()">确定</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script>
import { getGroup, saveGroup } from '@/api'
import WangEditor from '@/components/WangEditor'
import Computed from '@/components/Computed'

export default {
  name: 'group',
  metaInfo: {
    title: '集团管理',
    titleTemplate: '%s | 中康智慧药箱'
  },
  ...Computed,
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        groupId: '',
        groupTitle: '',
        groupBanner: '',
        groupContent: ''
      },
      rules: {
        groupTitle: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        groupContent: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      fileList: [],
      isUpdate: false
    }
  },
  components: {
    WangEditor
  },
  mounted() {
    this.getGroup()
  },
  methods: {
    async getGroup() {
      let response = await getGroup()
      if (response.code == 200 && response.data) {
        this.form.groupId = response.data.groupId
        this.form.groupTitle = response.data.groupTitle
        this.form.groupBanner = response.data.groupBanner
        this.form.groupContent = response.data.groupContent
        this.fileList.push({
          uid: 1,
          name: '图片',
          status: 'done',
          url: response.data.groupBanner
        })
      }
    },
    onSave() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.$confirm({
            title: '确定提交？',
            content: '您即将提交一个修改',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
              let response = await saveGroup(this.form)
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
          this.form.groupBanner = file.response.data.url
        }
      }
    },
    handleRemove(file) {
      this.fileList = []
      this.form.groupBanner = null
    },
    updateContent(content) {
      this.form.groupContent = content
    }
  }
}
</script>
