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
            v-permission="['sys:role:save']"
          >{{ $t('table.add') }}
          </el-button>
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-edit"
            v-permission="['sys:role:save']"
            @click="handleSelected('edit')"
          >{{ $t('table.edit') }}
          </el-button>
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-setting"
            @click="handleSelected('bindMenus')"
            v-permission="['sys:role:grant']"
          >{{ $t('table.bind') }}{{ $t('table.menu') }}
          </el-button>
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-setting"
            @click="handleSelected('bindAuthorities')"
            v-permission="['sys:role:grant']"
          >{{$t('table.bind')}}{{ $t('table.authority') }}
          </el-button>
        </el-col>
        <div class="right-actions">
          <dy-filter-input
            :filterSearch='handleFilter'
            :selectType="'ROLE'"
            :selected.sync="listQuery.roleCode"
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
        :label="$t('views.system.sysRoleManager.formData.roleCode')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span :class="{ 'del-line': scope.row.status === '100001' }">{{ scope.row.roleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysRoleManager.formData.roleName')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span v-if="cacheData.statusMap">{{ scope.row.status | statusFilter(cacheData.statusMap['1000'])}}</span>
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
        label-width="100px"
      >
        <el-form-item
          :label="$t('views.system.sysRoleManager.formData.roleCode')"
          prop="roleCode"
        >
          <el-input
            v-model="formData.roleCode"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysRoleManager.formData.roleName')"
          prop="roleName"
        >
          <el-input
            v-model="formData.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('table.status')"
          prop="status"
        >
          <sys-code
            v-if="cacheData.codes"
            :cache-options="cacheData['codes']"
            :type-code="'1000'"
            :selected.sync="formData.status"
          />
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

    <menu-select
      ref="menuSelect"
      :selected="selectedMenus"
      :visible.sync="bindMenusVisible"
      @onCancel="bindMenuCancel"
      @onSubmit="bindMenuSubmit"
    ></menu-select>

    <authority-select
      ref="authoritySelect"
      :selected="selectedRole"
      :visible.sync="bindAuthoritiesVisible"
      @onCancel="bindAuthorityCancel"
      @onSubmit="bindAuthoritySubmit"
    ></authority-select>
  </div>
</template>

<script>
  import {
    sysRoleList,
    sysRoleSave,
    sysRoleRemove,
    batchGrantRoleMenus,
    batchGrantRolePermissions,
    getRoleMenus,
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

  import MenuSelect from './components/menuSelect'
  import AuthoritySelect from './components/authoritySelect'

  export default {
    name: 'sysRoleManager',
    components: {
      Pagination,
      SysCode,
      DySelect,
      FormDialog,
      DyFilterInput,
      MenuSelect,
      AuthoritySelect
    },
    directives: {waves, permission},
    filters: {},
    data() {
      const validatorRequired = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.system.sysRoleManager.formData.${rule.field}`) + i18n.t('action.required')))
        } else {
          callback()
        }
      };
      return {
        cacheData: {},
        selectedMenus: [],
        selectedRole: {bindId: '', bindType: 'role'},
        selectedAuthorities: [],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 0,
          pageSize: 10,
          orderBy: '',
          roleName: '',
          roleCode: ''
        },
        multipleSelection: [],
        formVisible: false,
        bindMenusVisible: false,
        bindAuthoritiesVisible: false,
        isEdit: false,
        formData: {
          id: '',
          roleCode: '',
          roleName: '',
          remark: ''
        },
        rules: {
          roleName: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ],
          roleCode: [
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
          ]
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
        this.$refs.menuSelect.$emit('updateData')
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
          'params[roleCode]': this.listQuery.roleCode,
          'params[roleName]': this.listQuery.roleName
        }
        sysRoleList(query)
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
      bindMenuCancel(event) {
        this.bindMenusVisible = false
        this.selectedMenus = []
      },
      bindMenuSubmit(checkedKeys, halfCheckedKeys, event) {
        this.bindMenusVisible = false
        const roleIds = this.multipleSelection.map(v => {
          return v.id
        })
        batchGrantRoleMenus({
          grantIds: roleIds,
          permissions: checkedKeys,
          halfPermissions: halfCheckedKeys
        })
          .then(data => {
            this.handleFilter()
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.bindMenusVisible = false
            this.selectedMenus = []
          })
      },
      bindAuthorityCancel(event) {
        this.bindAuthoritiesVisible = false
      },
      bindAuthoritySubmit(roleId, multipleSelection, event) {
        if (!multipleSelection) {
          this.bindAuthoritiesVisible = false
          return;
        }
        batchGrantRolePermissions({
          grantIds: [roleId],
          permissions: multipleSelection
        })
          .then(data => {
            this.handleFilter()
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.bindAuthoritiesVisible = false
          })
      },
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
      // 删除处理
      handleRemove(id) {
        this.$confirm(this.$t('views.commons.confirm.remove_text'), {
          type: 'warning'
        }).then(() => {
          sysRoleRemove(id).then(response => {
            this.handleQueryList()
          })
        })
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            sysRoleSave(this.formData)
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
        } else if ('bindMenus' === type) {
          // todo 设置已有权限
          let selectedRole = multipleSelection[0].id
          getRoleMenus(selectedRole)
            .then(data => {
              this.selectedMenus = data
            })
            .finally(() => {
              this.bindMenusVisible = true
            })
        } else if ('bindAuthorities' === type) {
          let roleId = multipleSelection[0].id
          this.$refs.authoritySelect.$emit('updateData', {bindType: 'role', bindId: roleId})
          this.bindAuthoritiesVisible = true
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
        if (type === 'bindMenus') {
          this.bindMenusVisible = true
        } else if (type === 'bindAuthorities') {
          this.bindAuthoritiesVisible = true
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-cell {
    padding: 2px 0;
  }
</style>
