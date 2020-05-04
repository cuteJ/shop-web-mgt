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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        label="平台编号"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="'/mct/platform_detail/'+scope.row.platformNo">{{scope.row.platformNo}}</router-link>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="平台名称"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.platformName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="地区"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
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
              @click="handleSetting(scope.row.platformNo)"
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
          prop="platformNo"
        >
          <el-input
            v-model="formData.platformNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="平台名称"
          prop="platformName"
        >
          <el-input
            v-model="formData.platformName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="平台地区"
          prop="area"
        >
          <el-input
            v-model="formData.area"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>
  </div>
</template>

<script>
import { platformList, platformSave, platformRemove } from '@/api/merchant'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import FormDialog from '@/components/FormDialog'
import { cacheData } from '@/utils/cache'

export default {
    name: 'platformManager',
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
            },
            multipleSelection: [],
            formVisible: false,
            grantVisible: false,
            isEdit: false,
            formData: {
                id: '',
                area: '',
                logo: '',
                platformName: '',
                platformNo: ''
            },
            rules: {
                platformNo: [
                    {
                        required: true,
                        message: '编号必选择',
                        trigger: 'blur'
                    }
                ],
                platformName: [
                    {
                        required: true,
                        message: '名称必填',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    watch: {},
    created() {},
    mounted() {
        cacheData(this.cacheData, '1000').then(() => {
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
            platformList(query)
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
                platformRemove(id).then(() => {
                    this.handleFilter()
                })
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    platformSave({
                        platformNo: this.formData.platformNo,
                        basic: this.formData
                    })
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
        handleSetting(platformNo) {
            this.$router.push({
                path: `/mct/platform_detail/${platformNo}`
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
