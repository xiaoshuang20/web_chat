import api from './store.js'

export default (app) => {
  // 注册
  app.use('/register', async (req, res) => {
    let reply = await api.register(req.body)
    if (!reply) {
      res.send({
        type: 'fail',
      })
    } else {
      res.send({
        id: reply.objectId,
        type: 'success',
      })
    }
  })

  //登录
  app.use('/login', async (req, res) => {
    let reply = await api.login(req.body)
    if (!reply) {
      res.send('fail')
    } else {
      res.send(reply)
    }
  })
}
