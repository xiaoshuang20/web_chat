import { request } from './axios.js'

export default class UserService {
  static register(params) {
    return request('/api/register', params, 'POST')
  }

  static login(params) {
    return request('/api/login', params, 'POST')
  }
}
