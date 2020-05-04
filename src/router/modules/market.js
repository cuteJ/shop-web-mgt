import Layout from '@/views/layout/Layout'

const marketRouter = {
    path: '/market',
    component: Layout,
    name: 'marketManager',
    redirect: 'noredirect',
    meta: {
        title: 'marketManager',
        icon: 'merchant'
    },
    children: [
        {
            path: 'coupon_template_manager',
            component: () => import('@/views/market/couponTemplateManager'),
            name: 'couponTemplateManager',
            meta: { title: 'couponTemplateManager', icon: 'merchant' },
            menu: 'mct:manager:index'
        },
        {
            path: 'coupon_manager',
            component: () => import('@/views/market/couponManager'),
            name: 'couponManager',
            meta: { title: 'couponManager', icon: 'merchant' },
            menu: 'mct:manager:index'
        }
    ]
}
export default marketRouter
