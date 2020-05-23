<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  import {debounce} from '@/utils'
  import chinaMap from "@/utils/chinaMap";

  export default {
    name: "Covid19Chart",
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '650px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.initChart()
      if (this.autoResize) {
        this.__resizeHandler = debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHandler)
      }

      // 监听侧边栏的变化
      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      if (this.autoResize) {
        window.removeEventListener('resize', this.__resizeHandler)
      }

      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

      this.chart.dispose()
      this.chart = null
    },
    methods: {
      sidebarResizeHandler(e) {
        if (e.propertyName === 'width') {
          this.__resizeHandler()
        }
      },
      setOptions(actualData) {
        this.chart.setOption({
          tooltip: {
            trigger: 'item'
          },
          visualMap: {
            type: 'piecewise',
            pieces: [
              {min: 1, max: 9, label: '1-9人', color: 'rgb(255, 247, 171)'},
              {min: 10, max: 99, label: '10-99人', color: 'rgb(253, 187, 63)'},
              {min: 100, max: 499, label: '100-499人', color: 'rgb(233, 112, 42)'},
              {min: 500, max: 999, label: '500-999人', color: 'rgb(192, 72, 51)'},
              {min: 1000, max: 4999, label: '1000-4999人', color: 'rgb(150, 59, 40)'},
              {min: 1000, max: 10000000, label: '5000人以上', color: 'rgb(102, 29, 21)'},
            ],
            bottom: '180px',
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          roamController: {
            show: true,
            left: 'right',
            mapTypeControl: {
              'china': true
            }
          },
          series: [
            {
              name: '确诊数',
              type: 'map',
              mapType: 'china',
              roam: false,
              label: {
                show: true,
                color: 'rgb(63, 63, 63)'
              },
              data: actualData
            }
          ]
        })
      },
      initChart() {
        echarts.registerMap("china", chinaMap);
        this.chart = echarts.init(this.$el)
        this.setOptions(this.chartData)
      }
    }
  }
</script>
