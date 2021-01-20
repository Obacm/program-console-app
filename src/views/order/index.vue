<template>
  <div>
    <div v-if="$route.meta.visible">
      <div class="table-search-wrapper">
        <a-input-group compact>
          <a-button
            type="link"
            :class="[activeKey === 1 ? 'button-active' : 'button-link']"
            @click="onChange(1, 0)"
          >
            全部（{{ count.allOrderNum }}）
          </a-button>
          <a-button
            type="link"
            :class="[activeKey === 2 ? 'button-active' : 'button-link']"
            @click="onChange(2, 5)"
          >
            已完成（{{ count.doneOrderNum }}）
          </a-button>
          <a-button
            type="link"
            :class="[activeKey === 3 ? 'button-active' : 'button-link']"
            @click="onChange(3, 2)"
          >
            未完成（{{ count.undoneOrderNum }}）
          </a-button>
          <a-button
            type="link"
            :class="[activeKey === 4 ? 'button-active' : 'button-link']"
            @click="onChange(4, 4)"
          >
            已退款（{{ count.returnOrderNum }}）
          </a-button>
          <a-button
            type="link"
            :class="[activeKey === 5 ? 'button-active' : 'button-link']"
            @click="onChange(5, 3)"
          >
            已关闭（{{ count.closeOrderNum }}）
          </a-button>
          <a-range-picker v-model="date" format="YYYY-MM-DD" @change="onPickerChange" />
          <a-button type="primary" @click="getOrders" style="margin-left: 20px;">查询</a-button>
        </a-input-group>
      </div>
      <div class="table-operator">
        <div class="titles">
          <span>累计付款金额: ¥ {{ count.totalPrice }} </span>
          <span>累计退款金额: ¥ {{ count.returnTotalPrice }}</span>
          <span>实际付款金额: ¥ {{ count.payTotalPrice }}</span>
        </div>
        <div class="operators">
          <a-button type="primary" @click="handleDownload">导出</a-button>
        </div>
      </div>
      <a-spin :spinning="spinning">
        <a-table
          rowKey="orderId"
          :data-source="data"
          :pagination="pagination"
          @change="handleTableChange"
          bordered
        >
          <a-table-column title="订单编号" data-index="orderNo">
            <template slot-scope="text, item">
              <router-link
                @click.native="
                  setHistories({
                    path: `/order-drug`,
                    meta: {
                      name: item.orderNo
                    }
                  })
                "
                :to="{
                  path: 'order-drug',
                  query: {
                    orderId: item.orderId
                  }
                }"
              >
                {{ item.orderNo }}
              </router-link>
            </template>
          </a-table-column>
          <a-table-column title="药箱名称" data-index="medicineName"></a-table-column>
          <a-table-column title="药箱编号" data-index="medicineNo"></a-table-column>
          <a-table-column title="订单金额" data-index="orderPrice">
            <template slot-scope="orderPrice">
              {{ orderPrice ? '¥ ' + orderPrice : orderPrice }}
            </template>
          </a-table-column>
          <a-table-column title="付款金额" data-index="payPrice">
            <template slot-scope="payPrice">
              {{ payPrice ? '¥ ' + payPrice : payPrice }}
            </template>
          </a-table-column>
          <a-table-column title="支付状态" data-index="payStatus"></a-table-column>
          <a-table-column title="业务类型" data-index="businessType"></a-table-column>
          <a-table-column title="支付方式" data-index="payType"></a-table-column>
          <a-table-column title="付款人" data-index="payUser"></a-table-column>
          <a-table-column title="订单状态" data-index="orderStatus">
            <template slot-scope="orderStatus">
              <span v-if="orderStatus == 1" style="color: #e5e5e5">待支付</span>
              <span v-if="orderStatus == 2" style="color: #4f94cd">已支付 待取货</span>
              <span v-if="orderStatus == 3" style="color: #ee9a00">取消订单</span>
              <span v-if="orderStatus == 4" style="color: #cd3333">退货</span>
              <span v-if="orderStatus == 5" style="color: #28a745">已完成</span>
            </template>
          </a-table-column>
          <a-table-column title="退款金额" data-index="returnPrice"></a-table-column>
          <a-table-column title="退款状态" data-index="returnStatus"></a-table-column>
          <a-table-column title="退款时间">
            <template slot-scope="text, item">
              <span v-if="item.orderStatus == 4" style="color: #ee9a00">{{ item.updateDate }}</span>
            </template>
          </a-table-column>
          <a-table-column title="出货状态" data-index="sellDrugStatus"></a-table-column>
          <a-table-column title="创建时间" data-index="createDate"></a-table-column>
        </a-table>
      </a-spin>
    </div>
    <router-view else />
  </div>
</template>

<script>
import { getOrders, getOrdersCount } from '@/api'
import Computed from '@/components/Computed'

export default {
  name: 'order',
  metaInfo: {
    title: '订单列表',
    titleTemplate: '%s | 中康智慧药箱'
  },
  ...Computed,
  data() {
    return {
      data: [],
      exportData: [],
      count: {
        allOrderNum: 0,
        doneOrderNum: 0,
        undoneOrderNum: 0,
        returnOrderNum: 0,
        closeOrderNum: 0
      },
      downloadLoading: false,
      startDate: null,
      endDate: null,
      date: null,
      status: 0,
      activeKey: 1,
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
    this.getOrdersCount()
    this.getOrders()
  },
  methods: {
    setHistories(history) {
      this.$store.commit('SET_HOSTORIES', { history: history, type: false })
    },
    async getOrders() {
      let response = await getOrders({
        startDate: this.startDate,
        endDate: this.endDate,
        status: this.status,
        currentPage: this.pagination.current,
        pageSize: this.pagination.pageSize
      })
      if (response.code == 200) {
        this.data = response.data.records
        this.pagination.total = response.data.total
      }
    },
    async getOrdersCount() {
      let response = await getOrdersCount()
      if (response.code == 200) {
        this.count = response.data
      }
    },
    handleDownload() {
      const hide = this.$message.loading('导出Excel中...', 0)
      getOrders({
        startDate: this.startDate,
        endDate: this.endDate,
        status: this.status
      }).then(response => {
        if (response.code == 200) {
          this.exportData = response.data.records
          // 格式化数据
          this.exportData.forEach(item => {
            switch (item.orderStatus) {
              case 1:
                item.orderStatus = '待支付'
                break
              case 2:
                item.orderStatus = '已支付 待取货'
                break
              case 3:
                item.orderStatus = '取消订单'
                break
              case 4:
                item.orderStatus = '退货'
                break
              case 5:
                item.orderStatus = '已完成'
                break
              default:
              //
            }
          })
        }

        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '订单编号',
            '药箱名称',
            '药箱编号',
            '订单金额',
            '付款金额',
            '支付状态',
            '业务类型',
            '支付方式',
            '付款人',
            '订单状态',
            '退款金额',
            '退款状态',
            '出货状态',
            '创建时间'
          ]
          const filterVal = [
            'orderNo',
            'medicineName',
            'medicineNo',
            'orderPrice',
            'payPrice',
            'payStatus',
            'businessType',
            'payType',
            'payUser',
            'orderStatus',
            'returnTotalPrice',
            'returnStatus',
            'sellDrugStatus',
            'createDate'
          ]
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          setTimeout(hide)
        })
      })
    },
    formatJson(filterVal) {
      return this.exportData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.getOrders()
    },
    onPickerChange(date) {
      if (date.length > 0) {
        this.startDate = date[0].format('YYYY-MM-DD')
        this.endDate = date[1].format('YYYY-MM-DD')
      } else {
        this.setDateEmpty()
      }
    },
    onChange(key, status) {
      this.activeKey = key
      this.status = status
    },
    setDateEmpty() {
      this.startDate = null
      this.endDate = null
    }
  }
}
</script>
