import Layout from '@/views/layout/Layout'

const merchantRouter = {
    path: '/delivery',
    component: Layout,
    name: 'deliveryManager',
    redirect: 'noredirect',
    meta: {
        title: 'deliveryManager',
        icon: 'merchant'
    },
    children: [
        {
            path: 'delivery_manager',
            component: () => import('@/views/delivery/deliveryManager'),
            name: 'deliveryManager',
            meta: { title: 'deliveryManager', icon: 'merchant' },
            menu: 'mct:manager:index'
        }
    ]
}
export default merchantRouter
