<template>
  <div>
    <!-- <div class="table-search-wrapper">
      <a-input-group compact>
        <a-input-search
          v-model="medicineNo"
          placeholder="请输入药箱编号"
          enter-button="查询"
          @search="getMedicinesByCity"
          style="width: 25%;"
        />
      </a-input-group>
    </div> -->
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
        <a-table-column title="分类数量" data-index="drugTypeNumber"></a-table-column>
        <a-table-column title="分类状态" data-index="drugTypeStatus"></a-table-column>
        <a-table-column title="分类异常明细" data-index="noShowDrugTypeName"></a-table-column>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
import { getMedicinesByCity } from '@/api'
import Computed from '@/components/Computed'

export default {
  name: 'category-machine',
  metaInfo: {
    title: '药箱列表',
    titleTemplate: '%s | 中康智慧药箱'
  },
  ...Computed,
  data() {
    return {
      data: [],
      selectedRowKeys: [],
      selectedRows: [],
      medicineNo: null,
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        current: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {
    this.getMedicinesByCity()
  },
  methods: {
    async getMedicinesByCity() {
      let response = await getMedicinesByCity({
        // medicineNo: this.medicineNo,
        cityId: this.$route.query.cityId,
        currentPage: this.pagination.current,
        pageSize: this.pagination.pageSize
      })
      if (response.code == 200) {
        this.setSelectedRowKeysEmpty()
        this.data = response.data.records
        this.pagination.total = response.data.total
      }
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getMedicinesByCity()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
    },
    setSelectedRowKeysEmpty() {
      this.selectedRows = []
      this.selectedRowKeys = []
    }
  }
}
</script>
