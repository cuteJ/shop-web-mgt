<template>
  <div class="app-container">
    <div class="metadata-left">
      <div class="metadata-table-filter">
        <el-input clearable
                  @keyup.enter.native="handleFilter"
                  placeholder="请输入内容" v-model="listQuery.tableName">
          <el-button slot="append" icon="el-icon-search"
                     @click="handleFilter"
                     v-waves></el-button>
        </el-input>
      </div>
      <div class="metadata-body">
        <div class="metadata-item" v-bind:class="{ active: index === csr, '': index !== csr }"
             @click="handleDetails(index, item)"
             v-for="(item, index) in list" :key="item.id">
          {{item.tableName + ' (' + item.remarks + ')'}}
        </div>
      </div>
    </div>
    <div class="metadata-right">
      <div class="metadata-table-action clearfix">
        <el-button
          @click="handleSyncData"
          class="metadata-action-item"
          v-waves
        >同步数据
        </el-button>
      </div>

      <el-form v-if="row.tableName" label-width="100px" class="metadata-body">
        <el-form-item
          label="表名"
        >
          <span>{{row.tableName + ' (' + row.remarks + ')'}}</span>
        </el-form-item>
        <el-form-item
          label='主键'
        >
          <span>{{row.pkName}}</span>
        </el-form-item>
        <div class="columns">
          <el-table
            :data="row.columns"
            border>
            <el-table-column
              label="字段名"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.columnName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.typeName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="不为空"
              align="center"
              width="80px"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.notNull === true ? '是' : '否' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="描述"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div v-else class="metadata-body">
        <div style="text-align: center;">
          <span>暂无</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    tableMetadataList,
    allTableMetadataList,
    metadataDetails,
    tableMetadataSync
  } from '@/api/system'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import SysCode from '@/components/SysCode'
  import DySelect from '@/components/DySelect'
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import checkPermission from '@/utils/permission' // 权限判断函数

  export default {
    name: 'sysMetadataManager',
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
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          pageNum: 0,
          pageSize: 10,
          orderBy: '+id',
          tableName: null
        },
        multipleSelection: [],
        formVisible: false,
        bindRolesVisible: false,
        isEdit: false,
        row: {},
        csr: -1
      }
    },
    mounted() {
      this.handleFilter();
    },
    methods: {
      checkPermission,
      /***********************Filter search************************* */
      handleFilter() {
        this.handleQueryList()
      },
      /***********************Remote query list************************* */
      handleQueryList() {
        this.listLoading = true
        let query = this.listQuery.tableName;
        if (this.listQuery.tableName) {
          query = {
            tableName: '%' + this.listQuery.tableName + '%'
          }
        }
        allTableMetadataList(query).then(data => {
          this.list = data;
        })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.listLoading = false
          })
      },
      handleDetails(index, row) {
        metadataDetails(row.id).then(data => {
          this.row = data
          this.csr = index
        })
      },
      handleSyncData() {
        this.$confirm('确认进行数据同步', {
          type: 'warning'
        }).then(() => {
          tableMetadataSync().then(response => {
            this.handleQueryList()
          })
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
          return
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-cell {
    padding: 2px 0;
  }

  .metadata-left {
    float: left;
    border-right: 2px solid #FEFEFE;
    width: 50%;
    padding: 0 10px;
  }

  .metadata-right {
    float: right;
    width: 50%;
    padding: 0 10px;
  }

  .metadata-table-filter {
  }

  .metadata-table-action {
    width: 100%;
  }

  .metadata-action-item {
    float: right;
  }

  .metadata-body {
    padding: 20px 0;
  }

  .columns {
    padding-left: 35px;
  }

  .metadata-item {
    color: rgba(42, 48, 60, 1);
    font-size: 14px;
    font-weight: 600;
    line-height: 33px;
    letter-spacing: 0px;
    margin: 8px 0;
    cursor: pointer;

    &.active {
      color: rgba(242, 246, 252, 1);
      background-color: rgba(96, 98, 102, 1);
    }
  }

  .metadata-item:hover {
    color: rgba(242, 246, 252, 1);
    background-color: rgba(96, 98, 102, 1);
  }
</style>
