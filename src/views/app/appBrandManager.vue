<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('views.app.appBrandManager.formData.appNo')"
        v-model="listQuery.appNo"
        style="width: 250px;"
        @keyup.enter.native="handleFilter"
      >
      </el-input>
      <el-input
        :placeholder="$t('views.app.appBrandManager.formData.appName')"
        v-model="listQuery.appName"
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
            v-permission="['app:brand:save']"
          >{{ $t('table.add') }}
          </el-button>
          <el-button
            class="action-item"
            size="small"
            v-waves
            icon="el-icon-edit"
            v-permission="['app:brand:save']"
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
        :label="$t('views.app.appBrandManager.formData.appNo')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.appNo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.app.appBrandManager.formData.appName')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.app.appBrandManager.formData.logo')"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.logo }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('views.app.appBrandManager.formData.appDesc')"
        align="center"
        :show-overflow-tooltip='true'
      >
        <template slot-scope="scope">
          <span>{{ scope.row.appDesc }}</span>
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
              v-permission="['app:brand:save']"
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
              v-permission="['app:brand:remove']"
              @click="handleRemove(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('views.app.appBrandManager.action.setting')"
            placement="top-start"
          >
            <el-button
              class="action-item"
              type="text"
              v-waves
              icon="el-icon-setting"
              v-permission="['app:brand:save']"
              @click="openMaConfig(scope.row)"
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
          :label="$t('views.app.appBrandManager.formData.appNo')"
          prop="appNo"
        >
          <el-input
            v-model="formData.appNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.app.appBrandManager.formData.appName')"
          prop="appName"
        >
          <el-input
            v-model="formData.appName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.app.appBrandManager.formData.appDesc')"
          prop="appDesc"
        >
          <el-input
            type="textarea"
            v-model="formData.appDesc"
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

    <form-dialog
      :visible.sync='formVisibleMaConfig'
      :title="$t('table.add')"
      @onCancel="formCloseMaConfig"
      @onSubmit="handleFormSaveMaConfig"
    >
      <el-form
        ref="formDataMaConfig"
        :rules="rulesMaConfig"
        :model="formDataMaConfig"
        label-width="100px"
      >
        <el-form-item
          :label="$t('views.app.appBrandManager.formDataMaConfig.appNo')"
          prop="appNo"
        >
          <el-input
            :disabled="true"
            v-model="formDataMaConfig.appNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.app.appBrandManager.formDataMaConfig.maType')"
          prop="maType"
        >
          <dy-select
            ref="maTypeDySelect"
            :placeholder="$t('views.app.appBrandManager.formDataMaConfig.maType')"
            :selected.sync="formDataMaConfig.maType"
            :selectType="'MA_TYPE'"
            :params="{disabledList:'h5'}"
          >
          </dy-select>
        </el-form-item>
        <el-form-item
          :label="$t('views.app.appBrandManager.formDataMaConfig.appId')"
          prop="appId"
        >
          <el-input
            v-model="formDataMaConfig.appId"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.app.appBrandManager.formDataMaConfig.secret')"
          prop="secret"
        >
          <el-input
            v-model="formDataMaConfig.secret"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="formDataMaConfig.maType ==='swan'"
          :label="$t('views.app.appBrandManager.formDataMaConfig.appKey')"
          prop="appKey"
        >
          <el-input
            v-model="formDataMaConfig.appKey"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="formDataMaConfig.maType ==='wx'"
          :label="$t('views.app.appBrandManager.formDataMaConfig.aesKey')"
          prop="aesKey"
        >
          <el-input
            v-model="formDataMaConfig.aesKey"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="formDataMaConfig.maType ==='wx'"
          :label="$t('views.app.appBrandManager.formDataMaConfig.token')"
          prop="token"
        >
          <el-input
            v-model="formDataMaConfig.token"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-if="formDataMaConfig.maType ==='wx'"
          :label="$t('views.app.appBrandManager.formDataMaConfig.msgDataFormat')"
          prop="msgDataFormat"
        >
          <el-input
            v-model="formDataMaConfig.msgDataFormat"
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

    <ot-drawer
      :title="$t('views.app.appBrandManager.action.setting')"
      :visible.sync="maConfigVisible"
      :scopeData.sync="maConfigList"
      direction="rtl"
      size="50%"
      ref="maConfigDrawer"
      :before-close="handleMaConfigClose">

      <div class="maConfig">
        <div class="config-actions">
          <el-button
            class="action-item"
            v-waves
            type="primary"
            icon="el-icon-plus"
            v-permission="['app:brand:save']"
            circle
            @click="formOpenMaConfig"
          ></el-button>
        </div>
        <div class="config-body">
          <div class="config-item" v-for="item in maConfigList">
            <div class="config-item-remove">
              <el-button
                type="text"
                v-waves
                icon="el-icon-delete"
                @click.prevent="removeMaConfigItem(item)"
              ></el-button>
            </div>

            <el-form
              label-position="left"
              label-width="100px"
            >
              <el-form-item
                :label="$t('views.app.appBrandManager.formDataMaConfig.appNo')"
                prop="appNo"
              >
                <span class="config-item-text">{{item.appNo}}</span>
              </el-form-item>
              <el-form-item
                :label="$t('views.app.appBrandManager.formDataMaConfig.maType')"
                prop="maType"
              >
                <span class="config-item-text">{{item.maType | statusFilter(cacheData.options['MA_TYPE'])}}</span>
              </el-form-item>
              <el-form-item
                :label="$t('views.app.appBrandManager.formDataMaConfig.appId')"
                prop="appId"
              >
                <span class="config-item-text">{{item.appId}}</span>
              </el-form-item>
              <el-form-item
                :label="$t('views.app.appBrandManager.formDataMaConfig.secret')"
                prop="secret"
              >
                <span class="config-item-text">{{item.secret}}</span>
              </el-form-item>
              <el-form-item
                v-if="item.maType ==='swan'"
                :label="$t('views.app.appBrandManager.formDataMaConfig.appKey')"
                prop="appKey"
              >
                <span class="config-item-text">{{item.maType}}</span>
              </el-form-item>
              <el-form-item
                v-if="item.maType ==='wx'"
                :label="$t('views.app.appBrandManager.formDataMaConfig.aesKey')"
                prop="aesKey"
              >
                <span class="config-item-text">{{item.aesKey}}</span>
              </el-form-item>
              <el-form-item
                v-if="item.maType ==='wx'"
                :label="$t('views.app.appBrandManager.formDataMaConfig.token')"
                prop="token"
              >
                <span class="config-item-text">{{item.token}}</span>
              </el-form-item>
              <el-form-item
                v-if="item.maType ==='wx'"
                :label="$t('views.app.appBrandManager.formDataMaConfig.msgDataFormat')"
                prop="msgDataFormat"
              >
                <span class="config-item-text">{{item.msgDataFormat}}</span>
              </el-form-item>

            </el-form>
          </div>
        </div>
      </div>

    </ot-drawer>

  </div>
</template>

<script>
  import {
    uniqueValue
  } from '@/api/system'
  import {
    appBrandList,
    appBrandMaConfig,
    appBrandSave,
    appBrandRemove,
    maConfigSave,
    appMaConfigRemove
  } from '@/api/appMgt'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import SysCode from '@/components/SysCode'
  import DySelect from '@/components/DySelect'
  import FormDialog from '@/components/FormDialog'
  import OtDrawer from '@/components/OtDrawer'
  import {cacheData, cacheSelectOptionsData} from '@/utils/cache'
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import checkPermission from '@/utils/permission' // 权限判断函数

  export default {
    name: 'appBrandManager',
    components: {
      Pagination,
      SysCode,
      FormDialog,
      DySelect,
      OtDrawer
    },
    directives: {waves, permission},
    filters: {},
    data() {
      const that = this;
      const validatorRequired = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.app.appBrandManager.formData.${rule.field}`) + i18n.t('action.required')))
        } else {
          callback()
        }
      };
      const validatorRequiredConfig = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.app.appBrandManager.formDataMaConfig.${rule.field}`) + i18n.t('action.required')))
        } else {
          callback()
        }
      };
      const validatorUnique = (rule, value, callback) => {
        uniqueValue('APP_NO', {appNo: value, id: that.formData.id}).then(data => {
          if (data && data > 0) {
            callback(new Error(i18n.t(`views.app.appBrandManager.formData.${rule.field}`) + i18n.t('action.unique')))
          } else {
            callback()
          }
        }).catch(err => {
          callback();
        });
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
          appName: '',
          appNo: '',
        },
        multipleSelection: [],
        formVisible: false,
        formVisibleMaConfig: false,
        maConfigVisible: false,
        currentRow: {},
        isEdit: false,
        formData: {
          id: null,
          appName: "",
          appNo: "",
          appDesc: "",
          logo: ""
        },
        formDataMaConfig: {
          aesKey: "",
          aid: "",
          appId: "",
          appKey: "",
          appNo: "",
          maType: "",
          msgDataFormat: "",
          secret: "",
          token: ""
        },
        maConfigList: [],
        rules: {
          appNo: [
            {
              required: true,
              trigger: 'blur',
              validator: validatorRequired
            },
            {
              required: true,
              validator: validatorUnique,
              trigger: 'blur'
            }
          ],
          appName: [
            {
              required: true,
              trigger: 'blur',
              validator: validatorRequired
            }
          ]
        },
        rulesMaConfig: {
          aid: [
            {
              required: true,
              trigger: 'blur',
              validator: validatorRequiredConfig
            }
          ],
          appNo: [
            {
              required: true,
              trigger: 'blur',
              validator: validatorRequiredConfig
            }
          ],
          appId: [
            {
              required: true,
              trigger: 'blur',
              validator: validatorRequiredConfig
            }
          ],
          maType: [
            {
              required: true,
              trigger: 'blur',
              validator: validatorRequiredConfig
            }
          ],
          secret: [
            {
              required: true,
              trigger: 'blur',
              validator: validatorRequiredConfig
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
      });
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
        this.listQuery.pageNum = 0
        this.listQuery.appName = ''
        this.listQuery.appNo = ''
        this.handleQueryList()
      },
      /***********************Remote query list************************* */
      handleQueryList() {
        this.listLoading = true
        let query = {
          pageSize: this.listQuery.pageSize,
          pageNum: this.listQuery.pageNum,
          'params[appName]': this.listQuery.appName,
          'params[appNo]': this.listQuery.appNo
        }
        appBrandList(query)
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
      formOpenMaConfig() {
        this.formDataMaConfig.maType = 'wx';
        this.formVisibleMaConfig = true;
      },
      formCloseMaConfig() {
        this.formVisibleMaConfig = false
        this.$refs['formDataMaConfig'].resetFields()
      },
      openMaConfig(row) {
        this.currentRow = row;
        this.maConfigVisible = true;
        this.formDataMaConfig.aid = row.id;
        this.formDataMaConfig.appNo = row.appNo;
        appBrandMaConfig(row.id).then(data => {
          this.maConfigList = data;
        })
      },
      updateChildData(data) {
        this.$refs.maConfigDrawer.$emit('updateData', data)
      },
      removeMaConfigItem(item) {
        this.$confirm(this.$t('views.commons.confirm.remove_text'), {
          type: 'warning'
        }).then(() => {
          appMaConfigRemove(item.id).then(response => {
            appBrandMaConfig(this.formDataMaConfig.aid).then(data => {
              this.maConfigList = data;
              this.updateChildData(data)
            })
          })
        })
      },
      // 删除处理
      handleRemove(id) {
        this.$confirm(this.$t('views.commons.confirm.remove_text'), {
          type: 'warning'
        }).then(() => {
          appBrandRemove(id).then(response => {
            this.handleQueryList()
          })
        })
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            appBrandSave(this.formData)
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
      handleFormSaveMaConfig() {
        this.$refs['formDataMaConfig'].validate(valid => {
          if (valid) {
            maConfigSave(this.formDataMaConfig)
              .then(data => {
                this.formVisibleMaConfig = false
                appBrandMaConfig(this.formDataMaConfig.aid).then(data => {
                  this.maConfigList = data;
                  this.updateChildData()
                })
              })
              .catch(err => {
                console.log(err)
              })
              .finally(() => {
              })
          }
        })
      },
      handleMaConfigClose() {
        this.maConfigVisible = false;
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

<style>
  .el-drawer__body {
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../styles/variables";
  @import "../../styles/mixins/shadow";

  .maConfig {
    padding: 12px;
  }

  .config-actions {
    text-align: right;
  }

  .config-body {
    margin-top: 10px;
  }

  .config-item-text {
    cursor: pointer;
    color: $light-blue;
  }

  .config-item {
    position: relative;
    margin-top: 10px;
    padding: 20px;
    border-radius: 4px;
    @include shadow-down(3)
  }

  .config-item-remove {
    position: absolute;
    top: 15px;
    right: 10px;
  }

</style>
