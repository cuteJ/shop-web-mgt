<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('views.system.sysOptLogManager.formData.operator')"
        v-model="listQuery.operator"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
    </div>
    <div class="actions-container">
      <el-row>
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
    >
      <el-table-column
        type="index"
        width="55"
      >
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysOptLogManager.formData.operator')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysOptLogManager.formData.optName')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.optName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysOptLogManager.formData.optIp')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.optIp }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysOptLogManager.formData.ipGeo')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ipGeo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysOptLogManager.formData.requestUrl')"
        align="center"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.requestUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysOptLogManager.formData.requestData')"
        align="center"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.requestData }}</span>
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
    optLogList,
  } from '@/api/system'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import SysCode from '@/components/SysCode'
  import DySelect from '@/components/DySelect'
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import checkPermission from '@/utils/permission' // 权限判断函数

  export default {
    name: 'sysOptLogManager',
    components: {
      Pagination,
      SysCode,
      DySelect,
    },
    directives: {waves, permission},
    filters: {},
    data() {
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
          operator: ''
        },
        multipleSelection: [],
      }
    },
    mounted() {
      this.handleQueryList()
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
        this.listQuery.operator = '';
      },
      /***********************Remote query list************************* */
      handleQueryList() {
        this.listLoading = true
        let query = {
          pageSize: this.listQuery.pageSize,
          pageNum: this.listQuery.pageNum,
          'params[operator]': this.listQuery.operator
        }
        optLogList(query)
          .then(response => {
            this.list = response.list;
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

</style>
