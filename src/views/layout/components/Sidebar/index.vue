<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#273142"
      text-color="#E0E2E4"
      active-text-color="#177EE6"
      class="el-menu__custom"
    >
      <div class="logo-img">
        <img src="@/assets/logo/logo-w.png">
      </div>
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .logo-img {
    padding: 31px 36px 19px 28px;
    img{
      width: 124px;
      height: 33px;
    }
  }
  .el-menu__custom {
    width: 188px;
  }
</style>
