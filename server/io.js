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
  socket.on('searchHistoryMessage', async (data) => {
    let message = await api.searchHistoryMessage(data)
    io.emit('getHistoryMessage', message)
  })
})

export default io
