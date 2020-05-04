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
        placeholder="收货人"
        v-model="listQuery.realName"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
      <el-input
        class="filter-item"
        placeholder="收货手机号"
        v-model="listQuery.phoneNo"
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
            <router-link :to="'/order/order_detail/id/'+scope.row.id">{{scope.row.orderNo}}</router-link>
          </el-button>
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
        label="支付状态"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.payStatus | statusFilter(cacheData.statusMap['1013'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="收货人信息"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.realName}}({{ scope.row.phoneNo}})</span>
        </template>
      </el-table-column>
      <el-table-column
        label="收货地址"
        align="center"
        width="200px"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.fullAddress }}</span>
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
            v-if="scope.row.statusId == 'PAID'"
            class="action-item"
            type="text"
            v-waves
            @click="formOpen(scope.row, scope.row.statusId)"
          >核对确认</el-button>
          <el-button
            class="action-item"
            type="text"
            v-waves
            @click="handleSetting(scope.row.id)"
          >{{$t('table.detail')}}</el-button>
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
      :title="opt.title"
      @onCancel="formClose"
      @onSubmit="handleFormSave"
    >
      <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="120px"
      >
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
    orderList,
    orderUpdate,
    orderUpdateStatus,
    orderConfirm
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
    name: 'confirmOrderManager',
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
                realName: '',
                phoneNo: ''
            },
            multipleSelection: [],
            formVisible: false,
            formData: {
                id: null,
                orderId: null,
                orderNo: null,
                nextStatusId: null,
                remark: ''
            },
            opt: {
                title: '修改',
                nextStatusId: ''
            },
            rules: {}
        }
    },
    created() {},
    beforeRouteEnter(to, from, next) {
        //  加载热数据
        next(vm => vm.handleFilter())
    },
    mounted() {
        cacheSelectOptionsData(this.cacheData, 'ORDER_STATUS').then(() => {})
        cacheData(this.cacheData, '1008,1009,1010,1011,1013').then(() => {
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
            this.listQuery.realName = ''
            this.listQuery.phoneNo = ''
            this.handleQueryList()
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            let query = {
                pageSize: this.listQuery.pageSize,
                pageNum: this.listQuery.pageNum,
                orderBy:'created_time desc',
                'params[orderNo]': this.listQuery.orderNo,
                'params[realName]': this.listQuery.realName,
                'params[phoneNo]': this.listQuery.phoneNo,
                'params[menuType]': 'confirm'
            }
            orderList(query)
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
        formOpen(row, status) {
            this.formVisible = true
            this.formData.orderId = row.id
            if (status === 'SUBMIT_ONLINE' || status === 'PAID') {
                this.formData.nextStatusId = 'CONFIRMED'
            } else if (status === 'CONFIRMED') {
                this.formData.nextStatusId = 'DELIVERING'
            }
        },
        // 关闭Form表单
        formClose() {
            this.formVisible = false
            this.$refs['formData'].resetFields()
        },
        handleSetting(orderId) {
            this.$router.push({
                path: `/order/order_detail/id/${orderId}`
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    orderConfirm({
                        orderId: this.formData.orderId,
                        remark: this.formData.remark,
                        nextStatusId: this.formData.nextStatusId
                    })
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
