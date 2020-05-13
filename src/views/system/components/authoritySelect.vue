<template>
  <div>
    <form-dialog
      :visible.sync='authorityVisible'
      :title="$t('views.system.components.authoritySelect.message')"
      @onCancel="formClose"
      @onSubmit="handleFormSave"
    >
      <el-row>
        <div class="actions-container">
          <el-row>
            <el-col :span="24">
              <el-input :placeholder="$t('components.dyFilterInput.placeholder')" v-model="searchText"
                        clearable style="width: 100%" class="input-with-select"
                        @keyup.enter.native="handleFilter"
              >
                <el-button slot="append" waves icon="el-icon-search" @click="handleFilter"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </div>
        <el-tree
          :data="listData"
          show-checkbox
          :default-checked-keys="selectedList"
          :default-expanded-keys="selectedList"
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"
          :filter-node-method="filterNode"
        >
        </el-tree>
      </el-row>
    </form-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // Waves directive
  import FormDialog from '@/components/FormDialog'
  import {sysAuthorityList_, sysAuthorityTreeList_, getRoleAuthorities, sysMenuAuthorities} from '@/api/system'

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
        defaultProps: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf',
          disabled: 'disabled'
        },
        searchText: '',
        selectedList: []
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
        const multipleSelection = this.$refs.tree.getCheckedKeys(true);
        this.$emit('onSubmit', this.bindId, multipleSelection, event)
      },
      handleFilter() {
        this.$refs.tree.filter(this.searchText);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1
      },
      handleQueryList(data) {
        this.listLoading = true
        if (data) {
          this.bindId = data.bindId
          this.bindType = data.bindType
        }
        sysAuthorityTreeList_()
          .then(response => {
            this.listData = response
            if (this.bindId) {
              if (this.bindType === 'role') {
                getRoleAuthorities(this.bindId).then(data => {
                  this.$refs.tree.setCheckedKeys(data);
                  this.selectedList = data;
                })
              } else if (this.bindType === 'menu') {
                sysMenuAuthorities(this.bindId).then(data => {
                  this.$refs.tree.setCheckedKeys(data);
                  this.selectedList = data;
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
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .d {
    height: 80%;
  }
</style>
