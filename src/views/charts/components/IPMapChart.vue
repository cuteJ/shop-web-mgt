<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'
  import {debounce} from '@/utils'
  import chinaMap from "@/utils/chinaMap";

  export default {
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
        default: '600px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      // https://echarts.apache.org/zh/option.html#visualMap
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
      setOptions(chartData) {
        this.chart.setOption({
          title: {
            text: 'IP来源图',
            textStyle: {
              color: '#fa6400',
            },
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['IP分布']
          },
          backgroundColor: 'rgb(244, 244, 244)',
          visualMap: {
            type: 'continuous',
            min: 0,
            max: 10,
            calculable: true,
            realtime: true,
            bottom: '150px',
            color: ['rgb(77, 193, 207)', 'rgb(244, 255, 255)']
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
              type: 'map',
              name: '访问数',
              mapType: 'china',
              roam: false,
              label: {
                show: true,
                color: 'rgb(109, 114, 120)'
              },
              itemStyle: {
                color: 'rgb(254, 133, 105)',
                borderWidth: 0,
                borderType: 'dashed',
              },
              emphasis: {
                itemStyle: {
                  areaColor: 'rgb(244, 255, 255)',
                  shadowColor: 'rgb(0, 0, 0)',
                  shadowBlur: 10
                }
              },
              data: chartData
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
