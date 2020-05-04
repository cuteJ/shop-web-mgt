<template>
  <div class="app-container">
    <div class="actions-container">
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
    >
      <el-table-column
        type="index"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="流水号"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.txNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="流向"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.flowDirection | statusFilter(cacheData.statusMap['1009'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交易金额"
        align="center"
      >
        <template slot-scope="scope">
          <span>¥{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="支付方式"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.paymentMethod | statusFilter(cacheData.statusMap['1008'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="支付渠道"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.paymentChannel | statusFilter(cacheData.statusMap['1011'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单号"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="'/order/order_detail/no/'+scope.row.orderNo">{{scope.row.orderNo}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="微信订单号"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.transactionId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作人"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdTime"
        sortable
        :label="$t('table.createdTime')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime }}</span>
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
  </div>
</template>

<script>
import { merchantAccountRecords } from '@/api/merchant'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import FormDialog from '@/components/FormDialog'
import { cacheData } from '@/utils/cache'

export default {
    name: 'merchantAccountRecord',
    components: {
        Pagination,
        SysCode,
        FormDialog,
        DyFilterInput
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
                orderBy: '+id'
            }
        }
    },
    mounted() {
        cacheData(this.cacheData, '1008,1009,1011').then(() => {
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
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            let query = {
                pageSize: this.listQuery.pageSize,
                pageNum: this.listQuery.pageNum,
                'params[merchantNo]': this.$route.params.merchantNo
            }
            merchantAccountRecords(query)
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
        }
        /***********************Table actions************************* */
        // 打开Form表单
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.custom-cell {
    padding: 2px 0px;
}
</style>
