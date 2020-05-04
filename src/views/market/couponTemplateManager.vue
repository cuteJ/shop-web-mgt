<template>
  <div class="app-container">
    <div class="actions-container">
      <el-row>
        <el-col :span="18">
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-plus"
            @click="formOpen"
          >{{ $t('table.add') }}</el-button>
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
        label="模版名称"
        align="center"
        width='100'
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
        label="使用注意描述"
        :show-overflow-tooltip='true'
        align="center"
        width='200'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
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
        label="发放方式"
        align="center"
        width='100'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.publishMethod | statusFilter(cacheData.statusMap['1022']) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="生成数量"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.publishNum }}</span>
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
            class="action-item"
            type="text"
            v-waves
            @click="handlePublish(scope.row.id)"
          >生成</el-button>
          <el-button
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
    <form-dialog
      :visible.sync='formVisible'
      :title="isEdit? $t('table.edit'):$t('table.add')"
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
          label="券名称"
          width='120px'
          prop="cpName"
        >
          <el-input
            v-model="formData.cpName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="金额数值（分）"
          width='80px'
          prop="cpValue"
        >
          <el-input
            v-model="formData.cpValue"
            placeholder="单位分"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="金额文案"
          width='100px'
          prop="valueDesc"
        >
          <el-input
            v-model="formData.valueDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="单位文案"
          width='80px'
          prop="unitDesc"
        >
          <el-input
            v-model="formData.unitDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="满减金额（分）"
          prop="conditionValue"
        >
          <el-input
            placeholder="(-1)不限制金额"
            v-model="formData.conditionValue"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="满减条件"
          prop="cpCondition"
        >
          <el-input
            type="textarea"
            v-model="formData.cpCondition"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="使用注意描述"
          width='150px'
          prop="description"
        >
          <el-input
            type="textarea"
            v-model="formData.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="发放方式"
          prop="publishMethod"
        >
          <sys-code
            v-if="cacheData.codes"
            :cacheOptions="cacheData['codes']"
            :typeCode="'1022'"
            :selected.sync="formData.publishMethod"
          ></sys-code>
        </el-form-item>
        <el-form-item
          label="是否启用"
          prop="status"
        >
          <sys-code
            v-if="cacheData.codes"
            :cacheOptions="cacheData['codes']"
            :typeCode="'1000'"
            :selected.sync="formData.status"
          ></sys-code>
        </el-form-item>
        <el-form-item
          label="优惠券类型"
          prop="couponType"
        >
          <sys-code
            v-if="cacheData.codes"
            :cacheOptions="cacheData['codes']"
            :typeCode="'1021'"
            :selected.sync="formData.couponType"
          ></sys-code>
        </el-form-item>
        <el-form-item
          label="发放数量"
          withd="80px"
          prop="publishNum"
        >
          <el-input
            placeholder="-1表示不限制数量"
            v-model="formData.publishNum"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="领取后有效天数"
          withd="80px"
          prop="validDays"
        >
          <el-input
            v-model="formData.validDays"
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

    <user-coupon-list
      :visible.sync='formVisibleCoupon'
      title="发送优惠券"
      @onCancel="formCloseCoupon"
      @onSubmit="handleOffer"
    >
      <div></div>
    </user-coupon-list>
  </div>
</template>

<script>
import {
    couponTemplateList,
    couponList,
    couponTemplateSave,
    couponPublish,
    offerCouponToUsers
} from '@/api/market'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import FormDialog from '@/components/FormDialog'
import UserCouponList from './components/userCouponList'
import { cacheData } from '@/utils/cache'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import { mapGetters } from 'vuex'

export default {
    name: 'couponTemplateManager',
    components: {
        Pagination,
        SysCode,
        FormDialog,
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
                merchantNo: ''
            },
            currentTemplate: {},
            multipleSelection: [],
            formVisible: false,
            formVisibleCoupon: false,
            grantVisible: false,
            isEdit: false,
            formData: {
                id: null,
                merchantNo: '',
                remark: '',
                couponType: '',
                cpName: '',
                publishMethod: '102201',
                publishNum: 0,
                status: '100000',
                validDays: 0,
                cpCondition: '',
                conditionValue: -1,
                description: '',
                reason: '',
                unitDesc: '元',
                cpValue: '',
                valueDesc: ''
            },
            rules: {
                cpName: [
                    {
                        required: true,
                        message: '券名称必填',
                        trigger: 'blur'
                    }
                ],
                cpValue: [
                    {
                        required: true,
                        message: '折扣金额必填',
                        trigger: 'blur'
                    }
                ],
                valueDesc: [
                    {
                        required: true,
                        message: '折扣文案必填',
                        trigger: 'blur'
                    }
                ],
                unitDesc: [
                    {
                        required: true,
                        message: '单位文案必填',
                        trigger: 'blur'
                    }
                ],
                status: [
                    {
                        required: true,
                        message: '状态必选',
                        trigger: 'blur'
                    }
                ],
                cpCondition: [
                    {
                        required: true,
                        message: '满减条件必填',
                        trigger: 'blur'
                    }
                ],
                conditionValue: [
                    {
                        required: true,
                        message: '满减金额必填',
                        trigger: 'blur'
                    }
                ],
                couponType: [
                    {
                        required: true,
                        message: '类型必选择',
                        trigger: 'blur'
                    }
                ],
                validDays: [
                    {
                        required: true,
                        message: '有效天数必填',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {
        ...mapGetters(['merchantNo'])
    },
    created() {},
    mounted() {
        cacheData(this.cacheData, '1000,1021,1024,1022').then(() => {
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
            this.handleQueryList()
        },
        handleReset() {
            this.listQuery.pageNum = 0
            this.handleQueryList()
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            let query = {
                pageSize: this.listQuery.pageSize,
                pageNum: this.listQuery.pageNum
            }
            couponTemplateList(query)
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
        handlePublish(templateId) {
            this.$confirm(`确认生成优惠券？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                couponPublish(templateId).then(data => {})
            })
        },
        handleOffer(items, event) {
            let ids = items.map(v => v.uid)
            offerCouponToUsers({
                templateId: this.currentTemplate.id,
                userIds: ids
            }).then(data => {
                this.formVisibleCoupon = false
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.formData.merchantNo = this.merchantNo
                    couponTemplateSave(this.formData)
                        .then(data => {
                            this.handleFilter()
                            this.formVisible = false
                        })
                        .catch(err => {
                            console.log(err)
                        })
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
