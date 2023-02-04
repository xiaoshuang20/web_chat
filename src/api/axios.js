import axios from 'axios'
import { ElMessage } from 'element-plus' // 引入el 提示框

// 设置接口超时时间
axios.defaults.timeout = 20000
// 请求拦截
axios.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
// 响应拦截
axios.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    const { response } = err
    if (response) {
      return Promise.reject(response.status)
    } else {
      ElMessage.warning('网络连接异常,请稍后再试!')
    }
  }
)

// 封装 GET POST 请求并导出
export function request(url = '', params = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    switch (type) {
      case 'GET':
        promise = axios.get(url, { params })
        break
      case 'POST':
        promise = axios.post(url, params)
        break
      case 'DELETE':
        promise = axios.delete(url, params)
        break
      case 'PUT':
        promise = axios.put(url, params)
        break
      default:
        throw Error
    }
    //处理返回
    promise
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
