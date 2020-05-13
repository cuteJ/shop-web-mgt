<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('views.user.userLoginManager.formData.appNo')"
        v-model="listQuery.appNo"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
      <div style="display: inline-block">
        <dy-select
          style="width: 250px;"
          :placeholder="$t('views.user.userLoginManager.formData.maType')"
          :selected.sync="listQuery.maType"
          :selectType="'MA_TYPE'"
        >
        </dy-select>
      </div>
      <el-input
        v-if="listQuery.maType === 'wx' || listQuery.maType === 'swan' || listQuery.maType === 'tt' || listQuery.maType === 'my'"
        :placeholder="$t('views.user.userLoginManager.formData.openid')"
        v-model="listQuery.openid"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
      <el-input
        :placeholder="$t('views.user.userLoginManager.formData.username')"
        v-model="listQuery.username"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
      <el-input
        v-if="listQuery.maType === 'h5'"
        :placeholder="$t('views.user.userLoginManager.formData.phoneNo')"
        v-model="listQuery.phoneNo"
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
        :label="$t('views.user.userLoginManager.formData.avatarUrl')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <el-image :src="scope.row.avatarUrl" class="avatar">
            <div slot="error" class="avatar-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.user.userLoginManager.formData.nickName')"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.user.userLoginManager.formData.appNo')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.appNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.user.userLoginManager.formData.maType')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.maType | statusFilter(cacheData.options['MA_TYPE']) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.user.userLoginManager.formData.phoneNo')"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.user.userLoginManager.formData.username')"
        align="center"
        width="120px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.user.userLoginManager.formData.openid')"
        align="center"
        width="150px"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.openid }}</span>
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
    userLoginList,
    maSessionList
  } from '@/api/user'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import SysCode from '@/components/SysCode'
  import DySelect from '@/components/DySelect'
  import {cacheData, cacheSelectOptionsData} from '@/utils/cache'
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import checkPermission from '@/utils/permission' // 权限判断函数

  export default {
    name: 'userLoginManager',
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
          loginName: '',
          username: ''
        },
        multipleSelection: [],
      }
    },
    mounted() {
      this.handleQueryList()
      cacheSelectOptionsData(
        this.cacheData, 'MA_TYPE').then(() => {
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
        this.listQuery.appNo = '';
        this.listQuery.maType = '';
        this.listQuery.username = '';
        this.listQuery.phoneNo = '';
        this.listQuery.openid = '';
        this.handleFilter();
      },
      /***********************Remote query list************************* */
      handleQueryList() {
        this.listLoading = true
        let query = {
          pageSize: this.listQuery.pageSize,
          pageNum: this.listQuery.pageNum,
          'params[appNo]': this.listQuery.appNo,
          'params[maType]': this.listQuery.maType,
          'params[username]': this.listQuery.username,
          'params[phoneNo]': this.listQuery.phoneNo,
          'params[openid]': this.listQuery.openid
        }
        userLoginList(query)
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
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }
  .avatar-slot{
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }
</style>
