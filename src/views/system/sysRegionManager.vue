<template>
  <div class="app-container">
    <div class="actions-container">
      <el-row>
        <el-col :span="18">
<!--          <el-button-->
<!--            class="action-item"-->
<!--            size="small"-->
<!--            v-waves-->
<!--            icon="el-icon-plus"-->
<!--            @click="formOpen"-->
<!--          >{{ $t('table.add') }}-->
<!--          </el-button>-->
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
            icon="el-icon-edit"
            @click="handleInit()"
          >{{$t('views.system.sysRegionManager.action.handleInit')}}
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysRegionManager.formData.name')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysRegionManager.formData.jianPin')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.jianPin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysRegionManager.formData.pinYin')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.pinYin }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysRegionManager.formData.firstLetter')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.firstLetter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="级别名"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.depthName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysRegionManager.formData.depth')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.depth }}</span>
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
          :label="$t('views.system.sysRegionManager.formData.name')"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysRegionManager.formData.depth')"
          prop="depth"
        >
          <el-input
            v-model="formData.depth"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysRegionManager.formData.depthName')"
          prop="depthName"
        >
          <el-input
            v-model="formData.depthName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysRegionManager.formData.jianPin')"
          prop="jianPin"
        >
          <el-input
            v-model="formData.jianPin"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysRegionManager.formData.pinYin')"
          prop="jianPin"
        >
          <el-input
            v-model="formData.pinYin"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysRegionManager.formData.firstLetter')"
          prop="firstLetter"
        >
          <el-input
            v-model="formData.firstLetter"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>
  </div>
</template>

<script>
  import {
    regionList,
    initRegion,
    regionSave,
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
  import area from '@/utils/area'

  export default {
    name: 'sysRegionManager',
    components: {
      Pagination,
      SysCode,
      DySelect,
      FormDialog,
      DyFilterInput,
    },
    directives: {waves, permission},
    filters: {},
    data() {
      const validatorRequired = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.system.sysRegionManager.formData.${rule.field}`) + i18n.t('action.required')))
        } else {
          callback()
        }
      };
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
          authorityName: ''
        },
        multipleSelection: [],
        formVisible: false,
        isEdit: false,
        formData: {
          id: "",
          depth: 0,
          depthName: "",
          firstLetter: "",
          jianPin: "",
          name: "",
          parentId: "",
          pinYin: ""
        },
        rules: {
          name: [
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
      /***********************Remote query list************************* */
      handleQueryList() {
        this.listLoading = true
        let query = {
          pageSize: this.listQuery.pageSize,
          pageNum: this.listQuery.pageNum,
          'params[shiroCode]': this.listQuery.shiroCode,
          'params[authorityName]': this.listQuery.authorityName
        }
        regionList(query)
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
      // 删除处理
      handleRemove(id) {
        this.$confirm(this.$t('views.commons.confirm.remove_text'), {
          type: 'warning'
        }).then(() => {
        })
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            regionSave(this.formData)
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
          return
        }
      },
      handleInit() {
        this.$confirm(this.$t('views.system.sysRegionManager.message.handleInit'), {
          type: 'warning'
        }).then(() => {
          initRegion(1, JSON.stringify(area.province_list)).then(() => {
          })
          initRegion(2, JSON.stringify(area.city_list)).then(() => {
          })
          initRegion(3, JSON.stringify(area.county_list)).then(() => {
          })
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-cell {
    padding: 2px 0px;
  }
</style>
