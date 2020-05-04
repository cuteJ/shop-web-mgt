import request from '@/utils/request'

export function couponTemplateList(query) {
    return request({
        url: '/api/coupon/template/list',
        method: 'post',
        params: query
    })
}

export function couponList(query) {
    return request({
        url: '/api/coupon/list',
        method: 'post',
        params: query
    })
}

export function couponTemplateSave(data) {
    return request({
        url: '/api/coupon/template/save',
        method: 'post',
        data
    })
}

export function couponPublish(templateId) {
    return request({
        url: `/api/coupon/publish/${templateId}`,
        method: 'put'
    })
}

export function offerCouponToUser(couponId, uid) {
    return request({
        url: `/api/coupon/offer/${couponId}/${uid}`,
        method: 'put'
    })
}

export function offerCouponToUsers( data) {
    return request({
        url: `/api/coupon/offer_template`,
        method: 'put',
        data
    })
}
