const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  loginName: state => state.user.loginName,
  userReady: state => state.user.userReady,
  userId: state => state.user.userId,
  menus: state => state.user.menus,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,

  hasNewMsg: state => state.ws.wsData.hasNewMsg,
  isConnected: state => state.ws.socket.isConnected,
  message: state => state.ws.socket.message,
  reconnectError: state => state.ws.socket.reconnectError

}
export default getters
