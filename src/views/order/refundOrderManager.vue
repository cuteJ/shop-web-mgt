<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        class="filter-item"
        placeholder="订单编号"
        v-model="listQuery.orderNo"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
      <el-input
        class="filter-item"
        placeholder="退款流水号"
        v-model="listQuery.refundTradeNo"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
    </div>
    <div class="actions-container">
      <el-row>
        <el-col :span="24">
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
      :default-sort="{prop: 'createdDate', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="退款流水号">
              <span>{{ scope.row.refundTradeNo }}</span>
            </el-form-item>
            <el-form-item label="退款金额">
              <span>{{ scope.row.refundAmount}}</span>
            </el-form-item>
            <el-form-item label="退款原因">
              <span>{{ scope.row.reasonId | statusFilter(cacheData.options['REFUND_REASON'])}}</span>
            </el-form-item>
            <el-form-item label="用户原因">
              <span>{{ scope.row.reasonOther}}</span>
            </el-form-item>
            <el-form-item label="驳回理由">
              <span>{{ scope.row.rejectReason }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ scope.row.remark }}</span>
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
            <router-link :to="'/order/order_detail/id/'+scope.row.orderId">{{scope.row.orderNo}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="退款流水号"
        align="center"
        width="230px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.refundTradeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.orderStatus | statusFilter(cacheData.options['ORDER_STATUS'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter(cacheData.statusMap['1018'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="退款金额"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.refundAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="退款原因"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.reasonId | statusFilter(cacheData.options['REFUND_REASON'])}}</span>
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
            @click="handleRefundRecord(scope.row.id)"
          >操作记录</el-button>
          <el-button
            v-if="scope.row.status == '101800'"
            class="action-item"
            type="text"
            v-waves
            @click="formOpen(scope.row)"
          >审批</el-button>
          <el-button
            v-if="scope.row.status == '101802' || scope.row.status == '101800'"
            class="action-item"
            type="text"
            v-waves
            @click="openRefundConfirm(scope.row)"
          >确认退款</el-button>
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
      title="操作日志"
      :visible.sync="refundRecordsVisible"
    >
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(row, index) in refundRecords"
            :key="index"
            :timestamp="row.createdTime | parseTime('{y}/{m}/{d}')"
            placement="top"
          >
            <el-card>
              <h4>{{ row.beforeStatus | statusFilter(cacheData.statusMap['1018'])}} -> {{row.status | statusFilter(cacheData.statusMap['1018'])}}</h4>
              <p>{{ row.remark }}</p>
              <p>{{ row.operator }} / {{ row.createdTime | parseTime('{y}/{m}/{d} {h}:{i}:{s}') }} </p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

    <form-dialog
      :visible.sync='formVisible'
      title="审批"
      @onCancel="formClose"
      @onSubmit="handleFormSave"
    >
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="120px"
      >
        <el-form-item
          label="状态"
          prop="nextStatus"
        >
          <el-select
            v-model="formData.nextStatus"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in satatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item
          label="驳回原因"
          v-if="formData.nextStatus =='101801'"
        >
          <el-input
            type="textarea"
            v-model="formData.rejectReason"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            v-model="formData.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>
  </div>
</template>

<script>
import {
    orderRefunds,
    orderRefundsRecord,
    updateRefundStatus,
    orderConfirmRefund
} from '@/api/order'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import DySelect from '@/components/DySelect'
import FormDialog from '@/components/FormDialog'
import { cacheData, cacheSelectOptionsData } from '@/utils/cache'

export default {
    name: 'refundOrderManager',
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
                orderNo: '',
                refundTradeNo: ''
            },
            multipleSelection: [],
            formVisible: false,
            formData: {
                refundId: null,
                nextStatus: '',
                rejectReason: '',
                remark: '',
                refundAmount: null
            },
            satatusOptions: [
                {
                    label: '同意',
                    value: '101802'
                },
                {
                    label: '驳回',
                    value: '101801'
                }
            ],
            refundRecordsVisible: false,
            refundRecords: [],
            rules: {}
        }
    },
    created() {},
    beforeRouteEnter(to, from, next) {
        //  加载热数据
        next(vm => vm.handleFilter())
    },
    mounted() {
        cacheSelectOptionsData(
            this.cacheData,
            'ORDER_STATUS,REFUND_REASON'
        ).then(() => {})
        cacheData(this.cacheData, '1018').then(() => {
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
            this.listQuery.orderNo = ''
            this.listQuery.refundTradeNo = ''
            this.handleQueryList()
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            let query = {
                pageSize: this.listQuery.pageSize,
                pageNum: this.listQuery.pageNum,
                orderBy: 'created_time desc',
                'params[orderNo]': this.listQuery.orderNo,
                'params[refundTradeNo]': this.listQuery.refundTradeNo
            }
            orderRefunds(query)
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
        formOpen(row) {
            this.formVisible = true
            this.formData.refundId = row.id
        },
        openRefundConfirm(row) {
            this.$confirm(`确认进行退款操作？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                orderConfirmRefund({ refundId: row.id }).then(data => {
                    this.handleFilter()
                })
            })
        },
        // 关闭Form表单
        formClose() {
            this.formVisible = false
            this.$refs['formData'].resetFields()
        },
        handleRefundRecord(id) {
            this.refundRecordsVisible = true
            orderRefundsRecord(id).then(data => {
                this.refundRecords = data
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    updateRefundStatus(this.formData)
                        .then(data => {
                            this.handleFilter()
                            this.formVisible = false
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {})
                }
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        //处理单项选择
        handleSelected(type) {
            let multipleSelection = this.multipleSelection
            if (
                !multipleSelection.length ||
                multipleSelection.length == 0 ||
                multipleSelection.length > 1
            ) {
                this.$message({
                    type: 'warning',
                    message: '请选择一条数据进行操作'
                })
                return
            }
            if ('edit' === type) {
                this.formOpen(multipleSelection[0], true)
            }
        },
        // 处理多项选择
        handleMultiSelected(type) {
            let multipleSelection = this.multipleSelection
            if (!multipleSelection.length || multipleSelection.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一条数据进行操作'
                })
                return
            }
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
