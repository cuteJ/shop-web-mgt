<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        placeholder="用户名"
        v-model="listQuery.username"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
      <el-input
        placeholder="手机号"
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
        label="用户名"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <el-tooltip
            effect="light"
            placement="top"
          >
            <div slot="content">
              <img
                :src="scope.row.headImgUrl"
                class="user-avatar"
              >
            </div>
            <el-button
              type="text"
              @click="toUserDetail(scope.row.id)"
            >{{ scope.row.username }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="昵称"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手机号"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="邮箱"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
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
            :content="$t('table.detail')"
            placement="top-start"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-view"
              @click="toUserDetail(scope.row.id)"
            ></el-button>
          </el-tooltip>
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
            :content="$t('table.locked')"
            placement="top-start"
            v-if="scope.row.active"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-third-locked"
              @click="handleStatus(scope.row.id, false)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('table.unlocked')"
            placement="top-start"
            v-else
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-third-locked-1"
              @click="handleStatus(scope.row.id, true)"
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
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            :disabled="true"
            v-model="formData.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="昵称"
          prop="realName"
        >
          <el-input
            v-model="formData.nickName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="phoneNo"
        >
          <el-input
            v-model="formData.phoneNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="formData.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>
  </div>
</template>

<script>
import { userList, userSave, userStatus } from '@/api/user'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import FormDialog from '@/components/FormDialog'
import { cacheData } from '@/utils/cache'
import { validatePhoneNumber } from '@/utils/validate'

export default {
    name: 'merchantManager',
    components: {
        Pagination,
        SysCode,
        FormDialog
    },
    directives: { waves },
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
                username: '',
                phoneNo: ''
            },
            multipleSelection: [],
            formVisible: false,
            isEdit: false,
            formData: {
                id: '',
                username: '',
                nickName: '',
                phoneNo: '',
                email: '',
                remark: ''
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: '用户名不能为空',
                        trigger: 'blur'
                    }
                ],
                phoneNo: [
                    {
                        required: true,
                        message: '手机号不能为空',
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
    created() {},
    mounted() {
        cacheData(this.cacheData, '1005').then(() => {
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
        toUserDetail(uid) {
            console.log('跳转详情', uid)
            this.$router.push({ path: `/user/user_detail/${uid}` })
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            let query = {
                pageSize: this.listQuery.pageSize,
                pageNum: this.listQuery.pageNum,
                'params[username]': this.listQuery.username,
                'params[phoneNo]': this.listQuery.phoneNo
            }
            userList(query)
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
            }).then(() => {})
        },
        handleReset() {
            this.listQuery.pageNum = 0
            this.listQuery.username = ''
            this.listQuery.phoneNo = ''
            this.handleQueryList()
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    userSave(this.formData)
                        .then(data => {
                            this.formVisible = false
                            this.handleFilter()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {})
                }
            })
        },
        handleStatus(id, active) {
            this.$confirm(`确认操作`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    // TODO tt
                    userStatus(id, active).then(response => {
                        this.handleQueryList()
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    })
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
    border-radius: 10px;
}
</style>
