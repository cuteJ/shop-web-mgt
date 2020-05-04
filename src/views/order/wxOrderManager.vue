<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        class="filter-item"
        placeholder="订单编号"
        v-model="listQuery.outTradeNo"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
      <el-input
        class="filter-item"
        placeholder="微信订单编号"
        v-model="listQuery.transactionId"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
    </div>
    <div class="actions-container">
      <el-row>
        <el-col :span="20">
          <el-button
            class="action-item"
            size="small"
            icon="el-icon-refresh"
            v-waves
            @click="handleSyncWxOrder({
              outTradeNo:listQuery.outTradeNo,
              transactionId:listQuery.transactionId}
            )"
          >同步微信数据</el-button>
        </el-col>
        <el-col :span="4">
          <div class="right-actions">
            <el-button
              class="action-item"
              size="small"
              icon="el-icon-circle-close-outline"
              @click="handleReset"
            >{{ $t('table.reset') }}</el-button>
            <el-button
              class="action-item"
              size="small"
              icon="el-icon-search"
              @click="handleFilter"
            >{{ $t('table.query') }}</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="商家数据包">
              <span>{{ scope.row.attach }}</span>
            </el-form-item>
            <el-form-item label="付款银行">
              <span>{{ scope.row.bankType }}</span>
            </el-form-item>
            <el-form-item label="现金支付金额">
              <span>{{ scope.row.cashFee }}</span>
            </el-form-item>
            <el-form-item label="现金支付货币类型">
              <span>{{ scope.row.cashFeeType }}</span>
            </el-form-item>
            <el-form-item label="现金退款金额">
              <span>{{ scope.row.cashRefundFee }}</span>
            </el-form-item>
            <el-form-item label="代金券使用数量">
              <span>{{ scope.row.couponCount }}</span>
            </el-form-item>
            <el-form-item label="总代金券金额">
              <span>{{ scope.row.couponFee }}</span>
            </el-form-item>
            <el-form-item label="退款代金券使用数量">
              <span>{{ scope.row.couponRefundCount }}</span>
            </el-form-item>
            <el-form-item label="代金券退款总金额">
              <span>{{ scope.row.couponRefundFee }}</span>
            </el-form-item>
            <el-form-item label="设备号">
              <span>{{ scope.row.deviceInfo }}</span>
            </el-form-item>
            <el-form-item label="是否关注公众账号">
              <span>{{ scope.row.isSubscribe }}</span>
            </el-form-item>
            <el-form-item label="微信退款单号">
              <span>{{ scope.row.refundId }}</span>
            </el-form-item>
            <el-form-item label="退款金额">
              <span>{{ scope.row.refundFee }}</span>
            </el-form-item>
            <el-form-item label="应结退款金额">
              <span>{{ scope.row.settlementRefundFee }}</span>
            </el-form-item>
            <el-form-item label="应结订单金额">
              <span>{{ scope.row.settlementTotalFee }}</span>
            </el-form-item>
            <el-form-item label="营销详情">
              <span>{{ scope.row.promotionDetail }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="订单编号"
        align="center"
        width="230px"
      >
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="'/order/order_detail/no/'+scope.row.outTradeNo">{{scope.row.outTradeNo}}</router-link>
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        label="微信订单号"
        width="250px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.transactionId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="支付完成时间"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.timeEnd}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单金额(分)"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.totalFee}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易类型"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.tradeType}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易状态"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.tradeStateDesc}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="createdTime"
        sortable
        :label="$t('table.createdTime')"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            class="action-item"
            type="text"
            v-waves
            @click="formOpen(scope.row, 'payment')"
          >支付日志</el-button>
          <el-button
            class="action-item"
            type="text"
            v-waves
            @click="formOpen(scope.row, 'refund')"
          >退款日志</el-button>
          <el-button
            class="action-item"
            type="text"
            v-waves
            @click="handleSyncWxOrder(scope.row)"
          >同步微信数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="handleQueryList"
    />
    <el-dialog
      title="日志"
      width="80%"
      :visible.sync="formVisible"
    >
      <div class="block">
        <el-table
          :data="logsList"
          border
          fit
          style="width: 100%;"
        >
          <el-table-column
            label="订单编号"
            align="center"
            width="230px"
          >
            <template slot-scope="scope">
              <span>{{scope.row.orderNo}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="渠道"
            width="250px"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.channel | statusFilter(cacheData.statusMap['1011'])}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="请求报文"
            width="450px"
            align="center"
            :show-overflow-tooltip='true'
          >
            <template slot-scope="scope">
              <span>{{ scope.row.payLoad}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createdTime"
            sortable
            :label="$t('table.createdTime')"
            width="200px"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createdTime | parseTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
    wxPaymentOrderList,
    paymentLogs,
    refundRequestLogs,
    syncWxOrder
} from '@/api/order'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import DySelect from '@/components/DySelect'
import FormDialog from '@/components/FormDialog'
import { cacheData, cacheSelectOptionsData } from '@/utils/cache'

export default {
    name: 'wxOrderManager',
    components: {
        Pagination,
        SysCode,
        FormDialog,
        DyFilterInput,
        DySelect
    },
    directives: { waves },
    filters: {},
    data() {
        return {
            cacheData: {},
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                pageNum: 0,
                pageSize: 10,
                orderBy: 'createdTime',
                outTradeNo: '',
                transactionId: ''
            },
            logsList: [],
            formVisible: false,
            formData: {
                id: null,
                nextStatusId: '',
                remark: ''
            },
            rules: {}
        }
    },
    created() {},
    mounted() {
        cacheData(this.cacheData, '1011').then(() => {
            this.handleQueryList()
        })
    },
    methods: {
        cellStyle() {
            return 'padding: 5px 0px;'
        },
        /***********************Filter search************************* */
        handleFilter() {
            this.listQuery.pageNum = 0
            this.handleQueryList()
        },
        handleReset() {
            this.listQuery.pageNum = 0
            this.listQuery.outTradeNo = ''
            this.listQuery.transactionId = ''
            this.handleQueryList()
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            let query = {
                pageSize: this.listQuery.pageSize,
                pageNum: this.listQuery.pageNum,
                orderBy: 'created_time desc',
                'params[outTradeNo]': this.listQuery.outTradeNo,
                'params[transactionId]': this.listQuery.transactionId
            }
            wxPaymentOrderList(query)
                .then(response => {
                    this.list = response.list
                    this.total = response.total
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.listLoading = false
                })
        },
        /***********************Table actions************************* */
        // 打开Form表单
        formOpen(row, type) {
            this.formVisible = true
            if ('payment' == type) {
                paymentLogs(row.outTradeNo).then(data => {
                    this.logsList = data
                })
            } else if ('refund' == type) {
                refundRequestLogs(row.outTradeNo).then(data => {
                    this.logsList = data
                })
            }
        },
        // 关闭Form表单
        formClose() {
            this.formVisible = false
            this.logsList = []
        },
        handleSyncWxOrder(row) {
            this.$confirm(`确认同步微信订单数据？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                syncWxOrder(row.outTradeNo, row.transactionId).then(data => {
                    this.handleFilter()
                })
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                }
            })
        }
    }
}
</script>

<style>
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.custom-cell {
    padding: 2px 0px;
}
</style>
