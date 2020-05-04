import {getToken, removeToken, setToken} from '@/utils/auth'
// import {getUserInfo, login, logout} from '@/api/login'
import store from '@/store'
import router from '@/router'
import {default as api} from '@/utils/request'

const user = {
  state: {
    loginName: '',
    userId: '',
    avatar: '',
    roles: [],
    menus: [],
    permissions: [],
    userReady: false
  },
  mutations: {
    SET_USER: (state, userInfo) => {
      state.loginName = userInfo.u.username
      state.userId = userInfo.u.userId
      state.avatar = userInfo.u.avatar
      state.roles = userInfo.u.roles
      state.menus = userInfo.u.menuList
      state.permissions = userInfo.u.permissionList
      state.userReady = true
    },
    RESET_USER: state => {
      state.loginName = ''
      state.avatar = ''
      state.userId = ''
      state.role = []
      state.menus = []
      state.permissions = []
      state.userReady = false
    }
  },
  actions: {
    // 登录
    Login({commit, state}, loginForm) {
      return new Promise((resolve, reject) => {
        api({
          url: '/api/login/auth',
          method: 'post',
          data: loginForm
        })
          .then(data => {
            if (data.errorCode === 0) {
              //cookie中保存前端登录状态
              setToken()
            }
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取用户信息
    GetUserInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        api({
          url: '/api/sys/user_info',
          method: 'get'
        })
          .then(data => {
            //储存用户信息
            let userInfo = {u: data.userPermission, status: true}
            commit('SET_USER', userInfo)
            //cookie保存登录状态,仅靠vuex保存的话,页面刷新就会丢失登录状态
            setToken()
            //生成路由
            let userPermission = data.userPermission
            store
              .dispatch('GenerateRoutes', userPermission)
              .then(() => {
                //生成该用户的新路由json操作完毕之后,调用vue-router的动态新增路由方法,将新路由添加
                router.addRoutes(store.getters.addRouters)
              })
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登出
    LogOut({commit}) {
      return new Promise(resolve => {
        api({
          url: '/api/login/logout',
          method: 'post'
        })
          .then(data => {
            commit('RESET_USER')
            removeToken()
            resolve(data)
          })
          .catch(() => {
            commit('RESET_USER')
            removeToken()
          })
      })
    },
    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('RESET_USER')
        removeToken()
        resolve()
      })
    }
  }
}
export default user
