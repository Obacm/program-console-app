<template>
  <div>
    <div class="table-operator">
      <a-button type="primary" @click="onModelSave">新增</a-button>
      <a-button type="default" class="button-left" @click="onActivityModal"
        >修改</a-button
      >
      <a-button
        class="button-left"
        @click="onAnyOff"
        style="background-color: #ffc107; color: #fff"
        >下架</a-button
      >
      <a-button
        class="button-left"
        @click="onAnyPut"
        style="background-color: #28a745; color: #fff"
        >上架</a-button
      >
      <a-button type="danger" class="button-left" @click="onAnyDelete"
        >删除</a-button
      >
    </div>
    <a-spin :spinning="spinning">
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        rowKey="activityId"
        :data-source="data"
        :pagination="false"
        bordered
      >
        <a-table-column
          title="活动名称"
          data-index="activityName"
        ></a-table-column>
        <a-table-column title="活动Banner" data-index="activityBanner">
          <template slot-scope="activityBanner">
            <span>
              <img :src="activityBanner" class="banner" />
            </span>
          </template>
        </a-table-column>
        <a-table-column
          title="创建日期"
          data-index="createDate"
        ></a-table-column>
        <a-table-column title="状态" data-index="status">
          <template slot-scope="status">
            <span v-if="status === 0" style="color: #28a745">已上架</span>
            <span v-if="status === 1" style="color: #ffc107">已下架</span>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="activityId">
          <template slot-scope="activityId">
            <router-link
              :to="{ path: 'medicine', query: { activityId: activityId } }"
            >
              查看
            </router-link>
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
    <a-modal
      title="新增活动"
      :visible="visible"
      :confirm-loading="confirmLoading"
      okText="确定"
      cancelText="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item label="选择活动模块">
          <a-select
            v-model="form.activityName"
            style="width: 210px;"
            placeholder="请选择活动模块"
            @change="handleActivityName"
            :loading="loading"
          >
            <a-select-option
              v-for="activity in _.uniq(activities)"
              :key="activity.activityName"
            >
              {{ activity.activityName }}
            </a-select-option>
          </a-select>
          <a-button
            type="primary"
            style="margin-left: 15px"
            @click="showOtherModal"
          >
            新增
          </a-button>
        </a-form-model-item>
        <a-form-model-item
          ref="activityBanner"
          label="Banner"
          prop="activityBanner"
        >
          <a-upload
            :action="uploadURL"
            :file-list="fileList"
            :multiple="false"
            :withCredentials="true"
            :remove="handleRemove"
            :beforeUpload="handleBeforeUpload"
            name="wechatFile"
            @change="handleChange"
            list-type="picture"
            accept="image/png, image/jpeg"
            class="upload-list-inline"
          >
            <a-button> <a-icon type="upload" /> 上传 </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      title="添加活动名称"
      :visible="visibleOther"
      okText="确定"
      cancelText="取消"
      @ok="handleOtherOk"
      @cancel="handleOtherCancel"
    >
      <a-form-model-item label="活动名称">
        <a-input v-model="activityName" placeholder="请输入活动名称" />
      </a-form-model-item>
    </a-modal>
    <a-modal
      title="编辑活动"
      :visible="visibleSave"
      :confirm-loading="confirmLoading"
      okText="确定"
      cancelText="取消"
      @ok="handleSaveOk"
      @cancel="handleSaveCancel"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-form-model-item
          ref="activityName"
          label="活动名称"
          prop="activityName"
        >
          <a-input v-model="form.activityName" placeholder="请输入活动名称" />
        </a-form-model-item>
        <a-form-model-item
          ref="activityBanner"
          label="Banner"
          prop="activityBanner"
        >
          <a-upload
            :action="uploadURL"
            :file-list="fileList"
            :multiple="false"
            :withCredentials="true"
            :remove="handleRemove"
            :beforeUpload="handleBeforeUpload"
            name="wechatFile"
            @change="handleChange"
            list-type="picture"
            accept="image/png, image/jpeg"
            class="upload-list-inline"
          >
            <a-button> <a-icon type="upload" /> 上传 </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal
      title="添加活动名称"
      :visible="visibleOther"
      okText="确定"
      cancelText="取消"
      @ok="handleOtherOk"
      @cancel="handleOtherCancel"
    >
      <a-form-model-item label="活动名称">
        <a-input v-model="activityName" placeholder="请输入活动名称" />
      </a-form-model-item>
    </a-modal>
  </div>
</template>

<script>
import {
  getActivities,
  offActivities,
  putActivities,
  deleteActivities,
  getActivity,
  saveActivity
} from '@/api'

import Computed from '@/components/Computed'

export default {
  name: 'home',
  metaInfo: {
    title: '活动管理',
    titleTemplate: '%s | 中康智慧药箱'
  },
  ...Computed,
  data() {
    return {
      data: [],
      selectedRowKeys: [],
      selectedRowIds: [],
      fileList: [],
      visible: false,
      visibleOther: false,
      visibleSave: false,
      confirmLoading: false,
      loading: true,
      loadingMedicine: true,
      provinces: [],
      cities: [],
      medicines: [],
      activities: [],
      activityName: '',
      isAction: false,
      form: {
        activityId: '',
        activityName: '',
        activityBanner: '',
        status: 0
      },
      rules: {
        activityName: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getActivities()
    this.setName('活动管理')
  },
  methods: {
    setName(describe) {
      this.$store.commit('SET_NAME', describe)
    },
    setNext(describe) {
      this.$store.commit('SET_NEXT', describe)
    },
    async getActivities() {
      let response = await getActivities()
      if (response.code == 200) {
        this.data = response.data.records
        this.activities = this.data.map(item => {
          return {
            activityName: item.activityName,
            activityBanner: item.activityBanner
          }
        })
        this.loading = false
      }
    },
    async getActivity(id) {
      this.setFileListEmpty()
      let response = await getActivity(id)
      if (response.code == 200) {
        this.form.activityId = response.data.activityId
        this.form.activityName = response.data.activityName
        this.form.activityBanner = response.data.activityBanner
        this.setFileList(response.data.activityBanner)
      }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onModelSave() {
      this.setIsAction(false)
        .setFormEmpty()
        .setFileListEmpty()
      this.showModal()
    },
    onAnyOff() {
      let length = this.selectedRowKeys.length
      if (length > 0) {
        this.$confirm({
          title: '确定下架？',
          content: `以下 ${length} 条数据会被下架`,
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            let response = await offActivities(this.selectedRowIds)
            if (response.code == 200) {
              this.getActivities()
              this.$message.success('下架成功')
            }
          },
          onCancel: () => {
            console.log('Cancel')
          }
        })
      } else {
        this.$message.warning('至少选择一条数据')
      }
    },
    async onAnyPut() {
      let length = this.selectedRowKeys.length
      if (length > 0) {
        this.$confirm({
          title: '确定上架？',
          content: `以下 ${length} 条数据会被上架`,
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            let response = await putActivities(this.selectedRowIds)
            if (response.code == 200) {
              this.getActivities()
              this.$message.success('上架成功')
            }
          },
          onCancel: () => {
            console.log('Cancel')
          }
        })
      } else {
        this.$message.warning('至少选择一条数据')
      }
    },
    async onAnyDelete() {
      let length = this.selectedRowKeys.length
      if (length > 0) {
        this.$confirm({
          title: '确定删除？',
          content: `以下 ${length} 条数据会被删除`,
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            let response = await deleteActivities(this.selectedRowIds)
            if (response.code == 200) {
              this.setSelectedRowKeysEmpty()
              this.getActivities()
              this.$message.success('删除成功')
            }
          },
          onCancel: () => {
            console.log('Cancel')
          }
        })
      } else {
        this.$message.warning('至少选择一条数据')
      }
    },
    showModal() {
      this.visible = true
    },
    showSaveModal() {
      this.visibleSave = true
    },
    showOtherModal() {
      this.visibleOther = true
    },
    onActivityModal() {
      if (this.selectedRowKeys.length === 1) {
        this.setIsAction(true)
          .setFormEmpty()
          .setFileListEmpty()
        this.getActivity(this.selectedRowIds[0])
        this.showSaveModal()
      } else {
        this.$message.warning('请选择一条修改')
      }
    },
    handleActivity(activityId) {
      let item = this.data.find(item => {
        return item.activityId === activityId
      })
      this.form.activityName = item.activityName
    },
    handleActivityName(activityName) {
      this.form.activityName = activityName
      let item = this.activities.find(item => {
        return item.activityName === activityName
      })
      if (item) {
        this.setFileListEmpty()
        this.form.activityBanner = item.activityBanner
        this.setFileList(item.activityBanner)
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm({
            title: '确定提交？',
            content: '您即将提交一个活动',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
              let response = await saveActivity(this.form)

              if (response.code == 'HAVE_SAME_ACTIVITY') {
                this.$message.warning(response.message)
              }

              if (response.code == 200) {
                this.$message.success('保存成功')
                this.visible = false
                this.getActivities()
              }
            },
            onCancel: () => {
              console.log('Cancel')
            }
          })
        }
      })
    },
    handleSaveOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm({
            title: '确定提交？',
            content: '您即将提交一个活动',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
              let response = await saveActivity(this.form)

              if (response.code == 'HAVE_SAME_ACTIVITY') {
                this.$message.warning(response.message)
              }

              if (response.code == 200) {
                this.$message.success('保存成功')
                this.visibleSave = false
                this.getActivities()
              }
            },
            onCancel: () => {
              console.log('Cancel')
            }
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleOtherOk() {
      this.activities.push({
        activityName: this.activityName,
        activityBanner: null
      })
      this.visibleOther = false
    },
    handleSaveCancel() {
      this.visibleSave = false
    },
    handleOtherCancel() {
      this.visibleOther = false
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
          this.form.activityBanner = file.response.data.url
        }
      }
    },
    handleRemove(file) {
      this.setFileListEmpty()
      this.form.activityBanner = null
    },
    setFormEmpty() {
      this.form.activityId = ''
      this.form.activityName = ''
      this.form.activityBanner = ''
      return this
    },
    setFileListEmpty() {
      this.fileList = []
      return this
    },
    setIsAction(value) {
      if (value) {
        this.isAction = true
      } else {
        this.isAction = false
        this.form.activityId = null
      }
      return this
    },
    setSelectedRowKeysEmpty() {
      this.selectedRowKeys = []
      return this
    },
    setFileList(url) {
      this.fileList.push({
        uid: 1,
        name: '图片',
        status: 'done',
        url: url
      })
    }
  },
  watch: {
    selectedRowKeys() {
      this.selectedRowIds = this.selectedRowKeys.map(row => {
        return {
          activityId: row
        }
      })
    }
  }
}
</script>