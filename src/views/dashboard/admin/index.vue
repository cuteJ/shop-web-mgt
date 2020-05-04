<template>
<!--  <div class="dashboard-editor-container">-->
<!--     <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
<!--        <line-chart :chart-data="lineChartData" />-->
<!--    </el-row>-->
<!--    <panel-group @handleSetData="handleSetData"/>-->
<!--    <el-row v-if="roles.includes('admin')" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
<!--      <onlie-user></onlie-user>-->
<!--    </el-row>-->

<!--     <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
<!--        <bm-search :selected.sync="selected"></bm-search>-->
<!--    </el-row>-->
<!--  </div>-->
  <div>
  </div>
</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  import OnlieUser from './components/OnlieUser'
  import BmSearch from '@/components/BmSearch'
  import {mapGetters} from "vuex";

  import {test} from '@/api/system'

  const lineChartData = {
    newVisitis: {
      expectedData: [100, 120, 161, 134, 105, 160, 165],
      actualData: [120, 82, 91, 154, 162, 140, 145]
    }
  }

  export default {
    name: 'DashboardAdmin',
    components: {
      PanelGroup,
      LineChart,
      OnlieUser,
      BmSearch
    },
    data() {
      return {
        lineChartData: lineChartData.newVisitis,
        selected: {}
      }
    },
    computed: {
      ...mapGetters(['roles'])
    },
    methods: {
      handleSetData(type) {
        if ('orderConfirm' === type) {
          this.$router.push({
            path: '/order/confirm_order_manager'
          })
        } else if ('orderDeliver' === type) {
          this.$router.push({
            path: '/order/deliver_order_manager'
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
