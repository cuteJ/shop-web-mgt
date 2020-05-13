import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 30000, // 请求超时时间
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (store.getters.language) {
      config.params = {
        lang: store.getters.language,
        ...config.params
      }
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * 存在 errorCode 且 不为0 抛错
     */
    const res = response.data
    if (Object.prototype.hasOwnProperty.call(res, 'errorCode') && res.errorCode === 0) {
      Message({
        message: window.i18n.t('utils.request.opt_success'),
        type: 'success',
        duration: 5 * 1000
      })
      return response.data
    } else if (Object.prototype.hasOwnProperty.call(res, 'errorCode') && res.errorCode !== 0) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      if (res.errorCode === 401) {
        MessageBox.confirm(
          window.i18n.t('utils.request.logout_confirm_text'),
          window.i18n.t('utils.request.logout_confirm_title'),
          {
            confirmButtonText: window.i18n.t('utils.request.logout_confirm_btn'),
            cancelButtonText: window.i18n.t('utils.request.logout_confirm_cancel'),
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
