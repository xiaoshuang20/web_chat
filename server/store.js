import Bmob from 'hydrogen-js-sdk'

const user = {
  async login(data) {
    const queryUsers = Bmob.Query('users')
    queryUsers.equalTo('name', '==', data.username)
    queryUsers.equalTo('password', '==', data.password)
    let res = await queryUsers.find()
    if (res.length === 0) {
      return false
    } else {
      return res[0]
    }
  },

  // 用户注册
  async register(data) {
    const queryUsers = Bmob.Query('users')
    queryUsers.equalTo('name', '==', data.username)
    let temp = await queryUsers.find()
    // 用户名保证唯一
    if (temp.length === 0 && !!data.username && !!data.password) {
      queryUsers.set('name', data.username)
      queryUsers.set('password', data.password)
      queryUsers.set('type', 'user')
      let res = await queryUsers.save()
      return res
    } else {
      return false
    }
  },
}

const message = {
  // 获取聊天信息
  async searchHistoryMessage(name) {
    let res = await this.uitl(name)
    if (res.length === 0) {
      // xiao-test 和 test-xiao 消息记录是一样的
      const arr = name.split('-')
      res = await this.uitl(arr.reverse().join('-'))
    }
    return res[0].message
  },

  async uitl(name) {
    const queryUsersMessage = Bmob.Query('user_message')
    queryUsersMessage.equalTo('users', '==', name)
    let res = await queryUsersMessage.find()
    return res
  },
}

export default {
  ...user,
  ...message,
}
