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
        label="之前状态"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.beforeStatus | statusFilter(cacheData.options['ORDER_STATUS'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="当前状态"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter(cacheData.options['ORDER_STATUS']) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
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
  </div>
</template>

<script>
import { orderRecords } from '@/api/order'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import { cacheData, cacheSelectOptionsData } from '@/utils/cache'

export default {
    name: 'orderRecord',
    components: {
        Pagination,
        SysCode
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
        cacheSelectOptionsData(this.cacheData, 'ORDER_STATUS').then(() => {
            this.handleQueryList()
        })
    },
    methods: {
        cellStyle() {
            return 'padding: 5px 0px;'
        },
        /***********************Filter search************************* */
        handleFilter() {
            this.handleQueryList()
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            orderRecords(this.$route.params.orderId)
                .then(response => {
                    this.list = response
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
