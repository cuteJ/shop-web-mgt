<template>
  <div class="tab-container">
    <el-dialog
      :center="true"
      :title="$t('views.system.components.menuMeta.message')"
      :top="top"
      :width="width"
      :visible.sync="formVisible"
      @close="handleCancel"
    >
      <el-row>
        <el-col :span="20">
          <div class="dynamic-action">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('table.add')"
              placement="top-start"
            >
              <el-button
                size="small"
                v-waves
                type="primary"
                icon="el-icon-plus"
                @click="addItem"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('table.reset')"
              placement="top-start"
            >
              <el-button
                size="small"
                icon="el-icon-close"
                v-waves
                @click="resetForm"
                circle
              ></el-button>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <el-form
        :model="dynamicDataForm"
        ref="dynamicDataForm"
        label-width="100px"
        class="dynamic-form"
      >
        <el-form-item
          v-for="(item, index) in dynamicDataForm.params"
          :label="item.label"
          :key="index"
          :prop="'params.' + index + '.value'"
          :rules="{required: true, message: `${item.label}${required}`, trigger: 'blur'}"
        >
          <el-input v-model="item.value"></el-input>
          <el-button
            type="text"
            v-waves
            icon="el-icon-delete"
            @click.prevent="removeItem(item)"
          ></el-button>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div>
          <el-button
            waves
            type="primary"
            @click="handleFormSave"
          >{{ $t('table.confirm') }}
          </el-button>
          <el-button @click="handleCancel">{{ $t('table.cancel') }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // Waves directive

  const defaultParamsMap = {
    '1': [
      {
        label: 'title',
        value: ''
      },
      {
        label: 'icon',
        value: ''
      }
    ]
  }
  export default {
    name: 'menuMeta',
    directives: {waves},
    props: {
      value: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '50%'
      },
      top: {
        type: String,
        default: '15vh'
      }
    },
    filters: {},
    data() {
      return {
        cacheData: {},
        dynamicDataForm: {
          params: []
        },
        required: window.i18n.t('action.required'),
        rules: {}
      }
    },
    computed: {
      formVisible: {
        get() {
          return this.visible
        },
        set(val) {
          this.$emit('update:visible', val)
        }
      }
    },
    mounted() {
      this.initFormItem(this.value)
      this.$on('updateData', (value) => {
        this.initFormItem(value)
      })
    },
    methods: {
      resetForm() {
        this.$refs['dynamicDataForm'].resetFields()
      },
      initFormItem(value) {
        if (value) {
          const values = JSON.parse(value)
          const params = []
          for (let p in values) {
            params.push({
              label: p,
              value: values[p]
            })
          }
          this.dynamicDataForm.params = params
        } else {
          this.dynamicDataForm.params = defaultParamsMap['1']
        }
      },
      removeItem(item) {
        let index = this.dynamicDataForm.params.indexOf(item)
        if (index !== -1) {
          this.dynamicDataForm.params.splice(index, 1)
        }
      },
      addItem() {
        this.$prompt(this.$t('views.system.components.menuMeta.addItem.title'), {
          inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,10}$/,
          inputErrorMessage: this.$t('views.system.components.menuMeta.addItem.inputErrorMessage')
        }).then(({value}) => {
          if (
            this.dynamicDataForm.params &&
            this.dynamicDataForm.params.length > 0 &&
            this.dynamicDataForm.params.some(v => v.label === value)
          ) {
            this.$message({
              type: 'warning',
              message: this.$t('views.system.components.menuMeta.addItem.dkError')
            })
            return
          }
          this.dynamicDataForm.params.push({
            value: '',
            label: value
          })
        })
      },
      handleCancel(event) {
        this.$emit('onCancel', event)
      },
      // 表单提交处理
      handleFormSave() {
        this.$refs['dynamicDataForm'].validate(valid => {
          if (valid) {
            let values = {}
            this.dynamicDataForm.params.forEach(v => {
              values[v.label] = v.value
            })
            this.$emit('onSubmit', JSON.stringify(values))
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tab-container {
    position: relative;
    padding: 40px 30px;
  }

  .el-input {
    width: 80%;
  }

  .dynamic-action {
    float: right;
    margin-bottom: 20px;
  }
</style>
