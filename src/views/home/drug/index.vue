<template>
  <div>
    <div class="table-operator">
      <a-button type="primary" @click="onModelSave">{{ $t('describes.BPrimary') }}</a-button>
      <a-button type="danger" class="button-left" @click="onAnyDelete">{{
        $t('describes.BDanger')
      }}</a-button>
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
        <a-table-column title="药品编号" data-index="drugNo"></a-table-column>
        <a-table-column title="药品名称" data-index="drugName"></a-table-column>
        <a-table-column title="药品价格" data-index="drugPrice"></a-table-column>
      </a-table>
    </a-spin>
    <a-modal
      title="新增活动药品"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :okText="$t('describes.FPrimary')"
      :cancelText="$t('describes.FDefault')"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" :model="form">
        <a-form-model-item label="选择药品分类">
          <a-select
            @change="handleCategoryChange"
            :loading="loading"
            placeholder="请选择药品分类"
            style="width: 320px"
          >
            <a-select-option v-for="category in categories" :key="category.drugTypeId">
              {{ category.drugType }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="选择药品">
          <a-select
            mode="multiple"
            :value="selectedDrugs"
            @change="handleDrugChange"
            :loading="loadingDrug"
            placeholder="请选择药品"
            style="width: 350px;"
          >
            <a-select-option v-for="drug in drugs" :key="drug.drugNo">
              {{ drug.drugName + `(${drug.drugNo})` }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  getActivityDrugs,
  deleteActivityDrugs,
  saveActivityDrug,
  getDrugCategories,
  getDrugs
} from '@/api'

import Computed from '@/components/Computed'

export default {
  name: 'medicine',
  metaInfo: {
    title: '活动药品管理',
    titleTemplate: '%s | 中康智慧药箱'
  },
  ...Computed,
  data() {
    return {
      data: [],
      categories: [],
      drugs: [],
      selectedRowKeys: [],
      selectedRowIds: [],
      selectedDrugs: [],
      selectedDrugsParams: [],
      confirmLoading: false,
      loading: true,
      loadingDrug: true,
      visible: false,
      form: {}
    }
  },
  created() {
    this.getActivityDrugs()
  },
  methods: {
    async getActivityDrugs() {
      let response = await getActivityDrugs({
        activityId: this.$route.query.activityId,
        medicineNo: this.$route.query.medicineNo
      })
      if (response.code == 200) {
        this.data = response.data.records
      }
    },
    async getDrugCategories() {
      let response = await getDrugCategories({
        medicineNo: this.$route.query.medicineNo
      })
      if (response.code == 200) {
        this.categories = response.data
        this.loading = false
      }
    },
    async getDrugs(drugTypeId) {
      let response = await getDrugs({
        medicineNo: this.$route.query.medicineNo,
        drugTypeId: drugTypeId,
        currentPage: 1,
        pageSize: 100
      })
      if (response.code == 200) {
        this.drugs = response.data.records
        this.loadingDrug = false
      }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    async onAnyDelete() {
      let length = this.selectedRowKeys.length
      if (length > 0) {
        this.$confirm({
          title: '确定删除？',
          content: `以下 ${length} 条数据会被删除`,
          onOk: async () => {
            let response = await deleteActivityDrugs(this.selectedRowIds)
            if (response.code == 200) {
              this.setSelectedRowKeysEmpty()
              this.getActivityDrugs()
              this.$message.success('删除成功')
            }
          },
          onCancel: () => {
            //
          }
        })
      } else {
        this.$message.warning(this.$t('messages.limit'))
      }
    },
    onModelSave() {
      this.setSelectedDrugsEmpty()
      this.showModal()
    },
    showModal() {
      this.getDrugCategories()
      this.visible = true
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$confirm({
            title: '确定提交？',
            content: '您即将提交活动药品',
            onOk: async () => {
              let response = await saveActivityDrug(this.selectedDrugsParams)

              if (response.code == 'ACTIVITY_HAVE_DRUG') {
                this.$message.warning(response.message)
              }

              if (response.code == 200) {
                this.$message.success('保存成功')
                this.visible = false
                this.getActivityDrugs()
              }
            },
            onCancel: () => {
              //
            }
          })
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleCategoryChange(drugTypeId) {
      this.setSelectedDrugsEmpty()
      this.getDrugs(drugTypeId)
    },
    handleDrugChange(drugNos) {
      this.selectedDrugs = drugNos
      this.selectedDrugsParams = drugNos.map(drugNo => {
        return {
          activityId: this.$route.query.activityId,
          medicineNo: this.$route.query.medicineNo,
          drugNo: drugNo
        }
      })
    },
    setSelectedDrugsEmpty() {
      this.selectedDrugs = []
      this.selectedDrugsParams = []
      return this
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
