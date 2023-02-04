export default (app) => {
  // 注册
  app.use('/register', (req, res) => {
    console.log(req.body)
    res.send('success')
  })

  //登录
  app.use('/login', (req, res) => {})
}
