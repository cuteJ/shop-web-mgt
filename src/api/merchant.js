import request from '@/utils/request'
import {appid} from '@/utils/config'

//运费列表
export function deliveryTemplateList(query) {
    return request({
        url: '/api/mct/delivery/list',
        method: 'post',
        params: query
    })
}

// 运费模版添加
export function deliveryTemplateSave(data) {
    return request({
        url: '/api/mct/delivery/save',
        method: 'post',
        data
    })
}

export function deliveryRemove(id) {
    return request({
        url: `/api/mct/delivery/${id}/remove`,
        method: 'delete'
    })
}

//微信授权
export function wxLogin(merchantNo) {
    return request({
        url: `/api/insecure/mct/${appid}/${merchantNo}/wx_login`,
        method: 'get'
    })
}

//商户列表
export function merchantList(query) {
    return request({
        url: '/api/mct/list',
        method: 'post',
        params: query
    })
}

// 商户添加
export function merchantSave(data) {
    return request({
        url: '/api/mct/save',
        method: 'post',
        data
    })
}

export function merchantRemove(id) {
    return request({
        url: `/api/mct/${id}/remove`,
        method: 'delete'
    })
}

// 商户基本信息
export function merchantBasic(merchantNo) {
    return request({
        url: `/api/mct/basic/${merchantNo}`,
        method: 'get'
    })
}

//商户商户流水信息
export function merchantAccountRecords(query) {
    return request({
        url: '/api/mct/account/records',
        method: 'post',
        params:query
    })
}

// ------------------平台相关-------------------

//平台列表
export function platformList(query) {
    return request({
        url: '/api/mct/platform/list',
        method: 'post',
        params: query
    })
}

// 基本信息
export function platformDetail(platformNo, attr) {
    return request({
        url: `/api/mct/platform/detail/${attr}/${platformNo}`,
        method: 'get'
    })
}

// 商户添加
export function platformSave(data) {
    return request({
        url: '/api/mct/platform/save',
        method: 'post',
        data
    })
}

export function platformRemove(id) {
    return request({
        url: `/api/mct/platform/${id}/remove`,
        method: 'delete'
    })
}

// ----------------客服相关----------------

//微信客服列表
export function kefuList( query) {
    return request({
        url: `/api/wx/kefu/${appid}/list`,
        method: 'post',
        params: query
    })
}

// 微信客服添加
export function kefuSave(data) {
    return request({
        url: `/api/wx/kefu/${appid}/save`,
        method: 'post',
        data
    })
}

// 绑定微信
export function inviteWorker(kfId, data) {
    return request({
        url: `/api/wx/kefu/${appid}/${kfId}/invite`,
        method: 'post',
        data
    })
}

// 客服删除
export function kefuRemove(id) {
    return request({
        url: `/api/wx/kefu/${appid}/remove/${id}`,
        method: 'delete'
    })
}

// 客服头像上传
export function uploadHeadImg(data) {
    return request({
      url: `/api/wx/kefu/${appid}/head/upload`,
      method: 'post',
      timeout:300000,
      data
    })
}

// 同步微信端数据
export function refreshWxKefu(merchantNo) {
    return request({
        url: `/api/wx/kefu/${appid}/${merchantNo}/refresh`,
        method: 'post'
    })
}

//客服列表
export function merchantKefuList(query) {
    return request({
        url: '/api/mct/kefu/list',
        method: 'post',
        params: query
    })
}

export function getKfMerchantRel(id) {
    return request({
        url: `/api/mct/kefu/detail/${id}`,
        method: 'get'
    })
}

// 客服添加
export function merchantKefuSave(data) {
    return request({
        url: '/api/mct/kefu/save',
        method: 'post',
        data
    })
}

// 客服删除
export function merchantKefuRemove(id) {
    return request({
        url: `/api/mct/kefu/remove/${id}`,
        method: 'delete'
    })
}

// 广告
export function merchantAdsList(query) {
    return request({
        url: '/api/mct/ads/list',
        method: 'post',
        params: query
    })
}

// 商户添加
export function merchantAdsSave(data) {
    return request({
        url: '/api/mct/ads/save',
        method: 'post',
        data
    })
}

export function merchantAdsRemove(id) {
    return request({
        url: `/api/mct/ads/${id}/remove`,
        method: 'delete'
    })
}

export function limitAreaList(query) {
    return request({
        url: '/api/mct/limit_area/list',
        method: 'post',
        params: query
    })
}

export function limitAreaSave(data) {
    return request({
        url: '/api/mct/limit_area/save',
        method: 'post',
        data
    })
}

export function refundReasonsList(merchantNo) {
    return request({
        url: `/api/mct/refund_reason/${merchantNo}/list`,
        method: 'post'
    })
}

export function refundReasonSave(data) {
    return request({
        url: '/api/mct/refund_reason/save',
        method: 'post',
        data
    })
}

export function removeRefundReason(id) {
    return request({
        url: `/api/mct/refund_reason/${id}/remove`,
        method: 'delete'
    })
}