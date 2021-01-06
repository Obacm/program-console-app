<template>
  <div>
    <div class="table-operator">
      <a-button type="primary" @click="onModelSave">新增</a-button>
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
        <a-table-column title="药箱编号">
          <template slot-scope="text, item">
            <router-link
              @click.native="
                setHistories({
                  path: `/drug?activityId=${item.activityId}&medicineNo=${item.medicineNo}`,
                  meta: {
                    name: item.medicineNo
                  }
                })
              "
              :to="{
                path: 'drug',
                query: {
                  activityId: item.activityId,
                  medicineNo: item.medicineNo
                }
              }"
            >
              {{ item.medicineNo }}
            </router-link>
          </template>
        </a-table-column>
        <a-table-column
          title="药箱名称"
          data-index="medicineName"
        ></a-table-column>
        <a-table-column title="省份" data-index="provinceName"></a-table-column>
        <a-table-column title="城市" data-index="cityName"></a-table-column>
        <a-table-column title="状态" data-index="status">
          <template slot-scope="status">
            <span v-if="status == 0" style="color: #28a745">已上架</span>
            <span v-if="status == 1" style="color: #ffc107">已下架</span>
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
    <a-modal
      title="新增药箱"
      :visible="visible"
      :confirm-loading="confirmLoading"
      okText="确定"
      cancelText="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model ref="ruleForm" v-model="form">
        <a-form-model-item label="选择省市">
          <a-select
            v-model="province.provinceName"
            style="width: 150px"
            @change="handleProvinceChange"
            placeholder="请选择省"
          >
            <a-select-option v-for="province in provinces" :key="province.id">
              {{ province.name }}
            </a-select-option>
          </a-select>
          <a-select
            v-model="city.cityName"
            @change="handleCityChange"
            :loading="loading"
            placeholder="请选择市"
            style="width: 150px; margin-left: 20px;"
          >
            <a-select-option v-for="city in cities" :key="city.name">
              {{ city.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="选择药箱">
          <a-select
            mode="multiple"
            :value="selectedMedicines"
            @change="handleMedicineChange"
            :loading="loadingMedicine"
            placeholder="请选择药箱"
            style="width: 210px;"
          >
            <a-select-option
              v-for="medicine in medicines"
              :key="medicine.medicineNo"
            >
              {{ medicine.medicineName + `(${medicine.medicineNo})` }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import {
  getActivityMedicines,
  saveActivityMedicine,
  deleteActivityMedicine,
  offActivityMedicine,
  putActivityMedicine,
  getMedicines,
  getCities,
  getDrugs
} from '@/api'

import Computed from '@/components/Computed'

export default {
  name: 'medicine',
  metaInfo: {
    title: '活动药箱管理',
    titleTemplate: '%s | 中康智慧药箱'
  },
  ...Computed,
  data() {
    return {
      data: [],
      selectedRowKeys: [],
      selectedRowIds: [],
      confirmLoading: false,
      loading: true,
      visible: false,
      loadingMedicine: true,
      provinces: [],
      cities: [],
      medicines: [],
      selectedMedicines: [],
      selectedMedicinesParams: [],
      activityId: '',
      province: {
        provinceId: '',
        provinceName: ''
      },
      city: {
        cityId: '',
        cityName: ''
      },
      form: {}
    }
  },
  created() {
    this.activityId = this.$route.query.activityId
    this.getActivityMedicines()
  },
  methods: {
    setHistories(history) {
      this.$store.commit('SET_HOSTORIES', { history: history, type: false })
    },
    async getActivityMedicines() {
      let response = await getActivityMedicines({
        activityId: this.$route.query.activityId
      })
      if (response.code == 200) {
        this.data = response.data.records
      }
    },
    async getDrugs(drugTypeId, medicineNo) {
      let response = await getDrugs({
        medicineNo: medicineNo,
        drugTypeId: drugTypeId,
        currentPage: 1,
        pageSize: 100
      })
      if (response.code == 200) {
        this.drugs = response.data.records
        this.loadingDrug = false
      }
    },
    async getMedicines(city) {
      let response = await getMedicines({
        cityId: city,
        pageSize: 500
      })
      if (response.code == 200) {
        this.medicines = response.data.records
        this.loadingMedicine = false
      }
    },
    async getCities(level, id) {
      this.loading = true
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
        this.loading = false
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
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            let response = await deleteActivityMedicine(this.selectedRowIds)
            if (response.code == 200) {
              this.setSelectedRowKeysEmpty()
              this.getActivityMedicines()
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
    onModelSave() {
      this.setProvinceEmpty()
        .setCityEmpty()
        .setMedicineEmpty()
        .setSelectedMedicinesEmpty()
      this.getCities(1)
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
            let response = await offActivityMedicine(this.selectedRowIds)
            if (response.code == 200) {
              this.getActivityMedicines()
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
            let response = await putActivityMedicine(this.selectedRowIds)
            if (response.code == 200) {
              this.getActivityMedicines()
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
    showModal() {
      this.visible = true
    },
    handleProvinceChange(id) {
      this.city.cityName = ''
      // 根据省ID获取省名
      let province = this.provinces.find(item => {
        return item.id === id
      })
      // 重置ID
      this.province.provinceId = id
      this.province.provinceName = province.name
      this.getCities(2, id)
    },
    handleCityChange(name) {
      // 根据市名获取市ID
      let city = this.cities.find(item => {
        return item.name === name
      })
      this.city.cityId = city.id
      this.getMedicines(name)
    },
    handleMedicineChange(medicineNos) {
      this.selectedMedicines = medicineNos
      this.selectedMedicinesParams = medicineNos.map(medicineNo => {
        return {
          activityId: this.activityId,
          medicineName: this.medicines.find(item => {
            return item.medicineNo === medicineNo
          }).medicineName,
          medicineNo: medicineNo,
          provinceName: this.province.provinceName,
          provinceId: this.province.provinceId,
          cityId: this.city.cityId,
          cityName: this.city.cityName
        }
      })
    },
    handleOk() {
      this.$confirm({
        title: '确定提交？',
        content: '您即将提交多个活动药箱',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          let response = await saveActivityMedicine(
            this.selectedMedicinesParams
          )
          if (response.code == 'HAVE_SAME_ACTIVITY_MEDICINE') {
            this.$message.warning(response.message)
          }

          if (response.code == 200) {
            this.$message.success('保存成功')
            this.visible = false
            this.getActivityMedicines()
          }
        },
        onCancel: () => {
          console.log('Cancel')
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    setSelectedRowKeysEmpty() {
      this.selectedRowKeys = []
      return this
    },
    setSelectedMedicinesEmpty() {
      this.selectedMedicines = []
      this.selectedMedicinesParams = []
      return this
    },

    setProvinceEmpty() {
      this.provinces = []
      this.province.provinceId = ''
      this.province.provinceName = ''
      return this
    },
    setCityEmpty() {
      this.cities = []
      this.city.cityId = ''
      this.city.cityName = ''
      return this
    },
    setMedicineEmpty() {
      this.medicines = []
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
