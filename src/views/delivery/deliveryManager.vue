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
        <el-col :span="6">
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
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="模版名称"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="配送方式"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryMethod | statusFilter(cacheData.statusMap['1010'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="计价方式"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.valuation | statusFilter(cacheData.statusMap['1016'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发货时间"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deliveryDate }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="是否包邮"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.isFree ? '商家承担运费': '自定义运费' }}</span>
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
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="150"
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

          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('table.delete')"
            placement="top-start"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-delete"
              @click="handleRemove(scope.row.id)"
            ></el-button>
          </el-tooltip>
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
          label="模版名称"
          prop="templateName"
        >
          <el-input
            v-model="formData.templateName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="配送方式"
          prop="deliveryMethod"
        >
          <sys-code
            v-if="cacheData.codes"
            :cacheOptions="cacheData['codes']"
            :typeCode="'1010'"
            :selected.sync="formData.deliveryMethod"
          ></sys-code>
        </el-form-item>
        <el-form-item
          label="发货时间"
          prop="deliveryDate"
        >
          <el-select
            style="width: 100%;"
            v-model="formData.deliveryDate"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否包邮"
          prop="isFree"
        >
          <el-radio
            v-model="formData.isFree"
            :label="true"
            @change="handleIsFree()"
          >商家承担运费</el-radio>
          <el-radio
            v-model="formData.isFree"
            :label="false"
          >自定义运费</el-radio>
        </el-form-item>
        <el-form-item
          label="计价方式"
          prop="valuation"
          v-if="!formData.isFree"
        >
          <sys-code
            v-if="cacheData.codes"
            :cacheOptions="cacheData['codes']"
            :typeCode="'1016'"
            :selected.sync="formData.valuation"
          ></sys-code>
        </el-form-item>
        <el-form-item
          v-if="!formData.isFree"
          label="首重"
          prop="firstNumber"
        >
          <el-input
            v-model="formData.firstNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="!formData.isFree"
          label="首重费用"
          prop="firstAmount"
        >
          <el-input
            v-model="formData.firstAmount"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="!formData.isFree"
          label="续重"
          prop="addNumber"
        >
          <el-input
            v-model="formData.addNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="!formData.isFree"
          label="续重费用"
          prop="addAmount"
        >
          <el-input
            v-model="formData.addAmount"
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
    deliveryTemplateList,
    deliveryTemplateSave,
    deliveryRemove
} from '@/api/merchant'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import CascaderArea from '@/components/CascaderArea'
import SelectArea from '@/components/SelectArea'
import FormDialog from '@/components/FormDialog'
import { cacheData } from '@/utils/cache'
import { mapGetters } from 'vuex'

const defaultFormData = {
    id: null,
    remark: '',
    merchantNo: '',
    firstNumber: '',
    firstAmount: 0,
    deliveryDate: '',
    deliveryMethod: '',
    addNumber: '',
    addAmount: 0,
    isFree: false,
    templateName: '',
    valuation: '',
    provinceCodes: ''
}

export default {
    name: 'deliveryManager',
    components: {
        Pagination,
        SysCode,
        FormDialog,
        DyFilterInput,
        CascaderArea,
        SelectArea
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
            },
            formVisible: false,
            grantVisible: false,
            isEdit: false,
            multipleSelection: [],
            dateOptions: [
                {
                    lable: '1-2天',
                    value: '1-2天'
                }
            ],
            formData: defaultFormData,
            selected: [],
            rules: {
                templateName: [
                    {
                        required: true,
                        message: '模版名称必填',
                        trigger: 'blur'
                    }
                ],
                valuation: [
                    {
                        required: true,
                        message: '必选择',
                        trigger: 'blur'
                    }
                ],
                deliveryMethod: [
                    {
                        required: true,
                        message: '必选择',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {
        ...mapGetters(['merchantNo'])
    },
    mounted() {
        cacheData(this.cacheData, '1010,1016').then(() => {
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
                pageNum: this.listQuery.pageNum
            }
            deliveryTemplateList(query)
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
                this.formData = defaultFormData
            }
        },
        // 关闭Form表单
        formClose() {
            this.formVisible = false
            this.$refs['formData'].resetFields()
        },
        handleRemove(id) {
            this.$confirm(`确认删除这条记录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deliveryRemove(id).then(() => {
                    this.handleFilter()
                })
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.formData.merchantNo = this.merchantNo
                    deliveryTemplateSave(this.formData)
                        .then(data => {
                            this.handleFilter()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {
                            this.formVisible = false
                        })
                }
            })
        },
        handleIsFree() {},
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
