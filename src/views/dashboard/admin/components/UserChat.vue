<template>
  <div>
    <ot-drawer
      title="聊天"
      :visible.sync="chatVisible"
      direction="rtl"
      :before-close="handleClose">
      <div class="chat-body">
        <div id="msgList" style="margin-bottom: 200px" class="chat-msg">
          <div class="chat-msg-item" v-for="item in msgList">
            <div v-if="!item.self">
              <div class="msg-header">
                <img
                  :src="baseUrl+'/api/insecure/avatar?code='+item.avatar+'&size=64'"
                  class="user-avatar"
                >
                <span class="avatar-name">{{item.username}}</span>&nbsp;&nbsp;
                <div style="display: inline-block; float: right">
                  {{item.createdTime | parseTime('{h}:{i}')}}
                </div>
              </div>
              <div class="msg-body" style="float: left;">
                {{item.msg}}
              </div>
            </div>
            <div v-else>
              <div class="msg-header clearfix">
                <img
                  :src="baseUrl+'/api/insecure/avatar?code='+item.avatar+'&size=64'"
                  class="user-avatar"
                  style="float: right"
                >
              </div>
              <div class="msg-body" style="float: right;background-color: #67C23A">
                {{item.msg}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-send">
        <el-input
          v-model="text"
          autocomplete="off"
          placeholder="请输入你想说的内容..."
          @keyup.enter.native="handleSendMsg"
        ></el-input>
        <div class="chat-btns">

          <el-button
            class="action-item"
            @click="handleClearMsg"
          >清空
          </el-button>
          <el-button
            type="success"
            class="action-item"
            @click="handleSendMsg"
            v-scroll-to="{ el: '#msgList', offset: 140 }"
          >发送
          </el-button>
        </div>
      </div>
    </ot-drawer>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import store from '@/store'
  import {config} from '@/utils/config'
  import OtDrawer from '@/components/OtDrawer'
  import Cookies from 'js-cookie'

  export default {
    name: 'UserChat',
    components: {OtDrawer},
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        baseUrl: config.baseUrl,
        text: '',
        msgList: [],
      }
    },
    computed: {
      ...mapGetters([
        'roles', 'isConnected', 'message', 'reconnectError'
      ]),
      chatVisible: {
        get() {
          return this.visible
        },
        set(val) {
          this.$emit('update:visible', val)
        }
      }
    },
    beforeDestroy() {
      if (this.isConnected) {
        this.$disconnect()
      }
    },
    mounted() {
      console.log('Chat mounted.')
      if (!this.isConnected) {
        this.$connect(config.wsUrl, {
          format: 'json',
          store: store
        })
      }
      // 监听消息接收
      this.$options.sockets.onmessage = (res) => {
        const data = JSON.parse(res.data);
        console.log('收到消息', data);
        if (data.code === 0) {
          // 连接建立成功
          if (!data.data.msg) {
            return;
          }
          this.msgList.push(data.data)
        } else if (data.code === 400) {
          this.$message({
            type: 'warning',
            message: data.data
          })
        }
      };
    },
    methods: {
      handleSendMsg() {
        if (!this.text) {
          this.$message({
            type: 'warning',
            message: '请输入内容'
          });
          return;
        }
        this.$store.dispatch('SendChatMsg', this.text).then(data => {
          this.text = ''
        })
      },
      handleClearMsg() {
        this.msgList = [];
        Cookies.remove('chatMsg');
        // 删除
      },
      // 聊天关闭前
      handleClose() {
        // 缓存消息到本地
        Cookies.set('chatMsg', JSON.stringify(this.msgList));
        this.$emit('update:visible', false)
      }
    },
    created() {
      // 加载缓存数据
      const chatMsg = Cookies.get('chatMsg');
      if (chatMsg) {
        this.msgList = JSON.parse(chatMsg);
      }
    }
  }
</script>

<style>
  .el-drawer__body {
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    background-color: rgba(244, 244, 244, 1);
    scroll-snap-type: y proximity;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

  .user-avatar {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    vertical-align: middle;
  }

  .msg-header {
    font-size: 12px;
    color: rgba(109, 114, 120, 1);
  }

  .avatar-name {
    vertical-align: middle;
  }

  .msg-body {
    text-align: center;
    max-width: 300px;
    min-width: 100px;
    word-wrap: break-word;

    margin: 4px 0;
    padding: 4px;
    line-height: 24px;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 1);
  }

  .chat-body {
    height: 100%;
    position: relative;
  }

  .chat-msg {
    padding: 10px;

    .chat-msg-item {
      margin-top: 10px;
      height: 65px;
    }
  }

  .chat-send {
    padding: 20px;
    background-color: rgba(255, 255, 255, 1);
    position: absolute;
    left: 50%;
    width: 100%;
    transform: translateX(-50%);
    bottom: 0px;
  }

  .chat-btns {
    text-align: center;
  }

  .action-item {
    margin-top: 10px;
  }
</style>
