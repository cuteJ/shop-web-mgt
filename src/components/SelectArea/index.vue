<template>
  <div>
    <el-select
      v-if="multi"
      :style="selectStyle"
      v-model="currentSelected"
      filterable
      @focus="handleFocus"
      @blur="handleBlur"
      :placeholder="placeholder"
      :disabled="disabled"
      multiple
    >
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      v-else
      :style="selectStyle"
      v-model="currentSelected"
      filterable
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
  import {regionByDepth} from '@/api/system'
  import waves from '@/directive/waves' // Waves directive

  export default {
    name: 'SelectArea',
    props: {
      placeholder: {
        type: String,
        default: '请选择'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      multi: {
        type: Boolean,
        default: false
      },
      selectStyle: {
        type: String,
        default: 'width:100%'
      },
      selectType: {
        type: Number,
        default: 1
      },
      selected: {
        type: [String, Array]
      },
    },
    directives: {waves},
    data() {
      return {
        selectOptions: [],
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
      regionByDepth(this.selectType).then(response => {
        this.selectOptions = response
      })
    },
    methods: {
      handleFocus(event) {
        this.$emit('focus', event)
      },
      handleBlur(event) {
        this.$emit('blur', event)
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
