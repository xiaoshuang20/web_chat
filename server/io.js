import { Server } from 'socket.io'
import api from './store.js'

const io = new Server({
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('user connected')

  // > 用户区域
  socket.on('getAllFriend', async (data) => {
    let friends = await api.getAllFriend(data)
    io.emit('getAllFriend1', friends)
  })

  // > 消息区域
  socket.on('getHistoryMessage', async (data) => {
    let message = await api.getHistoryMessage(data)
    io.emit('getHistoryMessage1', message)
  })

  socket.on('sendMessage', async (name, data) => {
    let res = await api.sendMessage(name, data)
    socket.broadcast.emit()
  })
})

export default io
