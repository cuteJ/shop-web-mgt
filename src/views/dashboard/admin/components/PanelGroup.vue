<template>
  <el-row
    :gutter="40"
    class="panel-group"
  >
<!--    <el-col-->
<!--      :xs="8"-->
<!--      :sm="8"-->
<!--      :lg="6"-->
<!--      class="card-panel-col"-->
<!--    >-->
<!--      <div-->
<!--        class="card-panel"-->
<!--        @click="handleSetData('onlineUsers')"-->
<!--      >-->
<!--        <div class="card-panel-icon-wrapper icon-people">-->
<!--          <svg-icon-->
<!--            icon-class="peoples"-->
<!--            class-name="card-panel-icon"-->
<!--          />-->
<!--        </div>-->
<!--        <div class="card-panel-description">-->
<!--          <div class="card-panel-text">在线会话</div>-->
<!--          <count-to-->
<!--            :start-val="0"-->
<!--            :end-val="onlineUsers"-->
<!--            :duration="2600"-->
<!--            class="card-panel-num"-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->
<!--    </el-col>-->
    <el-col
      :xs="8"
      :sm="8"
      :lg="6"
      class="card-panel-col"
    >
      <div
        class="card-panel"
        @click="handleSetData('orderConfirm')"
      >
        <div class="card-panel-icon-wrapper icon-message">
          <el-badge
            :hidden="orderConfirm===0"
            :value="orderConfirm"
            class="item"
          >
            <svg-icon
              icon-class="order"
              class-name="card-panel-icon"
            />
          </el-badge>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待确认</div>
          <count-to
            :start-val="0"
            :end-val="orderConfirm"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="8"
      :sm="8"
      :lg="6"
      class="card-panel-col"
    >
      <div
        class="card-panel"
        @click="handleSetData('orderDeliver')"
      >
        <div class="card-panel-icon-wrapper icon-message">
          <el-badge
            :hidden="orderDeliver===0"
            :value="orderDeliver"
            class="item"
          >
            <svg-icon
              icon-class="order_dev"
              class-name="card-panel-icon"
            />
          </el-badge>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待发货</div>
          <count-to
            :start-val="0"
            :end-val="orderDeliver"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { onlineTotal } from '@/api/login'
import CountTo from 'vue-count-to'

export default {
    components: {
        CountTo
    },
    data() {
        return {
            onlineUsers: 0,
            orderConfirm: 0,
            orderDeliver: 0
        }
    },
    created() {
        this.getOnlieTotal()
    },
    methods: {
        handleSetData(type) {
            this.$emit('handleSetData', type)
        },
        getOnlieTotal() {
            // onlineTotal().then(data => (this.onlineUsers = data))
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
    margin-top: 18px;
    .card-panel-col {
        margin-bottom: 32px;
    }
    .card-panel {
        height: 108px;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        overflow: hidden;
        color: #666;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
        border-color: rgba(0, 0, 0, 0.05);
        &:hover {
            .card-panel-icon-wrapper {
                color: #fff;
            }
            .icon-people {
                background: #40c9c6;
            }
            .icon-message {
                background: #36a3f7;
            }
            .icon-money {
                background: #f4516c;
            }
            .icon-shopping {
                background: #34bfa3;
            }
        }
        .icon-people {
            color: #40c9c6;
        }
        .icon-message {
            color: #36a3f7;
        }
        .icon-money {
            color: #f4516c;
        }
        .icon-shopping {
            color: #34bfa3;
        }
        .card-panel-icon-wrapper {
            float: left;
            margin: 14px 0 0 14px;
            padding: 16px;
            transition: all 0.38s ease-out;
            border-radius: 6px;
        }
        .card-panel-icon {
            float: left;
            font-size: 48px;
        }
        .card-panel-description {
            float: right;
            font-weight: bold;
            margin: 26px;
            margin-left: 0px;
            .card-panel-text {
                line-height: 18px;
                color: rgba(0, 0, 0, 0.45);
                font-size: 16px;
                margin-bottom: 12px;
            }
            .card-panel-num {
                font-size: 20px;
            }
        }
    }
}
</style>
