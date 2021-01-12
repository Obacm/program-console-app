/**
 * axios 请求和响应拦截、 请求封装
 */

import { baseURL, webURL } from '@/config'
import axios from 'axios'
import store from '@/store'
import { Message } from 'ant-design-vue'

var instance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json;charset=UTF-8'
  },
  baseURL: baseURL,
  timeout: 1000 * 30,
  withCredentials: true // 请求不带 Cookie
})

instance.interceptors.request.use(
  conf => {
    store.commit('SET_SPINNING', true)
    return conf
  },
  error => {
    store.commit('SET_SPINNING', false)
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    // TODO 成功响应后拦截
    store.commit('SET_SPINNING', false)
    return response.data
  },
  error => {
    // TODO 错误响应的拦截
    store.commit('SET_SPINNING', false)

    if (error.message.includes('timeout')) {
      Message.error('请求超时')
      return Promise.reject(error)
    }

    if (error.response.status === 500) {
      window.location.href = webURL + '/login'
    }
  }
)

export default {
  get: (url = '', data = {}) => {
    return instance.get(baseURL + url, {
      params: data
    })
  },
  post: (url = '', data = {}) => {
    return instance.post(baseURL + url, data)
  },
  uploadUrl: baseURL + '/appendix/uploadWechat'
}
