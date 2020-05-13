import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/third/icon/iconfont.css'
import 'animate.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control
import UUID from 'vue-uuid';
import BaiduMap from 'vue-baidu-map'
import {baiduAk} from '@/utils/config'

import VueLodash from 'vue-lodash'
import random from 'lodash/random'
import map from 'lodash/map'

import * as filters from './filters' // global filters
import watermark from 'watermark-dom' // 水印

watermark.init({
  watermark_txt: "Show me you code.",
  watermark_x: 150,//水印起始位置x轴坐标
  watermark_y: 200,//水印起始位置Y轴坐标
  watermark_rows: 5,//水印行数
  watermark_cols: 6,//水印列数
  watermark_x_space: 100,//水印x轴间隔
  watermark_y_space: 50,//水印y轴间隔
  watermark_font: '微软雅黑',//水印字体
  watermark_color: 'green',//水印字体颜色
  watermark_fontsize: '24px',//水印字体大小
  watermark_alpha: 0.08,//水印透明度，要求设置在大于等于0.003
  watermark_width: 150,//水印宽度
  watermark_height: 100,//水印长度
  watermark_angle: 15,//水印倾斜度数
})

Vue.use(VueLodash, {lodash: {map, random}})

Vue.use(UUID)
Vue.use(BaiduMap, {
  ak: baiduAk
});

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
