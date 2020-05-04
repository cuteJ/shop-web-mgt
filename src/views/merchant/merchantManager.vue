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
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-edit"
            @click="handleInit()"
          >初始地区数据</el-button>
        </el-col>
        <el-col :span="6">
          <dy-filter-input
            :filterSearch='handleFilter'
            :selectType="'MERCHANT'"
            :selected.sync="listQuery.merchantNo"
          >
          </dy-filter-input>
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
        label="商户编号"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="'/mct/merchant_detail/'+scope.row.merchantNo">{{scope.row.merchantNo}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="商户名称"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.merchantName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="联系手机号"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商户介绍"
        align="center"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        align="center"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
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
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('table.setting')"
            placement="top-start"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-setting"
              @click="handleSetting(scope.row.merchantNo)"
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
          label="平台编号"
          prop="merchantNo"
        >
          <dy-select
            :placeholder="'请选择平台'"
            :selected.sync="formData.platformNo"
            :selectType="'PLATFORM'"
          >
          </dy-select>
        </el-form-item>
        <el-form-item
          label="商户编号"
          prop="merchantNo"
        >
          <code>注：编号不可修改</code>
          <el-input
            v-model="formData.merchantNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="商户名称"
          prop="merchantName"
        >
          <code>注：名称须和微信公众号名称一致，一经保存不能修改</code>
          <el-input
            v-model="formData.merchantName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系人手机号"
          prop="phoneNo"
        >
          <el-input
            v-model="formData.phoneNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系人邮箱"
          prop="email"
        >
          <el-input
            v-model="formData.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="商户地址"
          prop="address"
        >
          <el-input
            v-model="formData.address"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="商户位置"
          prop="location"
        >
          <span v-if="point.lng">经度：{{point.lng}}</span>
          <span v-if="point.lat">纬度：{{point.lat}}</span>
        </el-form-item>
        <el-form-item>
          <bm-search
            :selected.sync="selected"
            :point="point"
            :zIndex="1000000"
          ></bm-search>
        </el-form-item>
        <el-form-item
          label="商户介绍"
          prop="description"
        >
          <el-input
            type="textarea"
            v-model="formData.description"
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
import { merchantList, merchantSave, merchantRemove } from '@/api/merchant'
import { initRegion } from '@/api/system'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import DySelect from '@/components/DySelect'
import FormDialog from '@/components/FormDialog'
import { cacheData } from '@/utils/cache'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import BmSearch from '@/components/BmSearch'
import { validatePhoneNumber } from '@/utils/validate'
import area from '@/utils/area'

const defaultSelected = {
    point: {},
    item: {},
    address: ''
}

export default {
    name: 'merchantManager',
    components: {
        Pagination,
        SysCode,
        FormDialog,
        DyFilterInput,
        DySelect,
        BmSearch
    },
    directives: { waves, permission },
    filters: {},
    data() {
        const validatorPhoneNumber = (rule, value, callback) => {
            if (!validatePhoneNumber(value)) {
                callback(new Error('请输入正确的手机号'))
            } else {
                callback()
            }
        }
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
            multipleSelection: [],
            formVisible: false,
            grantVisible: false,
            isEdit: false,
            formData: {
                id: '',
                merchantNo: '',
                status: '100700',
                platformNo: '',
                merchantName: '',
                phoneNo: '',
                email: '',
                address: '',
                location: null,
                description: ''
            },
            point: { lng: 0, lat: 0 },
            selected: defaultSelected,
            rules: {
                merchantNo: [
                    {
                        required: true,
                        message: '商户编号必选择',
                        trigger: 'blur'
                    }
                ],
                platformNo: [
                    {
                        required: true,
                        message: '平台编号必选择',
                        trigger: 'blur'
                    }
                ],
                merchantName: [
                    {
                        required: true,
                        message: '商户名称必填',
                        trigger: 'blur'
                    }
                ],
                phoneNo: [
                    {
                        required: true,
                        message: '联系人手机号必填',
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        trigger: 'blur',
                        validator: validatorPhoneNumber
                    }
                ]
            }
        }
    },
    watch: {
        selected: function(val, oldVal) {
            this.formData.address = val.fullAdress
            this.point = val.point
        }
    },
    created() {},
    mounted() {
        cacheData(this.cacheData, '1000').then(() => {
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
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            let query = {
                pageSize: this.listQuery.pageSize,
                pageNum: this.listQuery.pageNum,
                'params[merchantNo]': this.listQuery.merchantNo
            }
            merchantList(query)
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
                this.point = JSON.parse(row.location)
                this.formData = Object.assign({}, row)
            } else {
                this.formData = {}
            }
        },
        // 关闭Form表单
        formClose() {
            this.formVisible = false
            this.selected = defaultSelected
            this.$refs['formData'].resetFields()
        },
        handleRemove(id) {
            this.$confirm(`确认删除这条记录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                merchantRemove(id).then(() => {
                    this.handleFilter()
                })
            })
        },
        handleSetting(merchantNo) {
            this.$router.push({
                path: `/mct/merchant_detail/${merchantNo}`
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.formData.location = JSON.stringify(this.point)
                    this.formData.status = '100700'
                    console.log('坐标点字符', this.formData.location)
                    merchantSave(this.formData)
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
        },
        handleInit() {
            this.$confirm(`确认初始化地区数据？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                initRegion(1, JSON.stringify(area.province_list)).then(() => {})
                initRegion(2, JSON.stringify(area.city_list)).then(() => {})
                initRegion(3, JSON.stringify(area.county_list)).then(() => {})
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.custom-cell {
    padding: 2px 0px;
}
</style>
