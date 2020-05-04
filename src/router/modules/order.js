import Layout from '@/views/layout/Layout'

const merchantRouter = {
    path: '/order',
    component: Layout,
    name: 'orderManager',
    redirect: 'noredirect',
    meta: {
        title: 'orderManager',
        icon: 'order'
    },
    children: [
        {
            path: 'confirm_order_manager',
            component: () => import('@/views/order/confirmOrderManager'),
            name: 'confirmOrderManager',
            meta: { title: 'confirmOrderManager', icon: 'order' }
        },
        {
            path: 'deliver_order_manager',
            component: () => import('@/views/order/deliverOrderManager'),
            name: 'deliverOrderManager',
            meta: { title: 'deliverOrderManager', icon: 'order' }
        },
        {
            path: 'refund_order_manager',
            component: () => import('@/views/order/refundOrderManager'),
            name: 'refundOrderManager',
            meta: { title: 'refundOrderManager', icon: 'order' }
        },
        {
            path: 'order_manager',
            component: () => import('@/views/order/orderManager'),
            name: 'orderManager',
            meta: { title: 'allOrderManager', icon: 'order' }
        },
        {
            path: 'wx_order_manager',
            component: () => import('@/views/order/wxOrderManager'),
            name: 'wxOrderManager',
            meta: { title: 'wxOrderManager', icon: 'order' }
        },
        {
            hidden: true,
            path: 'order_detail/:by/:orderId',
            component: () => import('@/views/order/orderDetail'),
            name: 'orderDetail',
            meta: { title: 'orderDetail' }
        },
        {
            path: 'settle_order_manager',
            component: () => import('@/views/order/settleOrderManager'),
            name: 'settleOrderManager',
            meta: { title: 'settleOrderManager', icon: 'order' }
        }
    ]
}
export default merchantRouter
