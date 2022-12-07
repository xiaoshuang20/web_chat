import express from 'express'
import { createServer } from 'http'
import io from './io.js'

const app = express()
const httpServer = createServer(app)
io.attach(httpServer)

httpServer.listen(3000, () => {
  console.log('http://127.0.0.1:3000')
})
