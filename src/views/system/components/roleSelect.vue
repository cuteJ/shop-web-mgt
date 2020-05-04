<template>
  <div>
    <form-dialog
      :visible.sync='roleVisible'
      :title="$t('views.system.components.roleSelect.message')"
      @onCancel="formClose"
      @onSubmit="handleFormSave"
    >
      <el-row>
        <el-checkbox-group style="width:100%;" v-model="currentSelected">
          <el-checkbox border v-for="item in selectOptions"
                       :key="item.value"
                       :disabled="item.disabled"
                       :label="item.value">{{item.label}}
          </el-checkbox>
        </el-checkbox-group>

      </el-row>
      <div class="role-body">
      </div>
    </form-dialog>
  </div>
</template>

<script>
  import FormDialog from '@/components/FormDialog'
  import {selectOptions} from '@/api/system'

  export default {
    name: 'roleSelect',
    components: {FormDialog},
    props: {
      selected: {
        type: [Array]
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        selectOptions: []
      }
    },
    computed: {
      currentSelected: {
        get() {
          return this.selected
        },
        set(val) {
          this.$emit('update:selected', val)
        }
      },
      roleVisible: {
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
      selectOptions('ROLE').then(response => {
        this.selectOptions = response
      })
      this.$on('updateData', () => {
        selectOptions('ROLE').then(response => {
          this.selectOptions = response
        })
      })
    },
    methods: {
      // 关闭Form表单
      formClose(event) {
        this.$emit('onCancel', event)
      },
      // 表单提交处理
      handleFormSave(event) {
        this.$emit('onSubmit', event)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .role-body {
    min-height: 250px;
  }
</style>
