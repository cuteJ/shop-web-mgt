<template>
  <div class="app-container app-container_noshadow">
    <div class="filter-container">
    </div>
    <div class="actions-container">
      <el-row>
        <el-col :span="20">
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-plus"
            @click="formOpen"
          >{{ $t('table.add') }}
          </el-button>
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-edit"
            @click="handleSelected('edit')"
          >{{ $t('table.edit') }}
          </el-button>
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-plus"
            @click="handleSelected('addInstance')"
          >{{ $t('views.system.sysJobManager.jobDetailsManager.action.addInstance') }}
          </el-button>
        </el-col>
        <el-col :span="4">
          <div class="right-actions">
            <el-button
              class="action-item"
              size="small"
              icon="el-icon-circle-close"
              @click="handleReset"
            >{{ $t('table.reset') }}
            </el-button>
            <el-button
              class="action-item"
              size="small"
              icon="el-icon-search"
              @click="handleFilter"
            >{{ $t('table.query') }}
            </el-button>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobDetailsManager.formData.jobName')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.jobName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobDetailsManager.formData.description')"
        align="center"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobDetailsManager.formData.clazzPath')"
        :show-overflow-tooltip="true"
        align="center"
        width="300px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.clazzPath }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobDetailsManager.formData.jobParams')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.jobParams }}</span>
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
          :label="$t('views.system.sysJobManager.jobDetailsManager.formData.jobName')"
          prop="jobName"
        >
          <el-input
            v-model="formData.jobName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysJobManager.jobDetailsManager.formData.description')"
        >
          <el-input
            v-model="formData.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysJobManager.jobDetailsManager.formData.clazzPath')"
          prop="clazzPath"
        >
          <el-input
            v-model="formData.clazzPath"
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

    <form-dialog
      :visible.sync='formVisibleInstance'
      :title="$t('views.system.sysJobManager.jobDetailsManager.action.addInstance')"
      @onCancel="formCloseInstance"
      @onSubmit="handleFormSaveInstance"
    >
      <el-form
        ref="formDataInstance"
        :rules="rulesInstance"
        :model="formDataInstance"
        label-width="100px"
      >
        <el-form-item
          :label="$t('views.system.sysJobManager.jobDetailsManager.formData.jobId')"
          prop="jobId"
        >
          <el-input
            :disabled="true"
            v-model="formDataInstance.jobId"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysJobManager.jobDetailsManager.formData.triggerId')"
          prop="triggerId"
        >
          <dy-select
            ref="triggerDySelect"
            :placeholder="$t('views.system.sysJobManager.jobDetailsManager.action.triggerDySelect')"
            :selected.sync="formDataInstance.triggerId"
            :selectType="'JOB_TRIGGER'"
          >
          </dy-select>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysJobManager.jobDetailsManager.formData.groupName')"
          prop="groupName"
        >
          <el-input
            v-model="formDataInstance.groupName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysJobManager.jobDetailsManager.formData.instanceTimeRange')"
        >
          <el-date-picker
            style="width: 100%"
            v-model="instanceTimeRange"
            type="datetimerange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
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
    jobDetailsList,
    jobDetailsSave,
    jobDetailsRemove,
    saveOrUpdateJobInstance
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

  export default {
    name: 'jobDetailsManager',
    components: {
      Pagination,
      SysCode,
      DySelect,
      FormDialog,
      DyFilterInput
    },
    directives: {waves, permission},
    filters: {},
    data() {
      const validatorRequired = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.system.sysJobManager.jobDetailsManager.formData.${rule.field}`) + i18n.t('action.required')))
        } else {
          callback()
        }
      };
      return {
        cacheData: {},
        selectedMenus: [],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 0,
          pageSize: 10,
          orderBy: ''
        },
        multipleSelection: [],
        formVisible: false,
        formVisibleInstance: false,
        isEdit: false,
        formData: {
          id: "",
          remark: "",
          clazzPath: "",
          description: "",
          jobName: "",
          jobParams: "",
          status: ""
        },
        instanceTimeRange: [],
        formDataInstance: {
          jobId: "",
          triggerId: "",
          groupName: "",
          instanceParams: {},
          endTime: "",
          startTime: ""
        },
        rulesInstance: {
          triggerId: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ],
          jobId: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ],
        },
        rules: {
          jobName: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ],
          clazzPath: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ]
        }
      }
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
        jobDetailsList(query)
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
      updateChildData() {
        this.$refs.triggerDySelect.$emit('updateData')
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
      formOpenInstance(row) {
        this.formVisibleInstance = true
        this.formDataInstance.jobId = row.id;
        this.$nextTick(() => {
          this.updateChildData();
        })
      },
      // 关闭Form表单
      formCloseInstance() {
        this.formVisibleInstance = false
        this.$refs['formDataInstance'].resetFields()
      },
      // 删除处理
      handleRemove(id) {
        this.$confirm(this.$t('views.commons.confirm.remove_text'), {
          type: 'warning'
        }).then(() => {
          jobDetailsRemove(id).then(response => {
            this.handleQueryList()
          })
        })
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            this.formData.status = '100001'
            jobDetailsSave(this.formData)
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
      handleFormSaveInstance() {
        this.$refs['formDataInstance'].validate(valid => {
          if (valid) {
            if (this.instanceTimeRange && this.instanceTimeRange.length > 0) {
              this.formDataInstance.startTime = this.instanceTimeRange[0]
              this.formDataInstance.endTime = this.instanceTimeRange[1]
            }
            saveOrUpdateJobInstance(this.formDataInstance)
              .then(data => {
                this.formVisibleInstance = false
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
        } else if ('addInstance' === type) {
          this.formOpenInstance(multipleSelection[0])
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
