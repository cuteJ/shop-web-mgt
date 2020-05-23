<template>
  <div>
    <div class="chart-type-box">
      <div class="chart-type">
        <div class="chart-type-item" :class="{chartTypeActive: chartType === 'covid19Chart'}"
             @click="toCharts('covid19Chart')">
          <svg-icon icon-class="covid-19" class-name="covid-19-icon"/>
          <div class="chart-title">最新疫情</div>
        </div>
        <div class="chart-type-item" :class="{chartTypeActive: chartType === 'userChart'}"
             @click="toCharts('userChart')">
          <svg-icon icon-class="fan" class-name="fan-icon"/>
          <div class="chart-title">用户画像</div>
        </div>
        <div class="chart-type-item" :class="{chartTypeActive: chartType === 'ipChart'}" @click="toCharts('ipChart')">
          <svg-icon icon-class="IP" class-name="IP-icon"/>
          <div class="chart-title">IP分布</div>
        </div>
      </div>
    </div>

    <el-row class="chart-item" v-if="chartType ==='covid19Chart'">
      <div style="text-align: center">
        <h2>全国疫情</h2><span class="desc">截至 {{covidTotal.lastUpdateTime | parseTime('{y}/{m}/{d} {h}:{i}')}}</span>
        <p class="desc">备注：（数据来源于腾讯新闻，仅用于学习）</p>
      </div>
      <div style="width: 500px;margin: auto">
        <div class="covid-summary">
          <div class="covid-item">
            <div class="covid-item-num confirm">
              {{covidTotal.chinaTotal.confirm}}
            </div>
            <div class="covid-item-label">确诊人数</div>
            <div class="covid-item-add chart-desc">
              昨日 <span class="confirm">{{covidTotal.chinaAdd.confirm > 0 ? '+'+covidTotal.chinaAdd.confirm: covidTotal.chinaAdd.confirm}}</span>
            </div>
          </div>
          <div class="covid-item">
            <div class="covid-item-num suspect">
              {{covidTotal.chinaTotal.suspect}}
            </div>
            <div class="covid-item-label">疑似病例</div>
            <div class="covid-item-add chart-desc">
              昨日 <span class="suspect">{{covidTotal.chinaAdd.suspect > 0 ? '+'+covidTotal.chinaAdd.suspect: covidTotal.chinaAdd.suspect}}</span>
            </div>
          </div>
          <div class="covid-item">
            <div class="covid-item-num dead">
              {{covidTotal.chinaTotal.dead}}
            </div>
            <div class="covid-item-label">死亡人数</div>
            <div class="covid-item-add chart-desc">
              昨日 <span class="dead">{{covidTotal.chinaAdd.dead > 0 ? '+'+covidTotal.chinaAdd.dead: covidTotal.chinaAdd.dead}}</span>
            </div>
          </div>
          <div class="covid-item">
            <div class="covid-item-num heal">
              {{covidTotal.chinaTotal.heal}}
            </div>
            <div class="covid-item-label">治愈人数</div>
            <div class="covid-item-add chart-desc">
              昨日 <span class="heal">{{covidTotal.chinaAdd.heal > 0 ? '+'+covidTotal.chinaAdd.heal: covidTotal.chinaAdd.heal}}</span>
            </div>
          </div>
        </div>
      </div>
      <covid19-chart :chart-data="covidChartData"/>
    </el-row>

    <el-row class="chart-item" v-if="chartType ==='userChart'">
      <div style="text-align: center">
        <h2>用户地域分布</h2>
        <p class="desc">系统用户地区分布（数据为随机测试数据）</p>
      </div>
      <el-col :span="12">
        <user-map-chart :chart-data="userData"/>
      </el-col>
      <el-col :span="12">
        <user-pie-chart :chart-data="userPieData"/>
      </el-col>
    </el-row>

    <el-row class="chart-item" v-if="chartType ==='ipChart'">
      <el-col :span="12" style="padding: 20px">
        <div>
          <h2 style="text-align: center"
          >导入IP查看来源分布</h2>
        </div>
        <el-form
          label-width="100px"
        >
          <el-form-item>
            <el-input
              type="textarea"
              placeholder="请输入IP地址，逗号分割"
              v-model="ips"
              rows="10"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              :loading="ipLoading"
              type="primary"
              @click="importIpList"
            >{{ ipLoading? '转换中' : '导入'}}
            </el-button>
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="12">
        <ip-map-chart :chart-data="ipData"/>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import Covid19Chart from './components/Covid19Chart'
  import IpMapChart from './components/IpMapChart'
  import UserPieChart from './components/UserPieChart'
  import UserMapChart from './components/UserMapChart'

  import {ipDistributed, randomUserCount} from '@/api/charts'
  import {covid19ByTx} from '@/api/outerData'
  import CascaderArea from '@/components/CascaderArea'
  import area from '@/utils/area'

  export default {
    name: 'chartsManager',
    components: {
      Covid19Chart,
      IpMapChart,
      UserMapChart,
      UserPieChart,
      CascaderArea
    },
    data() {
      return {
        chartType: 'covid19Chart',
        ipData: [],
        userData: [],
        userPieData: [],
        covidChartData: [],
        ips: '',
        ipLoading: false,
        covidTotal: {
          lastUpdateTime: '',
          "chinaTotal": {
            "confirm": 0,
            "heal": 0,
            "dead": 0,
            "nowConfirm": 0,
            "suspect": 0,
            "nowSevere": 0,
            "importedCase": 0,
            "noInfect": 0
          },
          "chinaAdd": {
            "confirm": 0,
            "heal": 0,
            "dead": 0,
            "nowConfirm": 0,
            "suspect": 0,
            "nowSevere": 0,
            "importedCase": 0,
            "noInfect": 0
          }
        }
      }
    },
    mounted() {
      this.getCovid19Data();
    },
    methods: {
      toCharts(chartType) {
        this.chartType = chartType;
        if (this.chartType === 'covid19Chart') {
          this.getCovid19Data()
        } else if (this.chartType === 'userChart') {
          this.getUserCount();
        } else if (this.chartType === 'ipChart') {
          this.ips = '';
        }
      },
      getUserCount() {
        randomUserCount().then(data => {
          this.userData = data;
          const newData = data.filter(v => v.value > 70);
          const other = data.filter(v => v.value < 70).reduce((pre, v) => {
            return pre | 0 + v.value
          });
          newData.push({name: '其它', value: other});
          this.userPieData = newData;
        });
      },
      getCovid19Data() {
        // 选择数据来源
        return new Promise(((resolve, reject) => {
          covid19ByTx().then(resp => {
            console.log('疫情数据', resp.data);
            let res = resp.data.data || "";
            res = JSON.parse(res);
            if (res) {

              this.covidTotal = {
                lastUpdateTime: res.lastUpdateTime,
                chinaTotal: res.chinaTotal,
                chinaAdd: res.chinaAdd,
              };

              const province = res.areaTree[0].children;
              const municipality = area.municipality;
              this.covidChartData = province.map((item) => {
                if (municipality[item.name]) {
                  return {
                    name: municipality[item.name],
                    value: item.total.confirm
                  }
                }
                return {
                  name: item.name,
                  value: item.total.confirm
                }
              });
              resolve(this.covidChartData)
            }
          })
        }))
      },
      importIpList() {
        if (!this.ips) {
          this.$message({
            type: 'warning',
            message: '请输入IP'
          });

          return;
        }
        const ipList = this.ips.split(',');
        if (ipList.length > 0) {
          console.log(ipList);
          if (ipList.length > 50) {
            this.$message({
              type: 'warning',
              message: '系统仅用于测试学习，请输入低于50条IP'
            });
            return;
          }
          this.ipLoading = true
          ipDistributed(ipList.map(v => {
            return {ip: v}
          })).then(data => {
            this.ipData = data;
          }).finally(() => {
            this.ipLoading = false
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../styles/variables";
  @import "../../styles/mixins/shadow";

  .covid-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .chart-desc {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: $desc-color;
  }

  .covid-item {

    text-align: center;

    .covid-item-num {
      font-size: 28px;
      line-height: 44px;
    }

    .covid-item-label {
      padding: 8px;
      border-radius: 4px;
      background-color: rgba(0, 0, 0, .1);
    }

    .covid-item-add {
      line-height: 36px;
    }

    // 确诊
    .confirm {
      font-weight: 600;
      color: rgba(198, 81, 32, 1);
    }

    // 疑似
    .suspect {
      font-weight: 600;
      color: rgba(240, 145, 17, 1);
    }

    // 治愈
    .heal {
      font-weight: 600;
      color: rgba(65, 176, 181, 1);
    }

    // 死亡
    .dead {
      font-weight: 600;
      color: rgba(13, 35, 55, 1);
    }

  }

  .chartTypeActive {
    background-color: rgba(0, 0, 0, .1);
  }

  .chart-item {
    padding: 20px 20px 0;
    margin-bottom: 32px;
  }

  .chart-type-box {
    background-color: white;
    padding: 20px 150px;
  }

  .chart-type {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .chart-type-item {
    border-radius: 8px;
    padding: 20px;
    cursor: pointer;
    @include shadow-down(3);

    &:hover {
      .covid-19-icon {
        transform: scale(1.1);
      }

      .fan-icon {
        transform: scale(1.1);
      }

      .IP-icon {
        transform: scale(1.1);
      }
    }

    .chart-title {
      color: rgba(0, 0, 0, 0.85);
      display: inline-block;
      vertical-align: middle;
    }

    .covid-19-icon {
      vertical-align: middle;
      font-size: 40px;
    }

    .fan-icon {
      vertical-align: middle;
      font-size: 40px;
    }

    .IP-icon {
      vertical-align: middle;
      font-size: 40px;
    }
  }

</style>
