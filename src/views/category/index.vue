<template>
  <div>
    <div v-if="$route.meta.visible">
      <div class="table-search-wrapper">
        <a-input-group compact>
          <a-select
            v-model="provinceId"
            @change="handleProvinceChange"
            placeholder="请选择省份"
            style="width: 15%; margin-left: 20px;"
          >
            <a-select-option v-for="province in provinces" :key="province.id">
              {{ province.name }}
            </a-select-option>
          </a-select>
          <a-select
            v-model="cityId"
            @change="handleCityChange"
            :loading="loading"
            placeholder="请选择城市"
            style="width: 15%; margin-left: 20px;"
          >
            <a-select-option v-for="city in cities" :key="city.id">
              {{ city.name }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="getMedicineCities" style="margin-left: 20px;"
            >查询</a-button
          >
          <a-button type="danger" @click="onClear" style="margin-left: 20px;">清空</a-button>
        </a-input-group>
      </div>
      <div class="table-operator">
        <a-button type="danger" class="button-left" @click="onModelSave">设置</a-button>
      </div>
      <a-spin :spinning="spinning">
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange
          }"
          rowKey="medicineId"
          :data-source="data"
          :pagination="pagination"
          @change="handleTableChange"
          bordered
        >
          <a-table-column title="省份" data-index="provinceName"></a-table-column>
          <a-table-column title="城市" data-index="cityName">
            <template slot-scope="text, item">
              <router-link
                @click.native="
                  setHistories({
                    path: `category-medicine?cityId=${item.cityId}`,
                    meta: {
                      name: item.cityName
                    }
                  })
                "
                :to="{
                  path: 'category-medicine',
                  query: {
                    cityId: item.cityId
                  }
                }"
              >
                {{ item.cityName }}
              </router-link>
            </template>
          </a-table-column>
          <a-table-column title="药箱数量" data-index="medicineNumber"></a-table-column>
          <a-table-column title="分类状态" data-index="drugTypeStatus"></a-table-column>
          <a-table-column title="分类异常明细" data-index="noShowDrugTypeName"></a-table-column>
        </a-table>
      </a-spin>
    </div>
    <a-modal
      title="设置"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :okText="$t('describes.FPrimary')"
      :cancelText="$t('describes.FDefault')"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm">
        <a-form-model-item label="当前所选城市名称">
          <div v-for="row in selectedRows" :key="row.medicineId">
            {{ row.provinceName }} {{ row.cityName }}
          </div>
        </a-form-model-item>
        <a-form-model-item label="选择药品分类(可多选)">
          <a-select
            label-in-value
            mode="multiple"
            :value="selectedDrugs"
            @change="handleCategoryChange"
            :loading="loading"
            placeholder="请选择药品分类"
            style="width: 150px"
          >
            <a-select-option v-for="category in categories" :key="category.drugTypeId">
              {{ category.drugType }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <router-view else />
  </div>
</template>

<script>
import {
  getMedicineCities,
  getMedicinesByCity,
  setCityMedicineDrugType,
  getDrugClassification,
  getCities
} from '@/api'
import Computed from '@/components/Computed'

export default {
  name: 'category',
  metaInfo: {
    title: '药箱管理',
    titleTemplate: '%s | 中康智慧药箱'
  },
  ...Computed,
  data() {
    return {
      data: [],
      selectedRowKeys: [],
      selectedRows: [],
      provinces: [],
      cities: [],
      categories: [],
      selectedDrugs: [],
      provinceId: undefined,
      cityId: undefined,
      loading: false,
      visible: false,
      confirmLoading: false,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        current: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.getCities(1)
    this.getDrugClassification()
    this.getMedicineCities()
  },
  methods: {
    setHistories(history) {
      this.$store.commit('SET_HOSTORIES', { history: history, type: false })
    },
    async getMedicineCities() {
      let response = await getMedicineCities({
        provinceId: this.provinceId,
        cityId: this.cityId,
        currentPage: this.pagination.current,
        pageSize: this.pagination.pageSize
      })
      if (response.code == 200) {
        this.setSelectedRowKeysEmpty()
        this.data = response.data.records
        this.pagination.total = response.data.total
      }
    },
    async getDrugClassification() {
      let response = await getDrugClassification()
      if (response.code == 200) {
        this.categories = response.data
      }
    },
    async getCities(level, id) {
      let response = await getCities({
        level: level,
        parentId: id
      })
      if (response.code == 200) {
        if (1 === level) {
          this.provinces = response.data
        } else {
          this.cities = response.data
        }
      }
    },
    onModelSave() {
      let length = this.selectedRowKeys.length
      if (length > 0) {
        this.setSelectedDrugsEmpty()
        this.showModal()
      } else {
        this.$message.warning(this.$t('messages.limit'))
      }
    },
    onClear() {
      this.provinceId = undefined
      this.cityId = undefined
      this.$message.success('条件已清空')
    },
    showModal() {
      this.visible = true
    },
    handleOk() {
      this.$confirm({
        title: '确定提交？',
        content: '您即将设置',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          // 计算提交数据
          if (this.selectedRows instanceof Array) {
            let codes = this.selectedDrugs.map(item => item.key)
            let names = this.selectedDrugs.map(item => item.label)
            let params = this.selectedRows.map(row => {
              return {
                cityId: row.cityId,
                noShowDrugTypeCode: codes.join(','),
                noShowDrugTypeName: names.join(',').replace(/\s*/g, '')
              }
            })
            let response = await setCityMedicineDrugType(params)
            if (response.code == 200) {
              this.$message.success('设置成功')
              this.visible = false
              this.getMedicineCities()
            }
          }
        },
        onCancel: () => {
          //
        }
      })
    },
    handleCategoryChange(drugs) {
      this.selectedDrugs = drugs
    },
    handleCancel() {
      this.visible = false
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getMachines()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
    },
    handleProvinceChange(id) {
      this.provinceId = id
      this.setCityEmpty()
      this.getCities(2, id)
    },
    handleCityChange(id) {
      this.cityId = id
    },
    setProvinceEmpty() {
      this.provinceId = undefined
      return this
    },
    setCityEmpty() {
      this.cityId = undefined
      return this
    },
    setSelectedRowKeysEmpty() {
      this.selectedRows = []
      this.selectedRowKeys = []
    },
    setSelectedDrugsEmpty() {
      this.selectedDrugs = []
    }
  },
  watch: {}
}
</script>
