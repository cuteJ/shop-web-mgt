<template>
  <div class="app-container">
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
        :label="$t('views.system.sysJobManager.jobTriggerManager.formData.triggerName')"
        align="center"
        width="230"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.triggerName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobTriggerManager.formData.interval')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.interval }} {{ scope.row.intervalUnit | interValUnitFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobTriggerManager.formData.timeRangeOfDay')"
        align="center"
        width="200px"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.startTimeOfDay">{{ scope.row.startTimeOfDay }}</span> -
          <span v-if="scope.row.endTimeOfDay">{{ scope.row.endTimeOfDay }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobTriggerManager.formData.repeatCount')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.repeatCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobTriggerManager.formData.cron')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.cron }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.jobTriggerManager.formData.triggerType')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span v-if="cacheData.statusMap">{{ scope.row.triggerType | statusFilter(cacheData.statusMap['1002'])}}</span>
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
          :label="$t('views.system.sysJobManager.jobTriggerManager.formData.triggerName')"
          prop="triggerName"
        >
          <el-input
            v-model="formData.triggerName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysJobManager.jobTriggerManager.formData.triggerType')"
          prop="triggerType"
        >
          <sys-code
            v-if="cacheData.codes"
            @change="handleTriggerTypeChange"
            :cache-options="cacheData['codes']"
            :type-code="'1002'"
            :selected.sync="formData.triggerType"
          />
        </el-form-item>
        <div v-if="this.formData.triggerType === '100200'">
          <el-form-item
            :label="$t('views.system.sysJobManager.jobTriggerManager.formData.repeatCount')"
            prop="repeatCount"
          >
            <el-input
              v-model="formData.repeatCount"
              :placeholder="$t('views.system.sysJobManager.jobTriggerManager.formData.repeatCount_p')"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('views.system.sysJobManager.jobTriggerManager.formData.interval')"
            prop="interval"
          >
            <el-input v-model="formData.interval">
              <el-select v-model="formData.intervalUnit" slot="append"
                         :placeholder="$t('views.system.sysJobManager.jobTriggerManager.formData.intervalUnit')">
                <el-option v-for="(value, key) in unitMap"
                           :key="key"
                           :label="value"
                           :value="key"/>
              </el-select>
            </el-input>
          </el-form-item>
        </div>
        <div v-if="this.formData.triggerType === '100201'">
          <el-form-item
            :label="$t('views.system.sysJobManager.jobTriggerManager.formData.timeRangeOfDay')"
          >
            <el-time-picker
              style="width: 100%"
              is-range
              v-model="timeRange"
              value-format="HH:mm:ss"
              range-separator="-">
            </el-time-picker>
          </el-form-item>
          <el-form-item
            :label="$t('views.system.sysJobManager.jobTriggerManager.formData.daysOfWeek')"
            prop="daysOfWeek"
          >
            <el-checkbox-group v-model="daysOfWeek">
              <el-checkbox v-for="(value, key) in weeksMap"
                           :key="key"
                           :label="value">{{value}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            :label="$t('views.system.sysJobManager.jobTriggerManager.formData.interval')"
            prop="interval"
          >
            <el-input v-model="formData.interval">
              <el-select v-model="formData.intervalUnit" slot="append"
                         :placeholder="$t('views.system.sysJobManager.jobTriggerManager.formData.intervalUnit')"
              >
                <el-option v-for="(value, key) in unitDayMap"
                           :key="key"
                           :label="value"
                           :value="key"/>
              </el-select>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item
          :label="$t('views.system.sysJobManager.jobTriggerManager.formData.cron')"
          prop="cron"
          v-if="this.formData.triggerType === '100202'"
        >
          <code>
            {{$t('views.system.sysJobManager.jobTriggerManager.formData.cron_1')}}<br/>
            {{$t('views.system.sysJobManager.jobTriggerManager.formData.cron_2')}} <br/>
            <a
              target="_bank"
              href="http://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/crontrigger.html"
            >{{$t('views.system.sysJobManager.jobTriggerManager.formData.cron_3')}}</a>
          </code>
          <el-input
            v-model="formData.cron"
            autocomplete="off"
          ></el-input>
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
    jobTriggerList,
    jobTriggerSave,
    jobTriggerRemove,
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

  //  MILLISECOND, SECOND, MINUTE, HOUR, DAY, WEEK, MONTH, YEAR
  const unitMap = {
    MILLISECOND: i18n.t('views.system.sysJobManager.jobTriggerManager.map.MILLISECOND'),
    SECOND: i18n.t('views.system.sysJobManager.jobTriggerManager.map.SECOND'),
    MINUTE: i18n.t('views.system.sysJobManager.jobTriggerManager.map.MINUTE'),
    HOUR: i18n.t('views.system.sysJobManager.jobTriggerManager.map.HOUR'),
    DAY: i18n.t('views.system.sysJobManager.jobTriggerManager.map.DAY'),
    WEEK: i18n.t('views.system.sysJobManager.jobTriggerManager.map.WEEK'),
    MONTH: i18n.t('views.system.sysJobManager.jobTriggerManager.map.MONTH'),
    YEAR: i18n.t('views.system.sysJobManager.jobTriggerManager.map.YEAR'),
  };

  const unitDayMap = {
    MILLISECOND: i18n.t('views.system.sysJobManager.jobTriggerManager.map.MILLISECOND'),
    SECOND: i18n.t('views.system.sysJobManager.jobTriggerManager.map.SECOND'),
    MINUTE: i18n.t('views.system.sysJobManager.jobTriggerManager.map.MINUTE'),
    HOUR: i18n.t('views.system.sysJobManager.jobTriggerManager.map.HOUR'),
  };

  const weeksMap = {
    2: i18n.t('views.system.sysJobManager.jobTriggerManager.map.WEEK_2'),
    3: i18n.t('views.system.sysJobManager.jobTriggerManager.map.WEEK_3'),
    4: i18n.t('views.system.sysJobManager.jobTriggerManager.map.WEEK_4'),
    5: i18n.t('views.system.sysJobManager.jobTriggerManager.map.WEEK_5'),
    6: i18n.t('views.system.sysJobManager.jobTriggerManager.map.WEEK_6'),
    7: i18n.t('views.system.sysJobManager.jobTriggerManager.map.WEEK_7'),
    1: i18n.t('views.system.sysJobManager.jobTriggerManager.map.WEEK_1'),
  }

  export default {
    name: 'jobTriggerManager',
    components: {
      Pagination,
      SysCode,
      DySelect,
      FormDialog,
      DyFilterInput
    },
    directives: {waves, permission},
    filters: {
      interValUnitFilter(value) {
        return unitMap[value]
      }
    },
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
        selectedMenus: [],
        tableKey: 0,
        list: null,
        listLoading: true,
        listQuery: {},
        multipleSelection: [],
        formVisible: false,
        isEdit: false,
        timeRange: [new Date(), new Date()],
        daysOfWeek: [],
        weeksMap: weeksMap,
        unitMap: unitMap,
        unitDayMap: unitDayMap,
        formData: {
          id: "",
          remark: "",
          cron: "",
          interval: 0,
          intervalUnit: "MILLISECOND",
          repeatCount: 0,
          triggerName: "",
          triggerType: "",
          daysOfWeek: "",
          endTimeOfDay: "",
          startTimeOfDay: ""
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
      cacheData(this.cacheData, '1002').then(() => {
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
        jobTriggerList()
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
        this.$refs['formData'].resetFields()
      },
      // 删除处理
      handleRemove(id) {
        this.$confirm(this.$t('views.commons.confirm.remove_text'), {
          type: 'warning'
        }).then(() => {
          jobTriggerRemove(id).then(response => {
            this.handleQueryList()
          })
        })
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            this.formData.status = '100001'
            if (this.formData.triggerType === '100200') {
              if (!this.formData.interval || !this.formData.intervalUnit) {
                this.$message({
                  type: 'error',
                  message: this.$t('views.system.sysJobManager.jobTriggerManager.formData.interval') + i18n.t('action.required')
                })
                return;
              }
            } else if (this.formData.triggerType === '100201') {
              if (!this.formData.interval || !this.formData.intervalUnit || !this.timeRange || this.timeRange.length < 0) {
                this.$message({
                  type: 'error',
                  message: this.$t('views.system.sysJobManager.jobTriggerManager.formData.interval') + i18n.t('action.required')
                })
                return;
              }
              if (this.daysOfWeek.length > 0) {
                this.formData.daysOfWeek = this.daysOfWeek.toString()
              }
              this.formData.startTimeOfDay = this.timeRange[0]
              this.formData.endTimeOfDay = this.timeRange[1]
            } else if (this.formData.triggerType === '100202') {

            }
            jobTriggerSave(this.formData)
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
      },
      handleTriggerTypeChange() {

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-cell {
    padding: 2px 0px;
  }
</style>
