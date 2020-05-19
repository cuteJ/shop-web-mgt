<template>
  <div>
    <el-row>
      <user-chat :visible.sync="chatVisible"></user-chat>
    </el-row>
    <div class="chat-window" @click="openChat">
      <svg-icon icon-class="chat" class-name="chat-icon"/>
    </div>
    <!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
    <!--      <bm-search :selected.sync="selected"></bm-search>-->
    <!--    </el-row>-->
  </div>
</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import BmSearch from '@/components/BmSearch'
  import UserChat from './components/UserChat'
  import {mapGetters} from "vuex";

  export default {
    name: 'DashboardAdmin',
    components: {
      PanelGroup,
      BmSearch,
      UserChat
    },
    data() {
      return {
        selected: {},
        chatVisible: false
      }
    },
    computed: {
      ...mapGetters(['roles'])
    },
    methods: {
      openChat() {
        this.chatVisible = true;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  @import "../../../styles/variables";
  @import "../../../styles/mixins/shadow";

  .chat-window {
    border-radius: 50px;
    padding: 10px;
    right: 40px;
    bottom: 30px;
    cursor: pointer;
    position: fixed;
    background-color: transparent;
    @include shadow-down();

    &:hover {
      .chat-icon {
        color: #67C23A;
        transform: scale(1.1);
      }
    }

    .chat-icon {
      color: #67C23A;
      font-size: 40px;
    }
  }

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
