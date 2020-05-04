<template>
  <div>
    <el-input
      :placeholder="currentPlaceholder"
      v-model="currentValue"
      clearable
      class="input-with-select"
      :style="inputStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @clear="handleRestClick"
      @keyup.enter.native="handleSearchClick"
    >
      <el-select
        v-model="queryKey"
        slot="prepend"
        @change="selectChange"
      >
        <el-option
          v-for="item in queryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        slot="append"
        v-waves
        icon="el-icon-search"
        @click="handleSearchClick"
      ></el-button>
    </el-input>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive

export default {
    name: 'FilterInput',
    props: {
        queryOptions: {
            type: Array,
            default() {
                return []
            }
        },
        inputStyle: {
            type: String,
            default: 'width: 420px;'
        }
    },
    directives: { waves },
    data() {
        return {
            queryKey: null,
            currentPlaceholder: '',
            currentValue: ''
        }
    },
    mounted() {
        if (!this.queryOptions) {
            console.error('queryOptions not null')
        }
        let option = this.queryOptions[0]
        this.queryKey = option.value
        this.currentPlaceholder = '请输入' + option.label
    },
    methods: {
        selectChange(event) {
            this.currentPlaceholder =
                '请输入' +
                this.queryOptions.filter(n => this.queryKey == n.value)[0].label
        },
        handleFocus(event) {
            this.$emit('focus', event)
        },
        handleBlur(event) {
            this.$emit('blur', event)
        },
        handleRestClick() {
            this.currentValue = ''
        },
        handleSearchClick() {
            let result = {}
            result[this.queryKey] = this.currentValue
            this.$emit('filterSearch', result)
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
