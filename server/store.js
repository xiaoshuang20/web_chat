import Bmob from 'hydrogen-js-sdk'

export default {
  // 获取聊天信息
  async searchHistoryMessage(name) {
    let res = await this.uitl(name)
    if (res.length === 0) {
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
