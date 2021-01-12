<template>
  <div>
    <div v-if="$route.meta.visible">
      <div class="table-search-wrapper">
        <a-input-group compact>
          <a-select default-value="1" @change="handleChange" style="width: 10%">
            <a-select-option value="1">
              是
            </a-select-option>
            <a-select-option value="0">
              否
            </a-select-option>
          </a-select>
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
          <a-input-search
            v-model="medicineNo"
            placeholder="请输入药箱编号"
            enter-button="查询"
            @search="getMachines"
            style="width: 25%; margin-left: 20px;"
          />
          <a-button type="danger" @click="onClear" style="margin-left: 20px;">清空</a-button>
        </a-input-group>
      </div>
      <div class="table-operator">
        <a-button type="primary" @click="onSyncMachines">同步</a-button>
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
          <a-table-column title="药箱编号" data-index="medicineNo"></a-table-column>
          <a-table-column title="药箱名称" data-index="medicineName"></a-table-column>
          <a-table-column title="省份" data-index="provinceName"></a-table-column>
          <a-table-column title="城市" data-index="cityName"></a-table-column>
          <a-table-column title="运营状态" data-index="medicineStatus">
            <template slot-scope="medicineStatus">
              <span v-if="medicineStatus == 0" style="color: #28a745">在线</span>
              <span v-if="medicineStatus == 1" style="color: #ffc107">不在</span>
            </template>
          </a-table-column>
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
        <a-form-model-item label="当前所选药箱名称">
          <div v-for="row in selectedRows" :key="row.medicineId">
            {{ row.medicineNo }} {{ row.medicineName }}
          </div>
        </a-form-model-item>
        <a-form-model-item label="选择省市">
          <a-select
            label-in-value
            v-model="province"
            @change="handleProvinceModelChange"
            placeholder="请选择省"
            style="width: 150px"
          >
            <a-select-option v-for="province in provinces" :key="province.id">
              {{ province.name }}
            </a-select-option>
          </a-select>
          <a-select
            label-in-value
            v-model="city"
            @change="handleCityModelChange"
            :loading="loading"
            placeholder="请选择市"
            style="width: 150px; margin-left: 20px;"
          >
            <a-select-option v-for="city in cities" :key="city.id">
              {{ city.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <router-view else />
  </div>
</template>

<script>
import { getMachines, syncMachines, setMachines, getCities } from '@/api'
import Computed from '@/components/Computed'

export default {
  name: 'machine',
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
      isSetCity: 1,
      medicineNo: null,
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
      },
      province: undefined,
      city: undefined
    }
  },
  created() {
    this.getCities(1)
    this.getMachines()
  },
  methods: {
    async getMachines() {
      let response = await getMachines({
        isSetCity: this.isSetCity,
        provinceId: this.provinceId,
        cityId: this.cityId,
        medicineNo: this.medicineNo,
        currentPage: this.pagination.current,
        pageSize: this.pagination.pageSize
      })
      if (response.code == 200) {
        this.setSelectedRowKeysEmpty()
        this.data = response.data.records
        this.pagination.total = response.data.total
      }
    },
    async onSyncMachines() {
      this.$confirm({
        title: '确定同步？',
        content: '您即将同步',
        onOk: async () => {
          let response = await syncMachines()
          if (response.code == 200) {
            this.$message.success('保存成功')
          } else {
            this.$message.warning('同步失败')
          }
        },
        onCancel: () => {
          //
        }
      })
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
        this.setProvinceModelEmpty().setCityModelEmpty()
        this.showModal()
      } else {
        this.$message.warning(this.$t('messages.limit'))
      }
    },
    showModal() {
      this.visible = true
    },
    onSetMachines() {},
    handleOk() {
      this.$confirm({
        title: '确定提交？',
        content: '您即将设置',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          // 计算提交数据
          if (this.selectedRows instanceof Array) {
            let params = this.selectedRows.map(row => {
              return {
                medicineNo: row.medicineNo,
                cityId: this.city.cityId,
                cityName: this.city.cityName,
                provinceId: this.province.provinceId,
                provinceName: this.province.provinceName
              }
            })
            let response = await setMachines(params)
            if (response.code == 200) {
              this.$message.success('设置成功')
              this.visible = false
              this.getMachines()
            }
          }
        },
        onCancel: () => {
          //
        }
      })
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
    onClear() {
      this.isSetCity = 1
      this.setProvinceEmpty()
        .setCityEmpty()
        .setMedicineNoEmpty()
      this.$message.success('条件已清空')
    },
    handleChange(value) {
      this.isSetCity = value
    },
    handleProvinceChange(id) {
      this.provinceId = id
      this.setCityEmpty()
      this.getCities(2, id)
    },
    handleCityChange(id) {
      this.cityId = id
    },
    handleProvinceModelChange(province) {
      // 重置ID
      this.province.provinceId = province.key
      this.province.provinceName = province.label
      this.setCityModelEmpty()
      this.getCities(2, province.key)
    },
    handleCityModelChange(city) {
      // 重置ID
      this.city.cityId = city.key
      this.city.cityName = city.label
    },
    setProvinceModelEmpty() {
      this.province = undefined
      return this
    },
    setCityModelEmpty() {
      this.city = undefined
      return this
    },
    setProvinceEmpty() {
      this.provinceId = undefined
      return this
    },
    setCityEmpty() {
      this.cityId = undefined
      return this
    },
    setMedicineNoEmpty() {
      this.medicineNo = null
      return this
    },
    setSelectedRowKeysEmpty() {
      this.selectedRows = []
      this.selectedRowKeys = []
    }
  },
  watch: {}
}
</script>
