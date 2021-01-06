<template>
  <div>
    <div v-if="$route.meta.visible">
      <div class="table-operator">
        <a-button type="primary" @click="onNavigationSave">新增</a-button>
        <a-button type="default" class="button-left" @click="onNavigationUpdate"
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
          rowKey="id"
          :data-source="data"
          :pagination="false"
          bordered
        >
          <a-table-column title="公告标题" data-index="title"></a-table-column>
          <a-table-column title="公告Banner" data-index="bannerUrl">
            <template slot-scope="bannerUrl">
              <span>
                <img :src="bannerUrl" class="banner" />
              </span>
            </template>
          </a-table-column>
          <a-table-column
            title="创建日期"
            data-index="createDate"
          ></a-table-column>
          <a-table-column title="状态" data-index="status">
            <template slot-scope="status">
              <span v-if="status === 1" style="color: #28a745">已上架</span>
              <span v-if="status === 2" style="color: #ffc107">已下架</span>
            </template>
          </a-table-column>
        </a-table>
      </a-spin>
    </div>
    <router-view else />
  </div>
</template>

<script>
import { getNotices, offNotices, putNotices, deleteNotices } from '@/api'
import Computed from '@/components/Computed'

export default {
  name: 'notice',
  metaInfo: {
    title: '公告管理',
    titleTemplate: '%s | 中康智慧药箱'
  },
  ...Computed,
  data() {
    return {
      data: [],
      selectedRowKeys: [],
      selectedRowIds: []
    }
  },
  created() {
    this.getNotices()
  },
  methods: {
    async getNotices() {
      let response = await getNotices()
      if (response.code == 200) {
        this.data = response.data.records
      }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onNavigationSave() {
      this.$router.push({ path: 'notice-editor' })
    },
    onNavigationUpdate() {
      if (this.selectedRowKeys.length === 1) {
        this.$router.push({
          path: 'notice-editor',
          query: this.selectedRowIds[0]
        })
      } else {
        this.$message.warning('请选择一条修改')
      }
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
            let response = await offNotices(this.selectedRowIds)
            if (response.code == 200) {
              this.getNotices()
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
            let response = await putNotices(this.selectedRowIds)
            if (response.code == 200) {
              this.getNotices()
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
            let response = await deleteNotices(this.selectedRowIds)
            if (response.code == 200) {
              this.setSelectedRowKeysEmpty()
              this.getNotices()
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
    confirm(title, content, method) {
      this.$confirm({
        title: title,
        content: content,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          if (typeof method === 'function') {
            method()
          }
          this.$message.success('删除成功')
        },
        onCancel: () => {
          console.log('Cancel')
        }
      })
    },
    setSelectedRowKeysEmpty() {
      this.selectedRowKeys = []
      return this
    }
  },
  watch: {
    selectedRowKeys() {
      this.selectedRowIds = this.selectedRowKeys.map(row => {
        return {
          id: row
        }
      })
    }
  }
}
</script>
