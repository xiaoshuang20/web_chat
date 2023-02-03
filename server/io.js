import { Server } from 'socket.io'
import api from './store.js'

const io = new Server({
  cors: {
    origin: '*',
  },
})

io.sockets.on('connection', (socket) => {
  console.log('user connected')

  socket.on('searchHistoryMessage', async (data) => {
    let message = await api.searchHistoryMessage(data)
    io.emit('getHistoryMessage', message)
  })
})

export default io
