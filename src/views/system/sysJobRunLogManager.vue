<template>
  <div class="app-container">
    <div class="actions-container">
      <el-row
        :gutter="40"
        class="panel-group"
      >
        <el-col :span="12" class="card-panel-col">
          <div class="card-panel" @click="handleSetData('100400')">
            <div class="card-panel-icon-wrapper icon-success">
              <el-badge
                :hidden="statistics.success_count===0"
                :value="statistics.success_count"
                class="item"
              >
                <svg-icon
                  icon-class="fund"
                  class-name="card-panel-icon"
                />
              </el-badge>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ $t('table.success') }}</div>
              <count-to
                :start-val="0"
                :end-val="statistics.success_count"
                :duration="3000"
                class="card-panel-num"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="card-panel-col">
          <div class="card-panel" @click="handleSetData('100401')">
            <div class="card-panel-icon-wrapper icon-fail">
              <el-badge
                :hidden="statistics.fail_count===0"
                :value="statistics.fail_count"
                class="item"
              >
                <svg-icon
                  icon-class="cry"
                  class-name="card-panel-icon"
                />
              </el-badge>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">{{ $t('table.fail') }}</div>
              <count-to
                :start-val="0"
                :end-val="statistics.fail_count"
                :duration="3000"
                class="card-panel-num"
              />
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <sys-code
            size="small"
            :selectStyle="'width: 250px;'"
            v-if="cacheData.codes"
            :cacheOptions="cacheData['codes']"
            :typeCode="'1004'"
            :selected.sync="status"
          ></sys-code>
          <el-button
            style="float: right"
            size="small"
            icon="el-icon-circle-close"
            @click="handleReset"
          >{{ $t('table.reset') }}
          </el-button>
          <el-button
            style="float: right"
            class="action-item"
            size="small"
            icon="el-icon-search"
            @click="handleFilter"
          >{{ $t('table.query') }}
          </el-button>
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
    >
      <el-table-column
        type="index"
        width="55"
      >
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span v-if="cacheData.statusMap">{{ scope.row.status | statusFilter(cacheData.statusMap['1004'])}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysJobManager.sysJobRunLogManager.formData.result')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.result }}</span>
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
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="handleQueryList"
    />
  </div>
</template>

<script>
  import {
    jobRunLogList,
    jobRunLogStatistics,
  } from '@/api/system'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import SysCode from '@/components/SysCode'
  import FormDialog from '@/components/FormDialog'
  import {cacheData} from '@/utils/cache'
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import checkPermission from '@/utils/permission' // 权限判断函数
  import CountTo from 'vue-count-to'

  export default {
    name: 'sysJobRunLogManager',
    components: {
      Pagination,
      SysCode,
      FormDialog,
      CountTo
    },
    directives: {waves, permission},
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
          orderBy: '',
        },
        multipleSelection: [],
        timeRange: [],
        status: '',
        instanceId: '',
        statistics: {
          success_count: 0,
          fail_count: 0,
        }
      }
    },
    created() {
    },
    mounted() {
      this.instanceId = this.$route.params.instanceId;
      cacheData(this.cacheData, '1004').then(() => {
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
        if (this.timeRange && this.timeRange.length > 0) {
          this.listQuery.startTime = this.timeRange[0];
          this.listQuery.endTime = this.timeRange[1];
        }
        this.handleQueryList()
      },
      handleReset() {
        this.status = ''
        this.timeRange = []
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
        this.handleFilter()
      },
      handleSetData(status) {
        this.status = status;
        this.handleFilter()
      },
      /***********************Remote query list************************* */
      handleQueryList() {
        this.listLoading = true
        const query = {
          pageSize: this.listQuery.pageSize,
          pageNum: this.listQuery.pageNum,
          'params[instanceId]': this.instanceId,
          'params[startTime]': this.listQuery.startTime,
          'params[endTime]': this.listQuery.endTime,
          'params[status]': this.status,
        }
        jobRunLogList(query)
          .then(response => {
            this.list = response.list
            this.total = response.total
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.listLoading = false
          });
        const queryLog = {
          instanceId: this.instanceId,
          status: this.status,
          startTime: this.listQuery.startTime,
          endTime: this.listQuery.endTime,
        }
        jobRunLogStatistics(queryLog).then(data => {
          this.statistics = data;
        })
      },
      /***********************Table actions************************* */
      // 打开Form表单
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

  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-fail {
          background: #f4516c;
        }

        .icon-success {
          background: #34bfa3;
        }
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-fail {
        color: #f4516c;
      }

      .icon-success {
        color: #34bfa3;
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>

