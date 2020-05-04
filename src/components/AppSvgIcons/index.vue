<template>
  <el-dialog
    :center="true"
    title="图标选择"
    :visible.sync="formVisible"
    @close="handleCancel"
  >
    <div class="icons-container">
      <div class="icons-wrapper">
        <div v-for="item of iconsMap" :key="item" @click="handleClipboard(generateIconCode(item),$event)">
          <el-tooltip placement="top">
            <div slot="content">
              {{ generateIconCode(item) }}
            </div>
            <div class="icon-item">
              <svg class="svg-icon" aria-hidden="true">
                <use :xlink:href="'#icon-'+item"/>
              </svg>
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import icons from './requireIcons'
  import clipboard from '@/utils/clipboard'

  export default {
    name: 'appIcons',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
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
    data() {
      return {
        iconsMap: icons
      }
    },
    methods: {
      generateIconCode(symbol) {
        return symbol
      },
      handleClipboard(text, event) {
        clipboard(text, event)
      },
      handleCancel(event) {
        this.$emit('onCancel', event)
      },
      handleSubmit(event) {
        this.$emit('onSubmit', event)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .icons-container {
    margin: 10px 20px 0;
    overflow: hidden;

    .icons-wrapper {
      margin: 0 auto;
    }

    .icon-item {
      margin: 20px;
      height: 110px;
      text-align: center;
      width: 110px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
    }

    span {
      display: block;
      font-size: 24px;
      margin-top: 10px;
    }

    .disabled {
      pointer-events: none;
    }
  }
</style>
