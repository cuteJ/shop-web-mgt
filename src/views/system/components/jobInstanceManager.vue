<template>
  <div class="app-container">
    <div class="filter-container">
    </div>
    <div class="actions-container">
      <el-row>
        <!--        <el-col :span="20">-->
        <!--          <el-button-->
        <!--            class="action-item"-->
        <!--            size="small"-->
        <!--            v-waves-->
        <!--            icon="el-icon-plus"-->
        <!--            @click="formOpen"-->
        <!--          >{{ $t('table.add') }}-->
        <!--          </el-button>-->
        <!--          <el-button-->
        <!--            class="action-item"-->
        <!--            size="small"-->
        <!--            v-waves-->
        <!--            icon="el-icon-edit"-->
        <!--            @click="handleSelected('edit')"-->
        <!--          >{{ $t('table.edit') }}-->
        <!--          </el-button>-->
        <!--        </el-col>-->
        <el-col :span="24">
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
        :label="$t('views.system.sysJobManager.jobInstanceManager.formData.jobName')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.jobName }}</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('table.logs')"
            placement="top-start"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-third-data"
              @click="formOpenOpt(scope.row, 'logs')"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobInstanceManager.formData.groupName')"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag>
            {{ scope.row.groupName }}
          </el-tag>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobInstanceManager.formData.triggerRule')"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.triggerRule }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column-->
<!--        :label="$t('views.system.sysJobManager.jobInstanceManager.formData.instanceId')"-->
<!--        align="center"-->
<!--        width="280"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.instanceId }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        :label="$t('views.system.sysJobManager.jobInstanceManager.formData.timeRangeOfDay')"
        align="center"
        width="200px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.startTime">{{ scope.row.startTime | parseTime }}</span> -
          <span v-if="scope.row.endTime">{{ scope.row.endTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span v-if="cacheData.statusMap">{{ scope.row.status | statusFilter(cacheData.statusMap['1003'])}}</span>
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
            :content="$t('table.logs')"
            placement="top-start"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-third-data"
              @click="formOpenOpt(scope.row, 'logs')"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('table.start')"
            placement="top-start"
            v-if="scope.row.status === '100301'"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-third-iconfontplay2"
              @click="formOpenOpt(scope.row, 'start')"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('table.pause')"
            placement="top-start"
            v-if="scope.row.status === '100300'"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-third-iconfontstop"
              @click="formOpenOpt(scope.row, 'pause')"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('table.release')"
            placement="top-start"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-third-delete"
              @click="handleRemove(scope.row.instanceId)"
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
        label-width="100px"
      >
        <el-form-item
          :label="$t('views.system.sysJobManager.jobInstanceManager.formData.triggerName')"
          prop="triggerName"
        >
          <el-input
            v-model="formData.triggerName"
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
  </div>
</template>

<script>
  import {
    jobInstanceList,
    startJobInstance,
    pauseJobInstance,
    removeJobInstance,
  } from '@/api/system'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import SysCode from '@/components/SysCode'
  import DySelect from '@/components/DySelect'
  import DyFilterInput from '@/components/DyFilterInput'
  import FormDialog from '@/components/FormDialog'
  import {cacheData} from '@/utils/cache'
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import checkPermission from '@/utils/permission'

  export default {
    name: 'jobInstanceManager',
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
          callback(new Error(i18n.t(`views.system.sysJobManager.jobTriggerManager.formData.${rule.field}`) + i18n.t('action.required')))
        } else {
          callback()
        }
      };
      return {
        cacheData: {},
        tableKey: 0,
        list: null,
        listLoading: true,
        listQuery: {},
        multipleSelection: [],
        formVisible: false,
        isEdit: false,
        formData: {
          id: "",
          remark: "",
          clazzPath: "",
          groupName: "",
          instanceId: "",
          instanceParams: "",
          jobId: "",
          jobName: "",
          status: "",
          triggerId: "",
          triggerRule: "",
          endTime: "",
          startTime: ""
        },
        rules: {
          triggerName: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ],
          triggerType: [
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
      cacheData(this.cacheData, '1003,1004').then(() => {
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
        this.handleQueryList()
      },
      handleReset() {
        this.handleQueryList()
      },
      /***********************Remote query list************************* */
      handleQueryList() {
        this.listLoading = true
        jobInstanceList()
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
      formClose(row) {
        this.formVisible = false
        this.$refs['formData'].resetFields()
      },
      formOpenOpt(row, actionType) {
        if ('logs' === actionType) {
          this.$router.push(`/jobs/jobRunLog_manager/${row.instanceId}`)
          return;
        }
        this.$confirm(this.$t('views.system.sysJobManager.jobInstanceManager.message.formOpenOpt'), {
          type: 'warning'
        }).then(() => {
          if ('start' === actionType) {
            startJobInstance(row.instanceId).then(data => {
              this.handleQueryList();
            })
          } else if ('pause' === actionType) {
            pauseJobInstance(row.instanceId).then(data => {
              this.handleQueryList();
            })
          }
        })
      },
      // 删除处理
      handleRemove(id) {
        this.$confirm(this.$t('views.system.sysJobManager.jobInstanceManager.message.handleRemove'), {
          type: 'warning'
        }).then(() => {
          removeJobInstance(id).then(response => {
            this.handleQueryList()
          })
        })
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
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
    padding: 2px 0px;
  }
</style>
