<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <h2>{{$t('views.system.sysMenuManager.message.h1')}}</h2>
        <div class="filter-input">
          <el-input
            :placeholder="$t('views.system.sysMenuManager.message.input_placeholder')"
            v-model="filterText"
          >
          </el-input>
        </div>
        <div>
          <el-tree
            class="filter-tree"
            :highlight-current="true"
            :load="handleQueryList"
            lazy
            :props="defaultProps"
            :filter-node-method="filterNode"
            ref="menuTree"
            @node-contextmenu="openMenu"
            @node-click="handleSelected"
          >
          <span
            class="custom-tree-node"
            slot-scope="{ node, data }"
          >
            <span>
              <svg-icon :icon-class="data.icon ? data.icon : 'menu'"/>&nbsp;{{  node.label }}
            </span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => append(node, data)"
              >
                {{$t('views.system.sysMenuManager.action.append')}}
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                 {{$t('views.system.sysMenuManager.action.remove')}}
              </el-button>
            </span>
          </span>
          </el-tree>
          <ul v-show="menuVisible" :style="{left:left + 'px',top:top + 'px'}" ref="contextmenu" class="contextmenu">
            <li @click="rightAppend(true)" v-show="firstLevel"><i class="el-icon-circle-plus-outline"></i>{{$t('views.system.sysMenuManager.action.add')}}</li>
            <li @click="rightAppend(false)"><i class="el-icon-circle-plus-outline"></i>{{$t('views.system.sysMenuManager.action.addChild')}}</li>
            <li @click="rightRemove"><i class="el-icon-remove-outline"></i>{{$t('views.system.sysMenuManager.action.remove')}}</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="12">
        <h2>{{$t('views.system.sysMenuManager.message.h2')}}</h2>
        <el-row>
          <div class="filter-action">
            <el-button
              class="action-item"
              size="small"
              v-waves
              icon="el-icon-setting"
              @click="bindAuthorities"
              v-permission="['sys:grant:index']"
            >{{$t('table.bind')}}{{ $t('table.authority') }}
            </el-button>
            <el-button
              class="action-item"
              size="small"
              v-waves
              icon="el-icon-plus"
              @click="formOpen"
            > {{$t('views.system.sysMenuManager.action.child')}}
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleEditSave"
            > {{$t('views.system.sysMenuManager.action.update')}}
            </el-button>
          </div>
        </el-row>
        <el-row>
          <el-form
            ref="formEditData"
            :rules="rules"
            :model="formEditData"
            label-width="100px"
          >
            <el-form-item
              :label="$t('views.system.sysMenuManager.formData.parentId')"
              prop="parentId"
            >
              <el-input
                v-model="formEditData.parentId"
                autocomplete="off"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('views.system.sysMenuManager.formData.component')"
              prop="component"
            >
              <el-select style="width:100%" v-model="formEditData.component">
                <el-option
                  v-for="item in menusComponents"
                  :key="item"
                  :label="item"
                  :value="item">
                  <span style="float: left">{{ $t('route.'+item) }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('views.system.sysMenuManager.formData.path')"
              prop="path"
            >
              <el-input
                v-model="formEditData.path"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('views.system.sysMenuManager.formData.hidden')"
              prop="hidden"
            >
              <el-switch
                v-model="formEditData.hidden"
                :active-text="$t('views.commons.codes.yes')"
                :inactive-text="$t('views.commons.codes.no')">
              </el-switch>
            </el-form-item>
            <el-form-item
              :label="$t('views.system.sysMenuManager.formData.meta')"
              prop="meta"
            >
              <el-button
                class="action-item"
                type="text"
                v-waves
                icon="el-icon-edit"
                @click="formOpenParams"
              >{{$t('views.system.sysMenuManager.action.formOpenParams')}}
              </el-button>
            </el-form-item>
            <el-form-item
              :label="$t('table.remark')"
            >
              <el-input
                type="textarea"
                v-model="formEditData.remark"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('table.byOrder')"
              prop="byOrder"
            >
              <el-input
                v-model="formEditData.byOrder"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-row>
      </el-col>
    </el-row>
    <form-dialog
      :visible.sync='formVisible'
      :title="$t('table.add')"
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
          :label="$t('views.system.sysMenuManager.formData.parentId')"
          prop="parentId"
        >
          <el-input
            v-model="formData.parentId"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysMenuManager.formData.component')"
          prop="component"
        >
          <el-select style="width:100%" v-model="formData.component">
            <el-option
              v-for="item in menusComponents"
              :key="item"
              :label="item"
              :value="item">
              <span style="float: left">{{ $t('route.'+item) }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysMenuManager.formData.path')"
          prop="path"
        >
          <el-input
            v-model="formData.path"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('views.system.sysMenuManager.formData.hidden')"
          prop="hidden"
        >
          <el-switch
            v-model="formData.hidden"
            :active-text="$t('views.commons.codes.yes')"
            :inactive-text="$t('views.commons.codes.no')">
          </el-switch>
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
        <el-form-item
          :label="$t('table.byOrder')"
          prop="byOrder"
        >
          <el-input
            v-model="formData.byOrder"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>
    <menu-meta
      v-if="metaReady"
      ref="menuMeta"
      :visible.sync='formVisibleMeta'
      :value.sync='formEditData.meta'
      :title="$t('views.system.sysMenuManager.formData.meta')"
      @onCancel="formCloseParams"
      @onSubmit="handleFormSaveParams"
    >
    </menu-meta>
    <authority-select
      ref="authoritySelect"
      :selected="selectedRole"
      :visible.sync="bindAuthoritiesVisible"
      @onCancel="bindAuthorityCancel"
      @onSubmit="bindAuthoritySubmit"
    ></authority-select>
  </div>
</template>

<script>
  import {menusComponents} from '@/store/constants'
  import {
    sysMenuList,
    sysMenuSave,
    sysMenuRemove,
    sysMenuDetail,
    batchGrantMenuPermissions
  } from '@/api/system'
  import waves from '@/directive/waves' // Waves directive
  import SysCode from '@/components/SysCode'
  import FormDialog from '@/components/FormDialog'
  import MenuMeta from './components/menuMeta'
  import {cacheData} from '@/utils/cache'
  import permission from '@/directive/permission/index.js' // 权限判断指令
  import checkPermission from '@/utils/permission' // 权限判断函数
  import AuthoritySelect from './components/authoritySelect'

  export default {
    name: 'sysMenuManager',
    components: {SysCode, FormDialog, MenuMeta, AuthoritySelect},
    directives: {waves, permission},
    filters: {},
    data() {
      const validatorRequired = (rule, value, callback) => {
        if (!value) {
          callback(new Error(i18n.t(`views.system.sysMenuManager.formData.${rule.field}`) + i18n.t('action.required')))
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
        filterText: '',
        listQuery: {
          orderBy: '',
          component: ''
        },
        formVisible: false,
        formVisibleMeta: false,
        metaReady: false,
        formData: {
          id: null,
          path: "",
          component: "",
          hidden: false,
          meta: "",
          parentId: "",
          redirect: "",
          remark: "",
          byOrder: 0
        },
        formEditData: {
          path: "",
          component: "",
          hidden: false,
          meta: "",
          parentId: "",
          redirect: "",
          remark: "",
          byOrder: 0
        },
        defaultProps: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf',
          disabled: 'disabled'
        },
        menusComponents: menusComponents,
        menuVisible: false,
        firstLevel: false,
        left: 0,
        top: 0,
        currentData: null,
        treeInit: true,
        node: null,
        resolve: null,
        selectedRole: {bindId: '', bindType: 'role'},
        bindAuthoritiesVisible: false,
        rules: {
          component: [
            {
              required: true,
              validator: validatorRequired,
              trigger: 'blur'
            }
          ],
          path: [
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
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val)
      },
      menuVisible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    methods: {
      checkPermission,
      cellStyle() {
        return 'padding: 5px 0px;'
      },
      /***********************Filter search************************* */
      handleFilter() {
        this.node.childNodes = []
        this.handleQueryList(this.node, this.resolve)
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      /***********************Remote query list************************* */
      handleQueryList(node, resolve) {
        if (this.treeInit) {
          this.node = node
          this.resolve = resolve
          this.treeInit = false
        }
        this.listLoading = true
        if (node.level === 0) {
          sysMenuList({parentId: ''})
            .then(data => {
              return resolve(data)
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => {
              this.listLoading = false
            })
        } else {
          sysMenuList({parentId: node.data.id})
            .then(data => {
              return resolve(data)
            })
            .catch(err => {
              console.log(err)
            })
            .finally(() => {
              this.listLoading = false
            })
        }
      },
      append(node, data) {
        // 父节点ID
        let parentId = null
        if (node.parent.data != null || node.parent.data !== undefined) {
          parentId = node.parent.data.id
        }
        this.formOpen({parentId: parentId})
      },

      rightAppend(append) {
        this.formOpen({parentId: append ? null : this.currentNode.id})
      },

      rightRemove() {
        this.$confirm(this.$t('views.commons.confirm.remove_text'), {
          type: 'warning'
        }).then(() => {
          sysMenuRemove(this.currentNode.id).then(response => {
            this.handleFilter()
          })
        })
      },

      remove(node, data) {
        this.$confirm(this.$t('views.commons.confirm.remove_text'), {
          type: 'warning'
        }).then(() => {
          sysMenuRemove(data.id).then(response => {
            this.handleFilter()
          })
        })
      },
      /***********************Table actions************************* */
      // 打开Form表单
      formOpen(row) {
        if (row && !(row instanceof Event)) {
          this.formData = Object.assign({}, row)
        } else {
          if (!this.formEditData.id) {
            this.$message({
              message: this.$t('views.system.sysMenuManager.message.formOpen'),
              type: 'warning',
              duration: 2 * 1000
            })
            return
          }
          this.formData = {
            parentId: this.formEditData.id
          }
        }
        this.formVisible = true
      },
      // 关闭Form表单
      formClose() {
        this.formVisible = false
        this.$refs['formData'].resetFields()
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['formData'].validate(valid => {
          if (valid) {
            sysMenuSave(this.formData)
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
      handleEditSave() {
        this.$refs['formEditData'].validate(valid => {
          if (valid) {
            sysMenuSave(this.formEditData)
              .then(data => {
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
      //处理单项选择
      handleSelected(data) {
        sysMenuDetail(data.id).then(data => {
          Object.assign(this.formEditData, data)
          this.metaReady = true
          this.$nextTick(() => {
            this.updateChildData(this.formEditData.meta)
          })
        })
      },
      openMenu(event, data, node, element) {
        this.menuVisible = true;
        this.currentNode = data;
        this.firstLevel = node.level === 1;
        this.menuVisible = true;
        const offsetLeft = this.$el.getBoundingClientRect().left;
        const offsetTop = this.$el.getBoundingClientRect().top;
        this.left = event.clientX - offsetLeft;
        this.top = event.clientY - offsetTop;
      },
      closeMenu() {
        this.menuVisible = false
      },
      formOpenParams() {
        this.formVisibleMeta = true
      },
      formCloseParams() {
        this.formVisibleMeta = false
      },
      handleFormSaveParams(value) {
        this.formEditData.meta = value
        this.formCloseParams()
      },
      updateChildData(value) {
        this.$refs.menuMeta.$emit('updateData', value)
      },
      bindAuthorities() {
        if (!this.formEditData.id) {
          this.$message({
            message: this.$t('views.system.sysMenuManager.message.bindAuthorities'),
            type: 'warning'
          })
          return;
        }
        this.$refs.authoritySelect.$emit('updateData', {bindType: 'menu', bindId: this.formEditData.id})
        this.bindAuthoritiesVisible = true
      },
      bindAuthorityCancel(event) {
        this.bindAuthoritiesVisible = false
      },
      bindAuthoritySubmit(menuId, multipleSelection, event) {
        if (!multipleSelection) {
          this.bindAuthoritiesVisible = false
          return;
        }
        const authorityIds = multipleSelection.map(v => {
          return v.id
        })
        batchGrantMenuPermissions({
          grantIds: [menuId],
          permissions: authorityIds
        })
          .then(data => {
            this.handleFilter()
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.bindAuthoritiesVisible = false
          })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .filter-input {
    padding: 15px 0;
  }

  .filter-action {
    padding: 15px 0;
    float: right;
  }

  .custom-cell {
    padding: 2px 0;
  }

  .detail-box {
    .detail-info {
      margin-top: 10px;
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }

</style>
