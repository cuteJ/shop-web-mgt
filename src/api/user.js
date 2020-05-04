import request from '@/utils/request'

//用户列表
export function userList(query) {
    return request({
        url: '/api/user/list',
        method: 'post',
        params: query
    })
}

// 更新用户信息
export function userSave(data) {
    return request({
        url: '/api/user/save',
        method: 'post',
        data
    })
}

// 用户激活|锁定
export function userStatus(id, active) {
    return request({
        url: `/api/user/status/${id}/${active}`,
        method: 'put'
    })
}

// 用户基本资料
export function userBasic(id) {
    return request({
        url: `/api/user/${id}/detail`,
        method: 'get'
    })
}

//用户登录日志
export function userLoginLog(query) {
    return request({
        url: '/api/user/log/list',
        method: 'post',
        params: query
    })
}

//用户社交绑定
export function userSocial(query) {
    return request({
        url: '/api/user/social/list',
        method: 'post',
        params: query
    })
}

//微信用户详情
export function wxUserDetail(openId) {
    return request({
        url: `/api/wx/user/wx0e90a9ef71e64ff1/${openId}/detail`,
        method: 'get'
    })
}

// 查询模糊用户
export function userCouponList(params) {
    return request({
        url: `/api/user/user_coupon`,
        method: 'get',
        params
    })
}