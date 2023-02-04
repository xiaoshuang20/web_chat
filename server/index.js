import express from 'express'
import { createServer } from 'http'
import io from './io.js'
import './db.js'
import api from './api.js'

const app = express()
const httpServer = createServer(app)
io.attach(httpServer)
api(app)

httpServer.listen(3000, () => {
  console.log('http://127.0.0.1:3000')
})
7
