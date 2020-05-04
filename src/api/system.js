import request from '@/utils/request'


export function test(r) {
  return request({
    url: `/test?r=${r}`,
    method: 'get',
    // responseType: 'blob'
  })
}

export function regionByPid(parentId) {
  return request({
    url: `/api/sys/region/child/${parentId}`,
    method: 'get'
  })
}

export function regionByDepth(depth) {
  return request({
    url: `/api/sys/region/depth/${depth}`,
    method: 'get'
  })
}

// 获取所有地区数据
export function regionAll() {
  return request({
    url: '/api/sys/region/all',
    method: 'get'
  })
}


// 地区列表
export function regionList(query) {
  return request({
    url: '/api/sys/region/list',
    method: 'post',
    params: query
  })
}

// 地区添加
export function regionSave(data) {
  return request({
    url: '/api/sys/region/save',
    method: 'post',
    data
  })
}

// 初始化地区数据
export function initRegion(depth, data) {
  return request({
    url: `/api/sys/region/init/${depth}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data
  })
}

//类别选择
export function selectOptions(selectType, query) {
  return request({
    url: `/api/sys/select/${selectType}`,
    method: 'post',
    params: query
  })
}

export function selectsOptions(selectTypes, query) {
  return request({
    url: `/api/sys/selects/${selectTypes}`,
    method: 'post',
    params: query
  })
}

// 系统用户列表
export function sysUserList(query) {
  return request({
    url: '/api/sys/user/list',
    method: 'post',
    params: query
  })
}

// 系统用户添加
export function sysUserSave(data) {
  return request({
    url: '/api/sys/user/save',
    method: 'post',
    data
  })
}

// 系统用户移除
export function sysUserRemove(id) {
  return request({
    url: `/api/sys/user/remove/${id}`,
    method: 'delete'
  })
}

// 系统用户激活|锁定
export function sysUserStatus(id, active) {
  return request({
    url: `/api/sys/user/status/${id}/${active}`,
    method: 'put'
  })
}

// 系统角色列表
export function sysRoleList(query) {
  return request({
    url: '/api/sys/role/list',
    method: 'post',
    params: query
  })
}

// 系统角色添加
export function sysRoleSave(data) {
  return request({
    url: '/api/sys/role/save',
    method: 'post',
    data
  })
}

// 系统角色移除
export function sysRoleRemove(id) {
  return request({
    url: `/api/sys/role/remove/${id}`,
    method: 'delete'
  })
}

// 系统权限列表
export function sysAuthorityList(query) {
  return request({
    url: '/api/sys/authority/list',
    method: 'post',
    params: query
  })
}

// 系统权限列表
export function sysAuthorityList_(query) {
  return request({
    url: '/api/sys/authority/_list',
    method: 'post',
    params: query
  })
}

// 系统权限列表
export function sysAuthoritySelect(query) {
  return request({
    url: '/api/sys/authority/select',
    method: 'post',
    params: query
  })
}

// 系统角色添加
export function sysAuthoritySave(data) {
  return request({
    url: '/api/sys/authority/save',
    method: 'post',
    data
  })
}

// 系统角色移除
export function sysAuthorityRemove(id) {
  return request({
    url: `/api/sys/authority/remove/${id}`,
    method: 'delete'
  })
}

// API列表
export function sysApiListList(query) {
  return request({
    url: '/api/sys/apiList/list',
    method: 'post',
    params: query
  })
}

// Api添加
export function sysApiListSave(data) {
  return request({
    url: '/api/sys/apiList/save',
    method: 'post',
    data
  })
}

// API移除
export function sysApiListRemove(id) {
  return request({
    url: `/api/sys/apiList/remove/${id}`,
    method: 'delete'
  })
}

// 系统菜单列表
export function sysMenuList(query) {
  return request({
    url: '/api/sys/menu/list',
    method: 'post',
    params: query
  })
}

// 系统菜单树形列表
export function sysMenuTreeList(query) {
  return request({
    url: `/api/sys/menu/tree_list`,
    method: 'post',
    params: query
  })
}

// 系统菜单添加
export function sysMenuSave(data) {
  return request({
    url: '/api/sys/menu/save',
    method: 'post',
    data
  })
}

// 系统菜单移除
export function sysMenuRemove(id) {
  return request({
    url: `/api/sys/menu/remove/${id}`,
    method: 'delete'
  })
}

// 系统菜单移除
export function sysMenuDetail(id) {
  return request({
    url: `/api/sys/menu/detail/${id}`,
    method: 'get'
  })
}

// 获取角色菜单
export function getRoleMenus(roleId) {
  return request({
    url: `/api/sys/role/menu/${roleId}`,
    method: 'get'
  })
}

// 获取角色权限
export function getRoleAuthorities(roleId) {
  return request({
    url: `/api/sys/role/authorities/${roleId}`,
    method: 'get'
  })
}

// 获取菜单权限
export function sysMenuAuthorities(menuId) {
  return request({
    url: `/api/sys/menu/authorities/${menuId}`,
    method: 'get'
  })
}

// 授权用户角色
export function batchGrantUserRoles(data) {
  return request({
    url: '/api/sys/grant/user_roles',
    method: 'post',
    data
  })
}

// 授权角色菜单
export function batchGrantRoleMenus(data) {
  return request({
    url: '/api/sys/grant/role_menu',
    method: 'post',
    data
  })
}

// 授权角色API权限
export function batchGrantRolePermissions(data) {
  return request({
    url: '/api/sys/grant/role_authorities',
    method: 'post',
    data
  })
}

// 授权菜单API权限
export function batchGrantMenuPermissions(data) {
  return request({
    url: '/api/sys/grant/menu_authorities',
    method: 'post',
    data
  })
}

// 获取码值
export function getCacheCode(query) {
  return request({
    url: '/api/sys/code/cache',
    method: 'get',
    params: query
  })
}

// 获取码值
export function getCacheCodes(query) {
  return request({
    url: '/api/sys/code/caches',
    method: 'post',
    params: query
  })
}

// 系统码类列表
export function sysTypeDicList(query) {
  return request({
    url: '/api/sys/code/type/list',
    method: 'post',
    params: query
  })
}

// 系统码类添加
export function sysTypeDicSave(data) {
  return request({
    url: '/api/sys/code/type/save',
    method: 'post',
    data
  })
}

// 系统码类移除
export function sysTypeDicRemove(id) {
  return request({
    url: `/api/sys/code/type/remove/${id}`,
    method: 'delete'
  })
}

// 系统码值列表
export function sysDicList(query) {
  return request({
    url: '/api/sys/code/list',
    method: 'post',
    params: query
  })
}

// 系统码值添加
export function sysDicSave(data) {
  return request({
    url: '/api/sys/code/save',
    method: 'post',
    data
  })
}

// 系统码值移除
export function sysDicRemove(id) {
  return request({
    url: `/api/sys/code/remove/${id}`,
    method: 'delete'
  })
}

// 获取类型下一个序列值
export function getLastTypeDicCode() {
  return request({
    url: '/api/sys/code/type/last_code',
    method: 'get'
  })
}

// 获取下一个序列值
export function getLastDicCode(typeCode) {
  return request({
    url: `/api/sys/code/${typeCode}/last_code`,
    method: 'get'
  })
}

//------------------系统任务API---------------------
// 系统任务列表
export function jobDetailsList(query) {
  return request({
    url: '/api/sys/jobs/details/list',
    method: 'post',
    params: query
  })
}

// 系统任务添加
export function jobDetailsSave(data) {
  return request({
    url: '/api/sys/jobs/details/save',
    method: 'post',
    data
  })
}

// 系统任务移除
export function jobDetailsRemove(id) {
  return request({
    url: `/api/sys/jobs/details/remove/${id}`,
    method: 'delete'
  })
}

// 系统任务列表
export function jobTriggerList(query) {
  return request({
    url: '/api/sys/jobs/trigger/list',
    method: 'post',
    params: query
  })
}

// 系统任务添加
export function jobTriggerSave(data) {
  return request({
    url: '/api/sys/jobs/trigger/save',
    method: 'post',
    data
  })
}

// 系统任务移除
export function jobTriggerRemove(id) {
  return request({
    url: `/api/sys/jobs/trigger/remove/${id}`,
    method: 'delete'
  })
}

export function jobInstanceList(query) {
  return request({
    url: '/api/sys/jobs/instance/list',
    method: 'post',
    params: query
  })
}

export function saveOrUpdateJobInstance(data) {
  return request({
    url: '/api/sys/jobs/instance/save',
    method: 'post',
    data
  })
}

// 任务启动
export function startJobInstance(instanceId) {
  return request({
    url: `/api/sys/jobs/instance/start/${instanceId}`,
    method: 'post'
  })
}

// 任务暂停
export function pauseJobInstance(instanceId) {
  return request({
    url: `/api/sys/jobs/instance/pause/${instanceId}`,
    method: 'post'
  })
}

// 任务删除
export function removeJobInstance(instanceId) {
  return request({
    url: `/api/sys/jobs/instance/remove/${instanceId}`,
    method: 'post'
  })
}

// 实例运行日志
export function jobRunLogList(query) {
  return request({
    url: '/api/sys/jobs/instance/logs/list',
    method: 'post',
    params: query
  })
}

// 实例日志统计
export function jobRunLogStatistics(query) {
  return request({
    url: '/api/sys/jobs/instance/logs/statistics',
    method: 'post',
    params: query
  })
}


//------------------数据字典API---------------------
// 数据字典列表
export function allTableMetadataList(query) {
  return request({
    url: '/api/sys/metadata/table/all_list',
    method: 'post',
    params: query
  })
}

// 数据字典列表
export function tableMetadataList(query) {
  return request({
    url: '/api/sys/metadata/table/list',
    method: 'post',
    params: query
  })
}

export function metadataDetails(id) {
  return request({
    url: `/api/sys/metadata/details/${id}`,
    method: 'get'
  })
}

// 数据字典结构同步
export function tableMetadataSync() {
  return request({
    url: '/api/sys/metadata/sync',
    method: 'post'
  })
}
