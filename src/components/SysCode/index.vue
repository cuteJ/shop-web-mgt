<template>
  <el-select
    :style="selectStyle"
    :disabled="disabled"
    :size="size"
    v-if="multi"
    v-model="currentSelected"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    filterable
    multiple
    collapse-tags
    :placeholder="placeholder"
  >

    <el-option
      v-for="item in codes[typeCode]"
      :key="item.valCode"
      :label="item.valName"
      :value="item.valCode"
      :disabled="item.status === '100001'"
    >
    </el-option>
  </el-select>

  <el-select
    :style="selectStyle"
    :size="size"
    v-else
    v-model="currentSelected"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    filterable
    :placeholder="placeholder"
    :disabled="disabled"
  >
    <el-option
      v-for="item in codes[typeCode]"
      :key="item.valCode"
      :label="item.valName"
      :value="item.valCode"
      :disabled="item.status === '100001'"
    >
    </el-option>
  </el-select>

</template>
<script>
  import {getCacheCode} from '@/api/system'

  export default {
    name: 'SysCode',
    components: {},
    data() {
      return {
        codes: {}
      }
    },
    props: {
      multi: {
        type: Boolean,
        default: false
      },
      typeCode: {
        type: String,
        default: '',
        required: true
      },
      size: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      groupCode: {
        type: String
      },
      selected: {
        type: [String, Array]
      },
      cacheOptions: {
        type: [Object]
      },
      placeholder: {
        type: String,
        default: window.i18n.t('components.sysCode.placeholder')
      },
      selectStyle: {
        type: String,
        default: 'width:100%'
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
      if (this.cacheOptions) {
        this.codes = this.cacheOptions
        let obt = {}
        for (let key in this.cacheOptions) {
          if (this.groupCode && data.hasOwnProperty(this.groupCode)) {
            obt[key] = this.cacheOptions[key][this.groupCode]
          } else {
            obt[key] = this.cacheOptions[key].__default__
          }
        }
        this.codes = obt
      } else {
        getCacheCode({typeCode: this.typeCode}).then(data => {
          if (this.groupCode && data.hasOwnProperty(this.groupCode)) {
            obt[key] = this.cacheOptions[key][this.groupCode]
          } else {
            obt[key] = this.cacheOptions[key].__default__
          }
        })
      }
      this.currentSelected = this.selected
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
<style lang="scss" scope>
</style>
