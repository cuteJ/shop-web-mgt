import Layout from '@/views/layout/Layout'

const habitRouter = {
    path: '/habit',
    component: Layout,
    name: 'habitTemplateManager',
    redirect: 'noredirect',
    meta: {
        title: 'habitTemplateManager',
        icon: 'system'
    },
    children: [
        {
            path: 'tp_manager',
            component: () => import('@/views/habit/habitTemplateManager'),
            name: 'habitTemplateManager',
            meta: { title: 'habitTemplateManager', icon: 'menu' }
        },
    ]
}
export default habitRouter
