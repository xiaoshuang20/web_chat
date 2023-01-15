import { request } from './http/axios.js'

export default class UserService {
  static getAllFriends(params) {
    return request('/api/getAllFriends', params, 'GET')
  }
}
