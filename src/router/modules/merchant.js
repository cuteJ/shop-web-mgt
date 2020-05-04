import Layout from '@/views/layout/Layout'

const merchantRouter = {
    path: '/mct',
    component: Layout,
    name: 'merchantManager',
    redirect: 'noredirect',
    meta: {
        title: 'merchantManager',
        icon: 'merchant'
    },
    children: [
        {
            path: 'merchant_manager',
            component: () => import('@/views/merchant/merchantManager'),
            name: 'merchantManager',
            meta: { title: 'merchantManager', icon: 'merchant' },
            menu: 'mct:manager:index'
        },
        {
            hidden: true,
            path: 'merchant_detail/:merchantNo',
            component: () => import('@/views/merchant/merchantDetail'),
            name: 'merchantDetail',
            meta: { title: 'merchantDetail' },
            menu: 'mct:manager:index'
        },
        {
            path: 'platform_manager',
            component: () => import('@/views/merchant/platformManager'),
            name: 'platformManager',
            meta: { title: 'platformManager', icon: 'platform' }
        },
        {
            hidden: true,
            path: 'platform_detail/:platformNo',
            component: () => import('@/views/merchant/platformDetail'),
            name: 'platformDetail',
            meta: { title: 'platformDetail' }
        },
    ]
}
export default merchantRouter
