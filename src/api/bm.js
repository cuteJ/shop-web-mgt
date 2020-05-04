import axios from 'axios'
import {baiduAk} from '@/utils/config'

const baiduService = axios.create({
    baseURL: 'http://api.map.baidu.com', // api 的 base_url
    timeout: 30000 // 请求超时时间
})

/***
 query	检索关键字。行政区划区域检索不支持多关键字检索。如果需要按POI分类进行检索，请将分类通过query参数进行设置，如query=美食	string(45)	天安门、美食	必选
 tag	检索分类偏好，与q组合进行检索，多个分类以","分隔（POI分类），如果需要严格按分类检索，请通过query参数设置
 string(50)	美食	可选
 region	检索行政区划区域（增加区域内数据召回权重，如需严格限制召回数据在区域内，请搭配使用city_limit参数），可输入行政区划名或对应cityCode	string(50)	北京、131	必选
 city_limit	区域数据召回限制，为true时，仅召回region对应区域内数据。	string(50)	true、false	可选
 output	输出格式为json或者xml	string(50)	json或xml	可选
 scope	检索结果详细程度。取值为1 或空，则返回基本信息；取值为2，返回检索POI详细信息	string(50)	1、2	可选

 location	圆形区域检索中心点，不支持多个点	string(50)	38.76623,116.43213 lat<纬度>,lng<经度>

 filter	检索过滤条件。当scope取值为2时，可以设置filter进行排序。
 industry_type：行业类型，注意：设置该字段可提高检索速度和过滤精度，取值有： hotel（宾馆）；cater（餐饮）；life（生活娱乐） sort_name：排序字段，根据industry_type字段的值而定。 1、industry_type为hotel时，sort_name取值有： default（默认）；price（价格）；total_score（好评）；level（星级）；health_score（卫生）；distance（距离排序，只有圆形区域检索有效） 2、industry_type为cater时，sort_name取值有： default（默认）；taste_rating（口味）；price（价格）；overall_rating（好评）；service_rating（服务）；distance（距离排序，只有圆形区域检索有效） 3、industry_type为life时，sort_name取值有： default（默认）；price（价格）；overall_rating（好评）；comment_num（服务）；distance（距离排序，只有圆形区域检索有效）
 sort_rule：排序规则：0（从高到低），1（从低到高）
 price_section：价格区间
 groupon：是否有团购：1（有），0（无）
 discount：是否有打折：1（有），0（无）
 string(50)	sort_name:distance|sort_rule:1	可选
 coord_type	坐标类型，1（wgs84ll即GPS经纬度），2（gcj02ll即国测局经纬度坐标），3（bd09ll即百度经纬度坐标），4（bd09mc即百度米制坐标） 
 page_size	单次召回POI数量，默认为10条记录，最大返回20条。多关键字检索时，返回的记录数为关键字个数*page_size。
 page_num	分页页码，默认为0,0代表第一页，1代表第二页，以此类推。常与page_size搭配使用。
 
 */
// 行政区划区域检索
export function placeSearch(params) {
    let ak = { ak: baiduAk, output: 'json' }
    let query = { ...ak, ...params }
    return baiduService({
        url: '/place/v2/search',
        method: 'get',
        params: query
    })
}
