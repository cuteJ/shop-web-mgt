import request from '@/utils/request'

export function habitTpList(query) {
  return request({
    url: '/api/habit/tp/list',
    method: 'post',
    params: query
  })
}

export function habitTpSave(data) {
  return request({
    url: '/api/habit/tp/save',
    method: 'post',
    data
  })
}

export function habitTpRemove(id) {
  return request({
    url: `/api/habit/tp/del/${id}`,
    method: 'post'
  })
}
