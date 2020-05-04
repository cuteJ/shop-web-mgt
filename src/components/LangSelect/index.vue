<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language"/>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  export default {
    computed: {
      language() {
        return this.$store.getters.language
      },
      activeView() {
        return this.$store.state.tagsView.visitedViews.filter(route => route.path === this.$route.path)[0]
      }
    },
    methods: {
      refreshSelectedTag(view) {
        this.$store.dispatch('delCachedView', view).then(() => {
          const {fullPath} = view
          this.$nextTick(() => {
            this.$router.replace({
              path: '/redirect' + fullPath
            })
          })
        })
      },
      handleSetLanguage(lang) {
        this.$i18n.locale = lang
        document.title = window.i18n.t('index.title')
        this.refreshSelectedTag(this.activeView)
        this.$store.dispatch('setLanguage', lang)
        this.$message({
          message: window.i18n.t('components.langSelect.message'),
          type: 'success'
        })
      }
    }
  }
</script>

<style scoped>
  .international-icon {
    font-size: 20px;
    cursor: pointer;
    vertical-align: -5px !important;
  }
</style>

