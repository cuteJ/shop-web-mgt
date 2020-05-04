import request from '@/utils/request'

export function orderCount(menuType) {
    return request({
        url: `/api/order/${menuType}/count`,
        method: 'post'
    })
}

//分类列表
export function orderList(query) {
    return request({
        url: '/api/order/list',
        method: 'post',
        params: query
    })
}

// 添加
export function orderUpdate(data) {
    return request({
        url: '/api/order/save',
        method: 'post',
        data
    })
}

export function orderUpdateStatus(orderId, data) {
    return request({
        url: `/api/order/${orderId}/update_status`,
        method: 'put',
        data
    })
}

// 线下支付
export function orderHandleAll(eventType, data) {
    if('paid' === eventType){
        return orderPaidOffline(data)
    }else if('confirm' === eventType){
        return orderConfirm(data)
    }else if('delivery' === eventType){
        return orderDelivery(data)
    }else if('receipt' === eventType){
        return orderReceipt(data)
    }else {
        throw new Error('无效类型');
    }
}

// 线下支付
export function orderPaidOffline(data) {
    return request({
        url: '/api/order/handle/paid_offline',
        method: 'put',
        data
    })
}

// 订单确认
export function orderConfirm(data) {
    return request({
        url: '/api/order/handle/confirm',
        method: 'put',
        data
    })
}

// 订单已发货
export function orderDelivery(data) {
    return request({
        url: '/api/order/handle/delivery',
        method: 'put',
        data
    })
}

// 订单已签收
export function orderReceipt(data) {
    return request({
        url: '/api/order/handle/receipt',
        method: 'put',
        data
    })
}

// 详情
export function orderDetail(orderId, by) {
    return request({
        url: `/api/order/detail/${by}/${orderId}`,
        method: 'get'
    })
}

export function orderRecords(orderId) {
    return request({
        url: `/api/order/records/${orderId}`,
        method: 'get'
    })
}

export function orderTraces(orderId) {
    return request({
        url: `/api/order/traces/${orderId}`,
        method: 'get'
    })
}

//退款列表
export function orderRefunds(query) {
    return request({
        url: '/api/order/refund/list',
        method: 'post',
        params: query
    })
}

// 退款操作记录
export function orderRefundsRecord(refundId) {
    return request({
        url: `/api/order/refund/record/${refundId}`,
        method: 'get'
    })
}

// 更新退款状态
export function updateRefundStatus(data) {
    return request({
        url: '/api/order/refund/update_status',
        method: 'put',
        data
    })
}

// 确认退款
export function orderConfirmRefund(data) {
    return request({
        url: '/api/order/refund/confirm',
        method: 'put',
        data
    })
}

// 微信订单相关
export function wxPaymentOrderList(query) {
    return request({
        url: '/api/order/wx/list',
        method: 'post',
        params: query
    })
}

export function paymentLogs(orderNo) {
    return request({
        url: `/api/order/wx/payment_logs/${orderNo}`,
        method: 'get'
    })
}

export function refundRequestLogs(orderNo) {
    return request({
        url: `/api/order/wx/refund_logs/${orderNo}`,
        method: 'get'
    })
}

export function syncWxOrder(orderNo, transactionId) {
    return request({
        url: '/api/order/wx/sync_order',
        method: 'put',
        params:{
            orderNo: orderNo,
            transactionId: transactionId
        }
    })
}

export function orderSettleList(query) {
    return request({
        url: '/api/order/settle/list',
        method: 'post',
        params: query
    })
}

export function updateSettle(data) {
    return request({
        url: '/api/order/settle/update',
        method: 'put',
        data
    })
}