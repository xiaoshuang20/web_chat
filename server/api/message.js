import Bmob from 'hydrogen-js-sdk'

// 测试
Bmob.initialize('bc82f997576ffeca', 'xiao')

// 需要参数：双方用户的 name 值

// 创建聊天室（存储聊天记录）
// const pointer = Bmob.Pointer('users')
// const poiID = pointer.set('ilUEJJJK')
// const queryUsersMessage = Bmob.Query('user_message')

// queryUsersMessage.set('users', 'test-xiao')
// queryUsersMessage
//   .save()
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// 发送信息
let message = {
  from: {
    name: 'test',
    avatarUrl: '',
    type: 'user',
    id: 'irJ2AAAU'
  },
  to: {
    name: 'xiao',
    avatarUrl: '',
    type: 'user',
    id: 'ilUEJJJK'
  },
  content: '你好, xiao, 我是测试test',
  type: 'text',
  _id: '1'
}
const queryUsersMessage = Bmob.Query('user_message')
queryUsersMessage.equalTo('users', '==', 'xiao-test')
queryUsersMessage
  .find()
  .then((res) => {
    queryUsersMessage.get(res[0].objectId).then((res) => {
      console.log(res)
      res.add('message', [message])
      res.save()
    })
    // 清空记录
    // queryUsersMessage.get(res[0].objectId).then((res) => {
    //   console.log(res)
    //   res.unset('message')
    //   res.save()
    // })
  })
  .catch((err) => {
    console.log(err)
  })

// 获取聊天信息
// const queryUsersMessage = Bmob.Query('user_message')
// queryUsersMessage.equalTo('users', '==', 'xiao-test')
// queryUsersMessage.find().then((res) => {
//   console.log(res[0].message)
// })

export default (app) => {
  // 获取好友列表
  //   app.use('/getAllFriends', (req, res) => {
  //     let { id } = req.query
  //     // 筛选条件
  //     queryUsers.field('friends', id)
  //     queryUsers.relation('users').then((reply) => {
  //       res.send(reply.results)
  //     })
  //   })
}
