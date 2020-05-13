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
            v-permission="['sys:user:save']"
          >{{ $t('table.add') }}
          </el-button>
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-edit"
            v-permission="['sys:user:save']"
            @click="handleSelected('edit')"
          >{{ $t('table.edit') }}
          </el-button>
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-setting"
            @click="handleSelected('bindRoles')"
            v-permission="['sys:user:grant']"
          >{{ $t('table.bind') }}{{ $t('table.role') }}
          </el-button>
        </el-col>
        <div class="right-actions">
          <dy-filter-input
            :filterSearch='handleFilter'
            :triggerOnfocus='true'
            :selectType="'SYS_USER'"
            :selected.sync="listQuery.username"
          >
          </dy-filter-input>
        </div>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysUserManager.formData.username')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysUserManager.formData.realName')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysUserManager.formData.phoneNo')"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.remark')"
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
        prop="roleNames"
        :label="$t('views.system.sysUserManager.formData.roleNames')"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag
            :key="item"
            v-for="item in scope.row.roleNames"
          >{{ item}}
          </el-tag>
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
              v-permission="['sys:user:save']"
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
              v-permission="['sys:user:remove']"
              @click="handleRemove(scope.row.id)"
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
              v-permission="['sys:user:lock']"
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
              v-permission="['sys:user:lock']"
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
          :label="$t('views.system.sysUserManager.formData.username')"
          prop="username"
        >
          <el-input
            v-model="formData.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysUserManager.formData.pwd')"
          prop="pwd"
        >
          <el-input
            v-model="formData.pwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysUserManager.formData.realName')"
          prop="realName"
        >
          <el-input
            v-model="formData.realName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysUserManager.formData.phoneNo')"
          prop="phoneNo"
        >
          <el-input
            v-model="formData.phoneNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysUserManager.formData.email')"
          prop="email"
        >
          <el-input
            v-model="formData.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('table.remark')"
        >
          <el-input
            type="textarea"
            v-model="formData.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>
    <role-select
      ref="roleSelect"
      :selected.sync="selectedRoles"
      :visible.sync="bindRolesVisible"
      @onCancel="grantCancel"
      @onSubmit="grantSubmit"
    ></role-select>
  </div>
</template>

<script>
  import {
    sysUserList,
    sysUserStatus,
    sysUserSave,
    sysUserRemove,
    batchGrantUserRoles
  } from '@/api/system'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import SysCode from '@/components/SysCode'
  import DySelect from '@/components/DySelect'
  import DyFilterInput from '@/components/DyFilterInput'
  import FormDialog from '@/components/FormDialog'
  import {cacheData} from '@/utils/cache'
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {validatorUsername} from '@/utils/validatorForm'

  import RoleSelect from './components/roleSelect'
  import {validatePhoneNumber} from '@/utils/validate'

  const defaultFromData = {
    id: null,
    username: '',
    active: false,
    pwd: '',
    realName: '',
    phoneNo: '',
    email: '',
    remark: ''
  }

  export default {
    name: 'sysUserManager',
    components: {
      Pagination,
      SysCode,
      DySelect,
      FormDialog,
      DyFilterInput,
      RoleSelect
    },
    directives: {waves, permission},
    filters: {},
    data() {
      const validatorRequired = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.system.sysUserManager.formData.${rule.field}`) + i18n.t('action.required')))
        } else {
          callback()
        }
      };
      return {
        cacheData: {},
        selectedRoles: [],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 0,
          pageSize: 10,
          orderBy: '+id',
          loginName: '',
          username: ''
        },
        multipleSelection: [],
        formVisible: false,
        bindRolesVisible: false,
        isEdit: false,
        formData: {
          id: null,
          active: false,
          username: '',
          pwd: '',
          realName: '',
          phoneNo: '',
          email: '',
          remark: ''
        },
        rules: {
          username: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            },
            {
              required: true,
              validator: validatorUsername,
              trigger: 'blur'
            }
          ],
          realName: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ],
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      //  加载热数据
      next(vm => vm.updateChildData())
    },
    created() {
    },
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
      updateChildData() {
        this.$refs.roleSelect.$emit('updateData')
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
          'params[username]': this.listQuery.username
        }
        sysUserList(query)
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
      grantCancel(event) {
        this.bindRolesVisible = false
        this.selectedRoles = []
      },
      grantSubmit(event) {
        this.bindRolesVisible = false
        let userIds = this.multipleSelection.map(v => {
          return v.id
        })
        batchGrantUserRoles({
          grantIds: userIds,
          permissions: this.selectedRoles
        })
          .then(data => {
            this.handleFilter()
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.bindRolesVisible = false
          })
      },
      // 打开Form表单
      formOpen(row, isEdit = false) {
        this.isEdit = isEdit
        this.formVisible = true
        if (isEdit) {
          this.formData = Object.assign({}, row)
        } else {
          this.formData = defaultFromData
        }
      },
      // 关闭Form表单
      formClose() {
        this.formVisible = false
        this.$refs['formData'].resetFields()
      },
      handleRemove(id) {
        this.$confirm(this.$t('views.commons.confirm.remove_text'), {
          type: 'warning'
        }).then(() => {
          sysUserRemove(id).then(response => {
            this.handleQueryList()
          })
        })
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            sysUserSave(this.formData)
              .then(data => {
                this.formVisible = false
                this.handleFilter()
              })
              .catch(err => {
                console.log(err)
              })
              .finally(() => {
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
          multipleSelection.length === 0 ||
          multipleSelection.length > 1
        ) {
          this.$message({
            type: 'warning',
            message: this.$t('views.commons.message.single_selected')
          })
          return
        }
        if ('edit' === type) {
          this.formOpen(multipleSelection[0], true)
        } else if ('bindRoles' === type) {
          if (multipleSelection[0].roleCodes) {
            this.selectedRoles = multipleSelection[0].roleCodes
          } else {
            this.selectedRoles = []
          }
          this.bindRolesVisible = true
        }
      },
      // 处理多项选择
      handleMultiSelected(type) {
        let multipleSelection = this.multipleSelection
        if (!multipleSelection.length || multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: this.$t('views.commons.message.multi_selected')
          })
          return
        }
        if (type === 'bindRoles') {
          this.bindRolesVisible = true
        }
      },
      handleStatus(id, active) {
        this.$confirm(this.$t('views.system.sysUserManager.action.handleStatus_confirm'), {
          type: 'warning'
        })
          .then(() => {
            sysUserStatus(id, active).then(response => {
              this.handleQueryList()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('views.system.sysUserManager.action.handleStatus_cancel')
            })
          })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-cell {
    padding: 2px 0;
  }
</style>
