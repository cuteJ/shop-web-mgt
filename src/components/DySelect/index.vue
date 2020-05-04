<template>
  <div>
    <el-select
      :style="selectStyle"
      v-model="currentSelected"
      filterable
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      :disabled="disabled"
    >
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import {selectOptions} from '@/api/system'
  import waves from '@/directive/waves' // Waves directive

  export default {
    name: 'DySelect',
    props: {
      placeholder: {
        type: String,
        default: window.i18n.t('components.dySelect.placeholder')
      },
      disabled: {
        type: Boolean,
        default: false
      },
      selectStyle: {
        type: String,
        default: 'width:100%'
      },
      selectType: {
        type: String
      },
      selected: {
        type: String
      },
      params: {
        type: Object
      }
    },
    directives: {waves},
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
      }
    },
    mounted() {
      selectOptions(this.selectType, this.params).then(response => {
        this.selectOptions = response
      })
      this.$on('updateData', () => {
        selectOptions(this.selectType, this.params).then(response => {
          this.selectOptions = response
        })
      })
    },
    methods: {
      handleFocus(event) {
        this.$emit('focus', event)
      },
      handleBlur(event) {
        this.$emit('blur', event)
      },
      handleChange(val) {
        this.$emit('change', val)
      }
    }
  }
</script>

<style>
  .el-select {
    width: 110px;
  }

  .input-with-select {
    width: 400px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
