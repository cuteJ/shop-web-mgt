/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const systemRouter = {
  path: '/sys',
  component: Layout,
  name: 'systemManager',
  redirect: 'noredirect',
  meta: {
    title: 'systemManager',
    icon: 'system'
  },
  children: [
    {
      path: 'user_manager',
      component: () => import('@/views/system/sysUserManager'),
      name: 'sysUserManager',
      meta: {title: 'sysUserManager', icon: 'user'},
      menu: 'sys:user:index'
    },
    {
      path: 'role_manager',
      component: () => import('@/views/system/sysRoleManager'),
      name: 'sysRoleManager',
      meta: {title: 'sysRoleManager', icon: 'role'},
      menu: 'sys:role:index'
    },
    {
      path: 'menu_manager',
      component: () => import('@/views/system/sysMenuManager'),
      name: 'sysMenuManager',
      meta: {title: 'sysMenuManager', icon: 'menu'},
      menu: 'sys:menu:index'
    },
    {
      path: 'dic_manager',
      component: () => import('@/views/system/sysDicManager'),
      name: 'sysDicManager',
      meta: {title: 'sysDicManager', icon: 'dictionary'},
      menu: 'sys:user:index'
    },
    {
      path: 'job_manager',
      component: () => import('@/views/system/sysJobManager'),
      name: 'sysJobManager',
      meta: {title: 'sysJobManager', icon: 'dictionary'},
      menu: 'sys:user:index'
    },
    {
      path: 'metadata_manager',
      component: () => import('@/views/system/sysMetadataManager'),
      name: 'sysMetadataManager',
      meta: {title: 'sysMetadataManager', icon: 'dictionary'},
      menu: 'sys:user:index'
    }
  ]
}
export default systemRouter
