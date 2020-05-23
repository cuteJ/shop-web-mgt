import request from '@/utils/request'

export function proxyGeoData(params) {
  return request({
    url: '/api/sys/charts/proxy/geo',
    method: 'get',
    params
  })
}

export function localGeoData(params) {
  return request({
    url: '/api/sys/charts/local/geo',
    method: 'get',
    params
  })
}

export function cacheGeoData(params) {
  return request({
    url: '/api/sys/charts/cache/local/geo',
    method: 'post',
    params
  })
}

// IP地区分布
export function ipDistributed(data) {
  return request({
    url: '/api/sys/charts/ip/dis',
    method: 'post',
    data: data
  })
}

// 用户地区分布
export function randomUserCount(data) {
  return request({
    url: '/api/sys/charts/user/count',
    method: 'post',
    data: data
  })
}

