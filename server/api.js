export default (app) => {
  // 注册
  app.use('/register', (req, res) => {
    console.log(req)
  })

  //登录
  app.use('/login', (req, res) => {})
}
