import Bmob from 'hydrogen-js-sdk'

const user = {
  // 用户登录
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
      queryUsers.set('avatarUrl', '/img/avatar.jpg')
      queryUsers.set('roomID', data.id)
      queryUsers.set('signature', '这里什么也没有哦~')
      let res = await queryUsers.save()
      return res
    } else {
      return false
    }
  },

  // 获取所有好友
  async getAllFriend(id) {
    const queryUsers = Bmob.Query('users')
    // 筛选条件
    queryUsers.field('friends', id)
    let res = await queryUsers.relation('users')
    return res.results
  },

  // 添加好友
  async addFriends(name, user) {
    console.log(name)
    const queryUsers = Bmob.Query('users')
    queryUsers.equalTo('name', '==', name)
    let res = await queryUsers.find()
    if (res.length === 0) return false
    return res[0]
  },
}

const message = {
  async uitl(name) {
    const queryUsersMessage = Bmob.Query('user_message')
    queryUsersMessage.equalTo('users', '==', name)
    let res = await queryUsersMessage.find()
    return res
  },

  // 获取聊天信息
  async getHistoryMessage(name) {
    let res = await this.uitl(name)
    if (res.length === 0) {
      // xiao-test 和 test-xiao 消息记录是一样的
      const arr = name.split('-')
      res = await this.uitl(arr.reverse().join('-'))
    }
    return res[0].message
  },
  // 发送信息
  async sendMessage(name, msg) {
    const queryUsersMessage = Bmob.Query('user_message')
    let res = await this.uitl(name)
    if (res.length === 0) {
      const arr = name.split('-')
      res = await this.uitl(arr.reverse().join('-'))
    }
    let res1 = await queryUsersMessage.get(res[0].objectId)
    res1.add('message', [msg])
    res1.save()
    return true
  },
}

export default {
  ...user,
  ...message,
}
