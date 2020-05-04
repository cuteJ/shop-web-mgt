import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
    // if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
    if (!permissionRoles) return true
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    if (getToken()) {
        // determine if there has token
        /* has token*/
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            if (!store.getters.userReady && store.getters.roles.length === 0) {
                // 判断当前用户是否已拉取完user_info信息
                console.log('用户信息无角色')
                store
                    .dispatch('GetUserInfo')
                    .then(res => {
                        // 拉取user_info
                        next({ ...to, replace: true })
                    })
                    .catch(err => {
                        store.dispatch('FedLogOut').then(() => {
                            Message.error(
                                err || 'Verification failed, please login again'
                            )
                            next({ path: '/' })
                        })
                    })
            } else {
                // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
                if (hasPermission(store.getters.menus, to.meta.menu)) {
                    next()
                } else {
                    next({
                        path: '/401',
                        replace: true,
                        query: { noGoBack: true }
                    })
                }
                // 可删 ↑
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})
