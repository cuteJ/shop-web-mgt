import Layout from '@/views/layout/Layout'

const merchantRouter = {
    path: '/goods',
    component: Layout,
    name: 'goodsManager',
    redirect: 'noredirect',
    meta: {
        title: 'goodsManager',
        icon: 'goods'
    },
    children: [
        {
            path: 'category_manager',
            component: () => import('@/views/goods/categoryManager'),
            name: 'categoryManager',
            meta: { title: 'categoryManager', icon: 'category' }
        },
        {
            path: 'goods_manager',
            component: () => import('@/views/goods/goodsManager'),
            name: 'goodsManager',
            meta: { title: 'goodsManager', icon: 'goods' }
        },
        {
            hidden: true,
            path: 'goods_detail/:goodsId',
            component: () => import('@/views/goods/goodsDetail'),
            name: 'goodsDetail',
            meta: { title: 'goodsDetail' }
        }
    ]
}
export default merchantRouter
