<template>
  <div class="icon-picker">
    <div class="icon-picker-action" @click="open">
      <svg-icon :icon-class="currentSelected|| 'icon-condition'" class-name="icon-selected"/>
    </div>
    <div class="icon-picker-content" v-show="visible">
      <el-select
        style="width: 100%"
        v-model="currentSelected"
        filterable
        size="small"
        :automatic-dropdown="true"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <el-option
          v-for="(item, index) of iconsMap"
          :key="index"
          :label="item"
          :value="item"
        >
          <svg-icon :icon-class="item" class-name="disabled" style="float: left;margin-top: 8px"/>
          <span style="float: right; font-size: 14px">{{ item }}</span>
        </el-option>
      </el-select>
    </div>
    <el-button type="text" @click="handleCopy($event)" style="margin-left: 4px">复制</el-button>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // Waves directive
  import icons from './requireIcons'
  import clipboard from '@/utils/clipboard'

  export default {
    name: 'IconPicker',
    props: {
      selected: {
        type: String
      }
    },
    directives: {waves},
    data() {
      return {
        iconsMap: icons,
        visible: false
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
      this.$on('updateData', () => {
      })
    },
    methods: {
      open() {
        this.visible = !this.visible;
      },
      handleCopy(event) {
        clipboard(this.currentSelected, event);
      },
      close() {
        this.visible = false;
      },
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

<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-picker {
    display: flex;
    align-items: center;
  }

  .icon-picker-action {
    cursor: pointer;
    width: 28px;
    height: 28px;
    padding: 2px;
    border-radius: 4px;
    border: 1px solid #c8c9cc;
    text-align: center;
  }

  .icon-selected {
    width: 20px;
    height: 20px;
    background-color: white;
  }

  .icon-picker-content {
    margin-left: 4px;
  }
</style>
