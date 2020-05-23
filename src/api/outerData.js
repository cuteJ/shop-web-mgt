import axios from 'axios'
import jsonpAdapter from 'axios-jsonp';

//https://geo.datav.aliyun.com/areas_v2/bound/100000.json
const dataService = axios.create({
  timeout: 30000 // 请求超时时间
});

export function geoSearch(params) {
  return dataService({
    url: `https://geo.datav.aliyun.com/areas_v2/bound/${params}.json`,
    method: 'get'
  })
}

// 腾讯新闻疫情接口
export function covid19ByTx() {
  return dataService({
    url: 'https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5',
    adapter: jsonpAdapter,
    // callbackParamName: 'callback',
    method: 'get'
  })
}
