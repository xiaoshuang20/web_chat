import Bmob from 'hydrogen-js-sdk'

const queryUsersMessage = Bmob.Query('user_message')

export default (app) => {
  // 获取好友列表
  app.use('/getAllFriends', (req, res) => {
    let { id } = req.query
    // 筛选条件
    queryUsers.field('friends', id)
    queryUsers.relation('users').then((reply) => {
      res.send(reply.results)
    })
  })
  // 添加好友（双向添加）

  //
}

let message = {
  from: {
    name: 'shuang',
    avatarUrl: 'static/img/avatar/20180414165909.jpg',
    ip: '127.0.0.1',
    deviceType: 'pc',
    roomId: 'OEZR3AgBg8mAcghgAAAF',
    type: 'user',
    id: 'OEZR3AgBg8mAcghgAAAF',
    time: 1670316090094
  },
  to: {
    id: 'group_001',
    name: '群聊天室',
    avatarUrl: 'static/img/avatar/group-icon.png',
    type: 'group'
  },
  content: '3',
  type: 'text',
  time: 1670316123494,
  _id: '3lUhGENLpyR5QpkS'
}
