<template>
  <div>
    <el-autocomplete
      :style="inputStyle"
      class="inline-input"
      v-model="currentSelected"
      :fetch-suggestions="querySearchAsync"
      :placeholder="valPlaceholder"
      :trigger-on-focus="triggerOnfocus"
      @select="handleSelect"
      prefix-icon="el-icon-search"
      clearable
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup.native="handleKeyup"
      @keyup.enter.native="handleSearch"
    >
      <template slot-scope="{ item }">
        <span>{{ item.label }}  ({{ item.value }})</span>
      </template>
      <el-button
        slot="append"
        v-waves
        @click="handleSearch"
      >{{$t('table.search')}}
      </el-button>
    </el-autocomplete>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // Waves directive
  import {selectOptions} from '@/api/system'
  import pinyin from 'js-pinyin'
  import _ from 'lodash'

  export default {
    name: 'DyFilterInput',
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      querySearchCb: {
        type: Function,
        default: () => {
          return []
        }
      },
      filterSearch: {
        type: Function,
        default: () => {
        }
      },
      triggerOnfocus: {
        type: Boolean,
        default: false
      },
      selected: {
        type: String
      },
      selectType: {
        type: String
      },
      inputStyle: {
        type: String,
        default: 'width: 100%;'
      }
    },
    directives: {waves},
    data() {
      return {
        history: [],
        indexs: null,
        valPlaceholder: ''
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
      this.valPlaceholder = this.placeholder ? this.placeholder : window.i18n.t('components.dyFilterInput.placeholder')
    },
    methods: {
      handleFocus(event) {
        this.$emit('focus', event)
      },
      handleBlur(event) {
        this.$emit('blur', event)
      },
      handleRestClick() {
        this.currentSelected = ''
      },
      // 防抖动过滤
      handleKeyup: _.debounce(function () {
        this.filterSearch()
      }, 2000),
      handleSearch() {
        this.filterSearch()
      },
      handleSelect(result) {
        this.currentSelected = result.value
        // 添加最新搜索历史到数组
        if (this.indexs) {
          for (let i = 0; i < this.indexs.length; i++) {
            if (this.indexs[i].index === result.index) {
              this.indexs.splice(i, 1)
            }
          }
          this.indexs.unshift(result)
        }
      },
      querySearchAsync(keyword, cb) {
        if (!this.indexs) {
          selectOptions(this.selectType).then(response => {
            this.indexs = response.map(function (item) {
              item.index = pinyin
                .getCamelChars(item.label)
                .toLowerCase()
              return item
            })
            let result = this.indexs
            let results = keyword
              ? result.filter(this.createStateFilter(keyword))
              : result
            cb(results)
          })
        } else {
          let result = this.indexs
          let results = keyword
            ? result.filter(this.createStateFilter(keyword))
            : result
          cb(results)
        }
      },
      createStateFilter(keyword) {
        return state => {
          if (/^[A-Za-z0-9]+$/.test(keyword)) {
            return state.index.indexOf(keyword.toLowerCase()) === 0
          } else {
            return state.label.indexOf(keyword) === 0
          }
        }
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
