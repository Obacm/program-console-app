<template>
  <div>
    <a-spin :spinning="spinning">
      <a-table rowKey="orderId" :data-source="data" bordered>
        <a-table-column title="药品编号" data-index="drugNo"></a-table-column>
        <a-table-column title="药品名称" data-index="drugName"></a-table-column>
        <a-table-column title="商品规格" data-index="drugSpecification"></a-table-column>
        <a-table-column title="药品单价" data-index="drugPrice"></a-table-column>
        <a-table-column title="药品数量" data-index="drugAmount"></a-table-column>
        <a-table-column title="药品总价" data-index="drugTotalPrice"></a-table-column>
        <a-table-column title="出货状态" data-index="status">
          <template slot-scope="status">
            <span v-if="status == 0" style="color: #ee9a00">未出货</span>
            <span v-if="status == 3" style="color: #ee9a00">出货失败</span>
            <span v-if="status == 4" style="color: #28a745">出货成功</span>
          </template>
        </a-table-column>
        <a-table-column title="出货失败数量" data-index="drugFailureAmount"></a-table-column>
        <a-table-column title="出货时间">
          <template slot-scope="text, item">
            <span v-if="item.status == 5" style="color: #28a745">{{ item.updateDate }}</span>
          </template>
        </a-table-column>
        <a-table-column title="退款时间">
          <template slot-scope="text, item">
            <span v-if="item.status == 4" style="color: #ee9a00">{{ item.updateDate }}</span>
          </template>
        </a-table-column>
        <a-table-column title="操作">
          <template slot-scope="text, item">
            <span v-if="item.status == 4" style="color: #ee9a00">退款</span>
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
import { getOrder } from '@/api'
import Computed from '@/components/Computed'

export default {
  name: 'order-drug',
  metaInfo: {
    title: '订单详情',
    titleTemplate: '%s | 中康智慧药箱'
  },
  ...Computed,
  data() {
    return {
      data: []
    }
  },
  mounted() {
    this.getOrder()
  },
  methods: {
    async getOrder() {
      let response = await getOrder({
        orderId: this.$route.query.orderId
      })
      if (response.code == 200) {
        this.data = response.data
      }
    }
  }
}
</script>
