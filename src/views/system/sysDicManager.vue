<template>
  <div class="app-container">
    <h3>
      <svg-icon icon-class="menu"/>
      {{$t('views.system.sysDicManager.action.h1')}}
    </h3>
    <div class="filter-container">
      <el-input
        :placeholder="$t('views.system.sysDicManager.formData.typeCode')"
        v-model="listQuery.typeCode"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
      <el-input
        :placeholder="$t('views.system.sysDicManager.formData.typeName')"
        v-model="listQuery.typeName"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
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
      @row-click="handleRowClick"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysDicManager.formData.typeName')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysDicManager.formData.typeCode')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.typeCode }}</span>
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
          :label="$t('views.system.sysDicManager.formData.typeName')"
          prop="typeName"
        >
          <el-input
            v-model="formData.typeName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysDicManager.formData.typeCode')"
          prop="typeCode"
        >
          <el-input
            v-model="formData.typeCode"
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
          prop="remark"
        >
          <el-input
            v-model="formData.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>

    <div class="filter-container">
      <h3>
        <svg-icon icon-class="menu"/>
        {{$t('views.system.sysDicManager.action.h2')}}
      </h3>
      <el-input
        :placeholder="$t('views.system.sysDicManager.formDataDic.valCode')"
        v-model="listQueryDic.valCode"
        style="width: 250px;"
        class="filter-item"
        @keyup.enter.native="handleFilterDic"
      />
      <el-input
        :placeholder="$t('views.system.sysDicManager.formDataDic.valName')"
        v-model="listQueryDic.valName"
        style="width: 250px;"
        class="filter-item"
        @keyup.enter.native="handleFilterDic"
      />
    </div>
    <div class="actions-container">
      <el-row>
        <el-col :span="20">
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-plus"
            @click="formOpenDic"
          >{{ $t('table.add') }}
          </el-button>
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-edit"
            @click="handleSelectedDic('edit')"
          >{{ $t('table.edit') }}
          </el-button>
        </el-col>
        <el-col :span="4">
          <div class="right-actions">
            <el-button
              class="action-item"
              size="small"
              icon="el-icon-search"
              @click="handleFilterDic"
            >{{ $t('table.query') }}
            </el-button>
            <el-button
              class="action-item"
              size="small"
              icon="el-icon-circle-close"
              @click="handleResetDic"
            >{{ $t('table.reset') }}
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="listLoadingDic"
      :key="tableKeyDic"
      :data="listDic"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChangeDic"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysDicManager.formDataDic.valName')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.valName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.system.sysDicManager.formDataDic.valCode')"
        align="center"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.valCode }}</span>
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
              @click="formOpenDic(scope.row, true)"
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
              @click="handleRemoveDic(scope.row.id)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="totalDic>0"
      :total="totalDic"
      :page.sync="listQueryDic.pageNum"
      :limit.sync="listQueryDic.pageSize"
      @pagination="handleQueryListDic"
    />
    <form-dialog
      :visible.sync='formVisibleDic'
      :title="isEditDic? $t('table.edit'):$t('table.add')"
      @onCancel="formCloseDic"
      @onSubmit="handleFormSaveDic"
    >
      <el-form
        ref="formDataDic"
        :rules="rulesDic"
        :model="formDataDic"
        label-width="100px"
      >
        <el-form-item
          :label="$t('views.system.sysDicManager.formDataDic.typeCode')"
          prop="typeCode"
        >
          <el-input
            v-model="formDataDic.typeCode"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysDicManager.formDataDic.valName')"
          prop="valName"
        >
          <el-input
            v-model="formDataDic.valName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysDicManager.formDataDic.valCode')"
          prop="valCode"
        >
          <el-input
            v-model="formDataDic.valCode"
            autocomplete="off"
          >
            <template slot="prepend">{{formDataDic.typeCode}}</template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('table.status')"
          prop="status"
        >
          <sys-code
            v-if="cacheData.codes"
            :cache-options="cacheData['codes']"
            :type-code="'1000'"
            :selected.sync="formDataDic.status"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.remark')"
          prop="remark"
        >
          <el-input
            type="textarea"
            v-model="formDataDic.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>
  </div>
</template>

<script>
  import {
    sysTypeDicList,
    sysTypeDicSave,
    sysTypeDicRemove,
    sysDicList,
    sysDicSave,
    sysDicRemove,
    getLastTypeDicCode,
    getLastDicCode
  } from '@/api/system'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import SysCode from '@/components/SysCode'
  import FormDialog from '@/components/FormDialog'
  import {cacheData} from '@/utils/cache'

  export default {
    name: 'sysDicManager',
    components: {Pagination, SysCode, FormDialog},
    directives: {waves},
    filters: {},
    data() {
      const validatorRequired = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.system.sysDicManager.formData.${rule.field}`) + i18n.t('action.required')))
        } else {
          callback()
        }
      };
      const validatorRequiredDic = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.system.sysDicManager.formDataDic.${rule.field}`) + i18n.t('action.required')))
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
          orderBy: 'type_code',
          typeCode: '',
          typeName: ''
        },
        multipleSelection: [],
        formVisible: false,
        isEdit: false,
        formData: {
          id: '',
          typeName: '',
          typeCode: '',
          status: '',
          remark: ''
        },
        rules: {
          typeName: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ],
          typeCode: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ]
        },
        currentTypeCode: '',
        tableKeyDic: 1,
        listDic: null,
        totalDic: 0,
        listLoadingDic: false,
        listQueryDic: {
          pageNum: 0,
          pageSize: 10,
          orderBy: 'val_code',
          typeCode: '',
          valCode: ''
        },
        multipleSelectionDic: [],
        formVisibleDic: false,
        isEditDic: false,
        formDataDic: {
          id: '',
          valName: '',
          typeCode: '',
          valCode: '',
          status: '',
          remark: ''
        },
        rulesDic: {
          typeCode: [
            {
              required: true,
              validator: validatorRequiredDic,
              trigger: 'blur'
            }
          ],
          valName: [
            {
              required: true,
              validator: validatorRequiredDic,
              trigger: 'blur'
            }
          ],
          valCode: [
            {
              required: true,
              validator: validatorRequiredDic,
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
        this.listQuery.typeCode = ''
        this.listQuery.typeName = ''
        this.handleQueryList()
      },
      /***********************Remote query list************************* */
      handleQueryList() {
        this.listLoading = true
        let query = {
          pageSize: this.listQuery.pageSize,
          pageNum: this.listQuery.pageNum,
          orderBy: this.listQuery.orderBy,
          'params[typeCode]': this.listQuery.typeCode,
          'params[typeName]': this.listQuery.typeName
        }
        sysTypeDicList(query)
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
          getLastTypeDicCode().then(data => {
            this.formData = {}
            if (data.value) {
              this.formData.typeCode = data.value
            }
          })
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
          sysTypeDicRemove(id).then(response => {
            this.handleQueryList()
            this.handleQueryListDic()
          })
        })
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            sysTypeDicSave(this.formData)
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
        this.formOpen(multipleSelection[0], true)
      },
      // 处理多项选择
      handleMultiSelected(type) {
        let multipleSelection = this.multipleSelection
      },
      handleRowClick(row, event, column) {
        let query = {
          pageNum: 0,
          pageSize: this.listQueryDic.pageSize,
          'params[typeCode]': row.typeCode,
          'params[valCode]': this.listQueryDic.valCode,
          'params[valName]': this.listQueryDic.valName
        }
        this.currentTypeCode = row.typeCode
        this.handleQueryListDic(query)
      },

      //--------------------码值处理--------------------------

      handleFilterDic() {
        this.listQueryDic.pageNum = 1
        this.listQueryDic.typeCode = this.currentTypeCode
        this.handleQueryListDic(this.listQueryDic)
      },
      handleResetDic() {
        this.listQueryDic.pageNum = 1
        this.listQueryDic.typeCode = this.currentTypeCode
        this.listQueryDic.valCode = ''
        this.listQueryDic.valName = ''
        this.handleQueryListDic()
      },
      /***********************Remote query list************************* */
      handleQueryListDic(query) {
        let queryData = {
          pageSize: this.listQueryDic.pageSize,
          pageNum: this.listQueryDic.pageNum,
          orderBy: this.listQueryDic.orderBy,
          'params[typeCode]': this.listQueryDic.typeCode,
          'params[valCode]': this.listQueryDic.valCode,
          'params[valName]': this.listQueryDic.valName
        }
        if (query) {
          queryData = Object.assign(queryData, query)
        }
        this.listLoadingDic = true
        sysDicList(queryData)
          .then(response => {
            this.listDic = response.list
            this.totalDic = response.total
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.listLoadingDic = false
          })
      },
      /***********************Table actions************************* */

      toValCode(valCode) {
        return valCode.substring(4, valCode.length)
      },

      formValCode(typeCode, valCode) {
        return typeCode + valCode
      },

      // 打开Form表单
      formOpenDic(row, isEdit = false) {
        this.isEditDic = isEdit
        this.formVisibleDic = true

        if (isEdit) {
          this.formDataDic = Object.assign({}, row)
          this.formDataDic.valCode = this.toValCode(
            this.formDataDic.valCode
          )
        } else {
          getLastDicCode(this.currentTypeCode).then(data => {
            this.formDataDic = {}
            this.formDataDic.typeCode = this.currentTypeCode
            if (data.value) {
              this.formDataDic.valCode = this.toValCode(data.value)
            }
          })
        }
      },
      // 关闭Form表单
      formCloseDic() {
        this.formVisibleDic = false
        this.$refs['formDataDic'].resetFields()
      },
      // 删除处理
      handleRemoveDic(id) {
        this.$confirm(this.$t('views.commons.confirm.remove_text'), {
          type: 'warning'
        }).then(() => {
          sysDicRemove(id).then(response => {
            this.handleQueryListDic()
          })
        })
      },
      // 表单提交处理
      handleFormSaveDic() {
        this.$refs['formDataDic'].validate(valid => {
          if (valid) {
            this.formDataDic.valCode = this.formValCode(
              this.formDataDic.typeCode,
              this.formDataDic.valCode
            )
            sysDicSave(this.formDataDic)
              .then(data => {
                this.formVisibleDic = false
                this.handleFilterDic()
              })
              .catch(err => {
                console.log(err)
              })
              .finally(() => {
              })
          }
        })
      },
      handleSelectionChangeDic(val) {
        this.multipleSelectionDic = val
      },
      //处理单项选择
      handleSelectedDic(type) {
        let multipleSelection = this.multipleSelectionDic
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
        this.formOpenDic(multipleSelection[0], true)
      },
      // 处理多项选择
      handleMultiSelectedDic(type) {
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-cell {
    padding: 2px 0px;
  }
</style>
