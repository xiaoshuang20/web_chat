import Bmob from 'hydrogen-js-sdk'

export default {
  // 获取聊天信息
  async searchHistoryMessage(name) {
    const queryUsersMessage = Bmob.Query('user_message')
    queryUsersMessage.equalTo('users', '==', name)
    let res = await queryUsersMessage.find()
    return res[0].message
  }
}
