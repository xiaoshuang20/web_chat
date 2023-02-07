import express from 'express'
import { createServer } from 'http'
import io from './io.js'
import './db.js'
import api from './login.js'

const app = express()
const httpServer = createServer(app)
io.attach(httpServer)
// 内容解析并赋值给 res.body
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
api(app)

httpServer.listen(3000, () => {
  console.log('http://127.0.0.1:3000')
})
7
