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
            v-permission="['goods:manager:save']"
          >{{ $t('table.add') }}</el-button>
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-edit"
            v-permission="['goods:manager:save']"
            @click="handleSelected('edit')"
          >{{ $t('table.edit') }}</el-button>
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
        label="商品图"
        align="center"
      >
        <template slot-scope="scope">
          <img
            :src="scope.row.thumbnail"
            class="user-avatar"
          >
        </template>
      </el-table-column>
      <el-table-column
        label="商品编号"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="'/goods/goods_detail/'+scope.row.id">{{scope.row.goodsNo}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="商品状态"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="cacheData.statusMap">{{ scope.row.status | statusFilter(cacheData.statusMap['1012'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品介绍"
        align="center"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
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
            class="action-item"
            type="text"
            v-waves
            v-permission="['goods:manager:del']"
            @click="handleUpdateStatus(scope.row)"
          >{{scope.row.status == '101200' ? '下架' : '上架'}}</el-button>
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
              v-permission="['goods:manager:del']"
              @click="handleRemove(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('table.detail')"
            placement="top-start"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-view"
              @click="handleSetting(scope.row.id)"
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
          label="商品编号"
          prop="goodsNo"
        >
          <el-input
            v-model="formData.goodsNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="商品名称"
          prop="goodsName"
        >
          <el-input
            v-model="formData.goodsName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="月销量"
          prop="salesVolume"
        >
          <el-input
            v-model="formData.salesVolume"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="商品库存"
          prop="stockNum"
        >
          <el-input
            v-model="formData.stockNum"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="热销"
          prop="hot"
        >
          <el-radio-group v-model="formData.hot">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="标签"
          prop="tags"
        >
          <el-radio-group v-model="formData.tags">
            <el-radio :label="'热销'">热销</el-radio>
            <el-radio :label="'力推'">力推</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="原价"
          prop="marketPrice"
        >
          <el-input
            v-model="formData.marketPrice"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="现价"
          prop="sellingPrice"
        >
          <el-input
            v-model="formData.sellingPrice"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="商品介绍"
          prop="phoneNo"
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
import {
    goodsList,
    goodsSave,
    goodsRemove,
    goodsUpdate,
    goodsUpdateStatus
} from '@/api/goods'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import DySelect from '@/components/DySelect'
import FormDialog from '@/components/FormDialog'
import { cacheData } from '@/utils/cache'
import { mapGetters } from 'vuex'
import permission from '@/directive/permission/index.js' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
    name: 'goodsManager',
    components: {
        Pagination,
        SysCode,
        FormDialog,
        DyFilterInput,
        DySelect
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
                orderBy: '+id'
            },
            multipleSelection: [],
            formVisible: false,
            isEdit: false,
            formData: {
                id: null,
                remark: '',
                status: '',
                description: '',
                goodsName: '',
                goodsNo: '',
                marketPrice: 0,
                sellingPrice: 0,
                merchantNo: '',
                stockNum: 0,
                hot: false,
                salesVolume: 0,
                tags: '',
                categoryId: '',
                content: '',
                goodsParams: null
            },
            rules: {
                goodsNo: [
                    {
                        required: true,
                        message: '商户编号必填',
                        trigger: 'blur'
                    }
                ],
                goodsName: [
                    {
                        required: true,
                        message: '商户名称必填',
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
        cacheData(this.cacheData, '1012').then(() => {
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
                pageNum: this.listQuery.pageNum
            }
            goodsList(query)
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
                goodsRemove(id).then(() => {
                    this.handleFilter()
                })
            })
        },
        handleSetting(goodsId) {
            this.$router.push({
                path: `/goods/goods_detail/${goodsId}`
            })
        },
        handleUpdateStatus(row) {
            this.$confirm(`确认删除这条记录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let status = row.status == '101200' ? '101201' : '101201'
                let remark = row.status == '101200' ? '下架商品' : '上架商品'
                goodsUpdateStatus(row.id, {
                    remark: remark,
                    status: status
                }).then(() => {
                    this.handleFilter()
                })
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    if (!this.isEdit) {
                        this.formData.status = '101200'
                        let remark = remark | '创建商品'
                        this.formData.merchantNo = this.merchantNo
                        goodsSave({
                            remark: remark,
                            basic: this.formData
                        })
                            .then(data => {
                                this.handleFilter()
                                this.formVisible = false
                            })
                            .catch(err => {
                                console.log(err)
                            })
                            .finally(() => {})
                    } else {
                        let remark = remark | '修改商品'
                        goodsUpdate(this.formData.id, {
                            remark: remark,
                            basic: this.formData
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
.user-avatar {
    // vertical-align: 10px;
    width: 40px;
    height: 40px;
}
</style>
