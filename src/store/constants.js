export const componentsMap = {
  sysUserManager: () => import('@/views/system/sysUserManager'),
  sysRoleManager: () => import('@/views/system/sysRoleManager'),
  sysJobManager: () => import('@/views/system/sysJobManager'),
  sysDicManager: () => import('@/views/system/sysDicManager'),
  sysMenuManager: () => import('@/views/system/sysMenuManager'),
  sysAuthorityManager: () => import('@/views/system/sysAuthorityManager'),
  sysApiListManager: () => import('@/views/system/sysApiListManager'),
  sysRegionManager: () => import('@/views/system/sysRegionManager'),
  sysMetadataManager: () => import('@/views/system/sysMetadataManager'),
  habitTemplateManager: () => import('@/views/habit/habitTemplateManager')
}

export const menusComponents = [
  'sysUserManager',
  'sysRoleManager',
  'sysJobManager',
  'sysDicManager',
  'sysMenuManager',
  'sysAuthorityManager',
  'sysApiListManager',
  'sysRegionManager',
  'sysMetadataManager'
]
