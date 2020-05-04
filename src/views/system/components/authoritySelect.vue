<template>
  <div>
    <form-dialog
      :visible.sync='authorityVisible'
      :title="$t('views.system.components.authoritySelect.message')"
      :width="'70%'"
      @onCancel="formClose"
      @onSubmit="handleFormSave"
    >
      <el-row>
        <div class="actions-container">
          <el-row>
            <el-col :span="24">
              <el-input placeholder="请输入内容" v-model="searchText"
                        clearable style="width: 100%" class="input-with-select">
                <el-button slot="append" waves icon="el-icon-search" @click="handleFilter"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <el-col :span="12">
          <el-table
            v-loading="listLoading"
            ref="authorityTable"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column
              :label="$t('views.system.components.authoritySelect.formData.shiroCode')"
              align="center"
              width="160"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.shiroCode }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('views.system.components.authoritySelect.formData.authorityName')"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.authorityName }}</span>
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
                  :content="$t('table.move')"
                  placement="top-start"
                >
                  <el-button
                    class="action-item"
                    type="text"
                    v-waves
                    icon="el-icon-right"
                    @click="handleMove(scope.row.id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table
            :data="multipleSelection"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column
              :label="$t('views.system.components.authoritySelect.formData.shiroCode')"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.shiroCode }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('views.system.components.authoritySelect.formData.authorityName')"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.authorityName }}</span>
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
        </el-col>
      </el-row>
    </form-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // Waves directive
  import FormDialog from '@/components/FormDialog'
  import {sysAuthorityList_, getRoleAuthorities, sysMenuAuthorities} from '@/api/system'

  export default {
    name: 'authoritySelect',
    components: {FormDialog},
    props: {
      selected: {
        type: [Object],
        default: {}
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    directives: {waves},
    data() {
      return {
        multipleSelection: [],
        list: [],
        listData: [],
        listLoading: false,
        bindId: '',
        bindType: '',
        searchText: '',
      }
    },
    computed: {
      authorityVisible: {
        get() {
          return this.visible
        },
        set(val) {
          this.$emit('update:visible', val)
        }
      }
    },
    created() {
    },
    mounted() {
      this.handleQueryList();
      this.bindId = this.selected.bindId;
      this.bindType = this.selected.bindType || 'role';
      this.$on('updateData', (data) => {
        this.handleQueryList(data);
      })
    },
    methods: {
      // 关闭Form表单
      formClose(event) {
        this.$emit('onCancel', event)
      },
      // 表单提交处理
      handleFormSave(event) {
        this.$emit('onSubmit', this.bindId, this.multipleSelection, event)
      },
      handleFilter() {
        if (!this.searchText) {
          const data = this.multipleSelection.map(v => v.shiroCode);
          this.list = this.listData.filter(v => !data.includes(v.shiroCode));
          return;
        }
        this.list = this.listData.filter(v => {
          return (this.searchText === v.shiroCode) || (this.searchText === v.authorityName);
        });
      },
      handleQueryList(data) {
        this.listLoading = true
        if (data) {
          this.bindId = data.bindId
          this.bindType = data.bindType
        }
        sysAuthorityList_()
          .then(response => {
            this.listData = response
            if (this.bindId) {
              if (this.bindType === 'role') {
                getRoleAuthorities(this.bindId).then(data => {
                  this.multipleSelection = this.listData.filter(v => data.includes(v.shiroCode))
                  this.list = this.listData.filter(v => !data.includes(v.shiroCode))
                })
              } else if (this.bindType === 'menu') {
                sysMenuAuthorities(this.bindId).then(data => {
                  this.multipleSelection = this.listData.filter(v => data.includes(v.shiroCode))
                  this.list = this.listData.filter(v => !data.includes(v.shiroCode))
                })
              }
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.listLoading = false
          })
      },
      handleRemove(id) {
        const value = this.listData.filter(v => id === v.id)[0];
        if (!this.list.includes(value)) {
          this.list.push(value)
        }
        this.multipleSelection = this.multipleSelection.filter(v => id !== v.id);
      },
      handleMove(id) {
        const value = this.listData.filter(v => id === v.id)[0];
        if (!this.multipleSelection.includes(value)) {
          this.multipleSelection.push(value)
        }
        this.list = this.list.filter(v => id !== v.id);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .d {
    height: 80%;
  }
</style>
