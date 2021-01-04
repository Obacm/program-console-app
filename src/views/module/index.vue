<template>
  <div>
    <div class="table-operator">
      <a-button type="primary" @click="onNavigationSave">新增</a-button>
      <a-button type="default" class="button-left" @click="onNavigationUpdate"
        >修改</a-button
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
        <a-table-column title="模块标题" data-index="title"></a-table-column>
        <a-table-column title="模块Banner" data-index="bannerUrl">
          <template slot-scope="bannerUrl">
            <span>
              <img :src="bannerUrl" class="banner" />
            </span>
          </template>
        </a-table-column>
        <a-table-column title="上架/下架" data-index="status">
          <template slot-scope="status">
            <a-button type="danger" v-if="status === 1" @click="onAnyOff">
              下架
            </a-button>
            <a-button type="primary" v-else @click="onAnyPut">
              上架
            </a-button>
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
import { getModules, offModules, putModules, deleteModules } from '@/api'
import Computed from '@/components/Computed'

export default {
  name: 'module',
  metaInfo: {
    title: '模块管理',
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
    this.getModules()
  },
  methods: {
    async getModules() {
      let response = await getModules()
      if (response.code == 200) {
        this.data = response.data.records
      }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onNavigationSave() {
      this.$router.push({ path: 'module-editor' })
    },
    onNavigationUpdate() {
      if (this.selectedRowKeys.length === 1) {
        this.$router.push({
          path: 'module-editor',
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
            let response = await offModules(this.selectedRowIds)
            if (response.code == 200) {
              this.getModules()
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
            let response = await putModules(this.selectedRowIds)
            if (response.code == 200) {
              this.getModules()
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
            let response = await deleteModules(this.selectedRowIds)
            if (response.code == 200) {
              this.getModules()
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