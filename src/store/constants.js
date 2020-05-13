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
  sysOptLogManager: () => import('@/views/system/sysOptLogManager'),
  toolsManager: () => import('@/views/tools/toolsManager'),
  appBrandManager: () => import('@/views/app/appBrandManager'),
  userLoginManager: () => import('@/views/user/userLoginManager'),
  blank: () => import('@/views/errorPage/blank')
};

export const menusComponents = [
  'parent',
  'sysUserManager',
  'sysRoleManager',
  'sysJobManager',
  'sysDicManager',
  'sysMenuManager',
  'sysAuthorityManager',
  'sysApiListManager',
  'sysRegionManager',
  'sysMetadataManager',
  'toolsManager',
  'appBrandManager',
  'userLoginManager'
];
