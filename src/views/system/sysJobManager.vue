<template>
  <div class="app-container tab-container">
    <el-tabs
      v-model="tabName"
      type="card"
    >
      <el-tab-pane
        v-for="item in tabMapOptions"
        :label="item.label"
        :key="item.key"
        :name="item.key"
      >
        <span slot="label"><i :class="item.icon"></i> {{item.label}}</span>
        <keep-alive>
          <tab-pane
            v-if="tabName===item.key"
            :type="item.key"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import tabPane from './components/jobTabPane'

  export default {
    name: 'sysJobManager',
    components: {tabPane},
    data() {
      return {
        tabMapOptions: [
          {
            label: this.$t('views.system.sysJobManager.tabMapOptions.jobDetailsManager'),
            key: 'jobDetailsManager',
            icon: 'el-icon-third-renwujincheng'
          },
          {
            label: this.$t('views.system.sysJobManager.tabMapOptions.jobTriggerManager'),
            key: 'jobTriggerManager',
            icon: 'el-icon-third-shijian'
          },
          {
            label: this.$t('views.system.sysJobManager.tabMapOptions.jobInstanceManager'),
            key: 'jobInstanceManager',
            icon: 'el-icon-third-data'
          }
        ],
        tabName: 'jobDetailsManager'
      }
    },
    methods: {}
  }
</script>

<style scoped>
  .tab-container {
    /*margin: 20px;*/
  }
</style>
