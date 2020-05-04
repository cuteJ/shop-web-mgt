<template>
  <div class="tab-container">
    <el-tabs v-model="tabName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key="item.key" :name="item.key">
        <span slot="label"><i :class="item.icon"></i> {{item.label}}</span>
        <keep-alive>
          <tab-pane v-if="tabName===item.key" :type="item.key"/>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import tabPane from './components/tabPane'

  export default {
    name: "sysUserProfile",
    components: {tabPane},
    data() {
      return {
        tabMapOptions: [
          {
            label: this.$t('views.profile.tabMapOptions.sysUserProfile'),
            key: "sysUserProfile",
            icon: 'el-icon-third-account'
          },
          {
            label: this.$t('views.profile.tabMapOptions.resetPassword'),
            key: "resetPassword",
            icon: 'el-icon-third-password'
          }
        ],
        tabName: "sysUserProfile"
      };
    },
    methods: {}
  };
</script>

<style scoped>
  .tab-container {
    margin: 20px;
  }
</style>
