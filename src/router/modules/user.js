import Layout from '@/views/layout/Layout'

const userRouter = {
    path: '/user',
    component: Layout,
    name: 'userManager',
    redirect: 'noredirect',
    meta: {
        title: 'userManager',
        icon: 'system'
    },
    children: [
        {
            path: 'user_manager',
            component: () => import('@/views/user/userManager'),
            name: 'userManager',
            meta: { title: 'userManager', icon: 'user' }
        },
        {
            hidden: true,
            path: 'user_detail/:uid',
            component: () => import('@/views/user/userDetail'),
            name: 'userDetail',
            meta: { title: 'userDetail' }
        }
    ]
}
export default userRouter
