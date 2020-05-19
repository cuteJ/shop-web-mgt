import request from '@/utils/request'

// 登录
export function login(data) {
    return request({
        url: '/api/login/auth',
        method: 'post',
        data: data
    })
}

// 注销
export function logout() {
    return request({
        url: '/api/login/logout',
        method: 'post'
    })
}

// 获取用户信息
export function getUserInfo() {
    return request({
        url: '/api/sys/user_info',
        method: 'get'
    })
}

// 重置密码
export function resetPassword(data) {
    return request({
        url: '/api/sys/reset_password',
        method: 'post',
        data: data
    })
}

// 系统用户详情
export function getUserDetail() {
    return request({
        url: '/api/sys/user_detail',
        method: 'get'
    })
}

//更新系统用户
export function updateUserDetail(data) {
    return request({
        url: '/api/sys/update/user_detail',
        method: 'post',
        data: data
    })
}

//在线用户总数
export function usersOnline() {
    return request({
        url: '/api/sys/users_online',
        method: 'get'
    })
}

//强制注销用户
export function forceLogout(sessionId) {
    return request({
        url: '/api/sys/force_logout',
        method: 'get',
        params: { id: sessionId }
    })
}

//在线会话总数
export function onlineTotal() {
    return request({
        url: '/api/sys/online_total',
        method: 'get'
    })
}

// 读取该用户下的消息
export function sysUserMessageList(query) {
  return request({
    url: '/api/sys/message/user_list',
    method: 'post',
    params: query
  })
}
