<template>
  <div class="app-container">
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
        label="标题"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="子标题"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.subTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="图标"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="颜色"
        align="center"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.color }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="背景颜色"
        align="center"
        :show-overflow-tooltip='true'
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.background }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="提示语"
        align="center"
        width="150px"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.remindMsg }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="说明"
        align="center"
        width="150px"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
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
          label="标题"
          prop="title"
        >
          <el-input
            v-model="formData.title"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="子标题"
          prop="subTitle"
        >
          <el-input
            v-model="formData.subTitle"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="提示语"
          prop="remindMsg"
        >
          <el-input
            v-model="formData.remindMsg"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="颜色"
          prop="color"
        >
          <el-input
            class="fix-append"
            v-model="formData.color"
            :disabled="true"
            autocomplete="off"
          >
            <div slot="append" style="background: transparent; border: none">
              <el-color-picker
                v-model="formData.color"
                show-alpha
                :predefine="predefineColors"
              ></el-color-picker>
            </div>
          </el-input>

        </el-form-item>
        <el-form-item
          label="背景颜色"
          prop="background"

        >
          <el-input
            class="fix-append"
            v-model="formData.background"
            autocomplete="off"
          >
            <el-color-picker
              slot="append"
              v-model="habitBackground"
              show-alpha
              :predefine="predefineColors"
            ></el-color-picker>
          </el-input>
        </el-form-item>
        <el-form-item
          label="图标"
          prop="icon"
        >
          <el-input
            v-model="formData.icon"
            autocomplete="off"
          >
            <el-button slot="append" icon="el-icon-plus" @click="openAddIcon"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item
          label="说明"
        >
          <el-input
            type="textarea"
            v-model="formData.content"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>

    <app-svg-icons :visible.sync='svgFormVisible' @onCancel="closeAppIcon"></app-svg-icons>
  </div>
</template>

<script>
  import {
    habitTpList,
    habitTpSave,
    habitTpRemove
  } from '@/api/habit'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import SysCode from '@/components/SysCode'
  import DySelect from '@/components/DySelect'
  import FormDialog from '@/components/FormDialog'
  import {cacheData} from '@/utils/cache'
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import checkPermission from '@/utils/permission' // 权限判断函数
  import AppSvgIcons from '@/components/AppSvgIcons'


  export default {
    name: 'habitTemplateManager',
    components: {
      Pagination,
      SysCode,
      DySelect,
      FormDialog,
      AppSvgIcons
    },
    directives: {waves, permission},
    filters: {},
    data() {
      return {
        cacheData: {},
        bgPredefineColors: [
          'rgba(216, 216, 216, 1) linear-gradient(180deg, rgba(154, 197, 228, 0.5) 0%, rgba(237, 241, 244, 0.59) 17%, rgba(255, 255, 255, 1) 100%)'
        ],
        predefineColors: [
          'rgba(224, 32, 32, 1 )',
          'rgba(250, 100, 0, 1 )',
          'rgba(247, 181, 0, 1 )',
          'rgba(109, 212, 0, 1 )',
          'rgba(68, 215, 182, 1 )',
          'rgba(50, 197, 255, 1 )',
          'rgba(0, 145, 255, 1 )',
          'rgba(98, 54, 255, 1 )',
          'rgba(109, 114, 120, 1 )',
          'rgba(0, 0, 0, 0.851 )'
        ],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 0,
          pageSize: 10,
          orderBy: '',
          shiroCode: '',
          authorityName: '',
        },
        multipleSelection: [],
        formVisible: false,
        svgFormVisible: false,
        isEdit: false,
        formData: {
          "id": "",
          "background": "",
          "color": "",
          "content": "",
          "icon": "",
          "period": "",
          "remindMsg": "",
          "subTitle": "",
          "title": "",
        },
        rules: {
          title: [
            {
              required: true,
              trigger: 'blur',
              message: '标题必填'
            }
          ],
        }
      }
    },
    computed: {
      habitBackground: {
        get() {
          return this.formData.background
        },
        set(val) {
          if (!val) {
            this.formData.background = `linear-gradient(180deg, ${this.formData.color} 0%, rgba(237, 241, 244, 0.59) 30%, rgba(255, 255, 255, 1) 100%);`
          } else {
            this.formData.background = `linear-gradient(180deg, ${val} 0%, rgba(237, 241, 244, 0.59) 30%, rgba(255, 255, 255, 1) 100%);`
          }
        }
      }
    },
    created() {
    },
    mounted() {
      this.handleFilter();
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
          pageNum: this.listQuery.pageNum,
        }
        habitTpList(query)
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
          habitTpRemove(id).then(response => {
            this.handleQueryList()
          })
        })
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            habitTpSave(this.formData)
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
      openAddIcon() {
        this.svgFormVisible = true;
      },
      closeAppIcon() {
        this.svgFormVisible = false;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .fix-append {
    .el-input-group__append {
      background: transparent;
      border: none;
      padding: 0;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>


  .custom-cell {
    padding: 2px 0px;
  }
</style>
