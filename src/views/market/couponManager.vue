<template>
  <div class="app-container">
    <div class="filter-container">
      <sys-code
        v-if="cacheData.codes"
        class="filter-item"
        :selectStyle="'width:250px;'"
        :placeholder="'请选择状态'"
        :cache-options="cacheData['codes']"
        :type-code="'1023'"
        :selected.sync="listQuery.status"
      />
      <dy-select
        class="filter-item"
        :placeholder="'请选择模版'"
        :selectStyle="'width:250px;'"
        :selected.sync="listQuery.templateId"
        :selectType="'COUPON_TEMPLATE'"
      >
      </dy-select>
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
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="模版名称"
        align="center"
        width='150'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.cpName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="折扣金额（分）"
        align="center"
        width='100'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.cpValue }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="金额文案"
        align="center"
        width='100'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.valueDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单位文案"
        align="center"
        width='80'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.unitDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="满减金额（分）"
        align="center"
        width='100'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.conditionValue }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="满减条件"
        :show-overflow-tooltip='true'
        align="center"
        width='150'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.cpCondition }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width='120'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.status | statusFilter(cacheData.statusMap['1023']) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="优惠券类型"
        align="center"
        width='120'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.couponType | statusFilter(cacheData.statusMap['1021']) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="receiveTime"
        sortable
        label="领取时间"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.receiveTime">{{ scope.row.receiveTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="startAt"
        label="开始日期"
        width="100px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.startAt">{{ scope.row.startAt | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="endAt"
        label="结束日期"
        width="100px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.endAt">{{ scope.row.endAt | parseTime('{y}-{m}-{d}') }}</span>
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
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('table.edit')"
            placement="top-start"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-edit"
              @click="formOpen(scope.row, true)"
            ></el-button>
          </el-tooltip>
          <el-button
            v-if="scope.row.status == '102300'"
            class="action-item"
            type="text"
            v-waves
            @click="formOpenOffer(scope.row)"
          >发放</el-button>
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
    <user-coupon-list
      :visible.sync='formVisibleCoupon'
      :multi='false'
      title="发送优惠券"
      @onCancel="formCloseCoupon"
      @onSubmit="handleOffer"
    >
      <div></div>
    </user-coupon-list>
  </div>
</template>

<script>
import { couponList, offerCouponToUser } from '@/api/market'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import FormDialog from '@/components/FormDialog'
import { cacheData } from '@/utils/cache'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { mapGetters } from 'vuex'
import UserCouponList from './components/userCouponList'
import DyFilterInput from '@/components/DyFilterInput'
import DySelect from '@/components/DySelect'

export default {
    name: 'couponManager',
    components: {
        Pagination,
        SysCode,
        FormDialog,
        DyFilterInput,
        DySelect,
        UserCouponList
    },
    directives: { waves, permission },
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
                orderBy: '+id',
                templateId: null,
                status: ''
            },
            currentTemplate: {},
            multipleSelection: [],
            formVisible: false,
            formVisibleCoupon: false,
            isEdit: false,
            formData: {}
        }
    },
    computed: {
        ...mapGetters(['merchantNo'])
    },
    created() {},
    mounted() {
        cacheData(this.cacheData, '1000,1021,1023').then(() => {
            this.handleQueryList()
        })
    },
    methods: {
        checkPermission,
        cellStyle() {
            return 'padding: 5px 0px;'
        },
        /***********************Filter search************************* */
        handleFilter() {
            this.listQuery.pageNum = 0
            this.listQuery.status = ''
            this.handleQueryList()
        },
        handleReset() {
            this.listQuery.pageNum = 0
            this.listQuery.templateId = ''
            this.listQuery.status = ''
            this.handleQueryList()
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            let query = {
                pageSize: this.listQuery.pageSize,
                pageNum: this.listQuery.pageNum,
                'params[templateId]': this.listQuery.templateId,
                'params[status]': this.listQuery.status
            }
            couponList(query)
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
        formOpen(row, isEdit = false) {
            this.isEdit = isEdit
            this.formVisible = true
            if (isEdit) {
                this.formData = Object.assign({}, row)
            } else {
                this.formData = {}
            }
        },
        formOpenOffer(row) {
            this.currentTemplate = row
            this.formVisibleCoupon = true
        },
        // 关闭Form表单
        formClose() {
            this.formVisible = false
            this.$refs['formData'].resetFields()
        },
        formCloseCoupon() {
            this.formVisibleCoupon = false
        },
        handleOffer(item, event) {
            offerCouponToUser(this.currentTemplate.id, item.uid).then(data => {
                this.formVisibleCoupon = false
            })
        },
        // 表单提交处理
        handleFormSave() {},
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
    display: inline-block;
}
</style>
