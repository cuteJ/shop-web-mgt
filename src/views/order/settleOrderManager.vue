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
      <sys-code
        class="filter-item"
        :selectStyle="'width: 250px;'"
        v-if="cacheData.codes"
        :cacheOptions="cacheData['codes']"
        :typeCode="'1025'"
        :selected.sync="listQuery.status"
      ></sys-code>
    </div>
    <div class="actions-container">
      <el-row>
        <el-col :span="20">
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-edit"
            @click="handleSelected('edit')"
          >{{ $t('table.edit') }}</el-button>
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
      :default-sort="{prop: 'createdDate', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="订单编号"
        align="center"
        width="230px"
      >
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="'/order/order_detail/no/'+scope.row.orderNo">{{scope.row.orderNo}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="订单金额"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.orderAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="实收金额"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.actualAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter(cacheData.statusMap['1025'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="出账单日"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.settleDate">{{ scope.row.settleDate | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="账单完成日"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.completeDate">{{ scope.row.completeDate | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="备注"
        align="center"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.settleRemark }}</span>
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
            v-if="scope.row.status === '102500'"
            class="action-item"
            type="text"
            v-waves
            @click="formOpen(scope.row)"
          >已结算</el-button>
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
    <form-dialog
      :visible.sync='formVisible'
      title="结算"
      @onCancel="formClose"
      @onSubmit="handleFormSave"
    >
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="120px"
      >
        <el-form-item label="实收金额">
          <el-input
            type="textarea"
            v-model="formData.actualAmount"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="结算说明">
          <el-input
            type="textarea"
            v-model="formData.settleRemark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>
  </div>
</template>

<script>
import { orderSettleList, updateSettle } from '@/api/order'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import DySelect from '@/components/DySelect'
import FormDialog from '@/components/FormDialog'
import { cacheData, cacheSelectOptionsData } from '@/utils/cache'

export default {
    name: 'settleOrderManager',
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
                status: '102500'
            },
            multipleSelection: [],
            formVisible: false,
            formData: {
                id: '',
                actualAmount: 0,
                settleRemark: ''
            },
            rules: {}
        }
    },
    created() {},
    mounted() {
        cacheData(this.cacheData, '1025').then(() => {
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
            this.listQuery.status = '102500'
            this.handleQueryList()
        },
        handleReset() {
            this.listQuery.pageNum = 0
            this.listQuery.orderNo = ''
            this.listQuery.status = ''
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
                'params[status]': this.listQuery.status
            }
            orderSettleList(query)
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
            this.formData.id = row.id
            this.formVisible = true
        },
        // 关闭Form表单
        formClose() {
            this.formVisible = false
            this.$refs['formData'].resetFields()
        },
        handleSetting(orderNo) {
            this.$router.push({
                path: `/order/order_detail/no/${orderNo}`
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    updateSettle(this.formData)
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

<style rel="stylesheet/scss" lang="scss" scoped>
.custom-cell {
    padding: 2px 0px;
}
</style>
