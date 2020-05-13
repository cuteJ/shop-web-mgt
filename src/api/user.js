import request from '@/utils/request'

//用户列表
export function userLoginList(query) {
  return request({
    url: '/api/user/login/list',
    method: 'post',
    params: query
  })
}

export function maSessionList(query) {
  return request({
    url: '/api/user/ma_session/list',
    method: 'post',
    params: query
  })
}
