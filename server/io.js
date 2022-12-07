import { Server } from 'socket.io'

const io = new Server({
  cors: {
    origin: '*',
  },
})

io.sockets.on('connection', (socket) => {
  console.log('user connected')

  socket.on('sendMsg', (data) => {
    console.log(data)
    io.emit('pushMsg', '服务端返回的消息：' + data)
  })
})

export default io
