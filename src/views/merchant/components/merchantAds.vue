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
        label="广告名"
        align="center"
      >
        <template slot-scope="scope">
          <el-link
            :underline="false"
            target="_bank"
            :href="scope.row.adUrl"
          >{{ scope.row.adName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="广告类型"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="cacheData.statusMap">{{ scope.row.adType | statusFilter(cacheData.statusMap['1019'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="点击数"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.adClickNum}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="广告图"
        align="center"
      >
        <template slot-scope="scope">
          <img
            class="user-avatar"
            :src="scope.row.adFile"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.adStartDate | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.adEndDate | parseTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.byOrder}}</span>
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
          label="广告名"
          prop="adName"
        >
          <el-input
            v-model="formData.adName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="广告地址"
          prop="adUrl"
        >
          <el-input
            v-model="formData.adUrl"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="广告类型"
          prop="adType"
        >
          <sys-code
            v-if="cacheData.codes"
            :cacheOptions="cacheData['codes']"
            :typeCode="'1019'"
            :selected.sync="formData.adType"
          ></sys-code>
        </el-form-item>
        <el-form-item
          label="广告类型"
          prop="adType"
        >
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="广告图"
          prop="adFile"
        >
          <upload-image
            @input="updateThumbnailUrl"
            :value="formData.adFile || ''"
            :domain="'merchant'"
            :businessNo="merchantNo"
            :businessType="'101501'"
          ></upload-image>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="byOrder"
        >
          <el-input
            v-model="formData.byOrder"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>
  </div>
</template>

<script>
import {
    merchantAdsList,
    merchantAdsSave,
    merchantAdsRemove
} from '@/api/merchant'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import UploadImage from '@/components/Upload/uploadImage'
import FormDialog from '@/components/FormDialog'
import { cacheData } from '@/utils/cache'

export default {
    name: 'merchantAds',
    components: {
        SysCode,
        FormDialog,
        DyFilterInput,
        UploadImage
    },
    directives: { waves },
    filters: {},
    data() {
        return {
            cacheData: {},
            tableKey: 0,
            list: null,
            listLoading: true,
            multipleSelection: [],
            formVisible: false,
            grantVisible: false,
            isEdit: false,
            formData: {
                id: null,
                merchantNo: '',
                remark: '',
                adClickNum: 0,
                adStartDate: '',
                adEndDate: '',
                adFile: '',
                adName: '',
                adType: '',
                adUrl: '',
                byOrder: 0
            },
            merchantNo: '',
            dateRange: [],
            rules: {
                adType: [
                    {
                        required: true,
                        message: '类型必选择',
                        trigger: 'blur'
                    }
                ],
                adName: [
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
        this.merchantNo = this.$route.params.merchantNo
        cacheData(this.cacheData, '1019').then(() => {
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
            let query = {
                merchantNo: this.merchantNo
            }
            merchantAdsList(query)
                .then(response => {
                    this.list = response
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
            this.dateRange = []
            this.$refs['formData'].resetFields()
        },
        handleRemove(id) {
            this.$confirm(`确认删除这条记录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                merchantAdsRemove(id).then(() => {
                    this.handleFilter()
                })
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.formData.adStartDate = this.dateRange[0]
                    this.formData.adEndDate = this.dateRange[1]
                    this.formData.merchantNo = this.merchantNo
                    merchantAdsSave(this.formData)
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
        updateThumbnailUrl(value) {
            this.formData.adFile = value.imgUrl
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
