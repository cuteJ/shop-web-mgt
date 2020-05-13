import request from '@/utils/request'

export function appBrandList(query) {
  return request({
    url: '/api/app_brand/brand/list',
    method: 'post',
    params: query
  })
}

export function appBrandMaConfig(id) {
  return request({
    url: `/api/app_brand/brand/ma_config/${id}`,
    method: 'get'
  })
}

export function appBrandDetails(id) {
  return request({
    url: `/api/app_brand/brand/details/${id}`,
    method: 'get'
  })
}

export function appBrandSave(data) {
  return request({
    url: '/api/app_brand/brand/save',
    method: 'post',
    data
  })
}

export function appBrandRemove(id) {
  return request({
    url: `/api/app_brand/brand/remove/${id}`,
    method: 'delete'
  })
}

export function appMaConfigRemove(id) {
  return request({
    url: `/api/app_brand/ma_config/remove/${id}`,
    method: 'delete'
  })
}

export function maConfigSave(data) {
  return request({
    url: '/api/app_brand/ma_config/save',
    method: 'post',
    data
  })
}
