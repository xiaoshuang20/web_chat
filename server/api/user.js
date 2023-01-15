import Bmob from 'hydrogen-js-sdk'

const queryUsers = Bmob.Query('users')

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
}
