import { Server } from 'socket.io'
import api from './store.js'

const io = new Server({
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log('user connected', socket.id)

  // > 用户区域
  socket.on('register', async (data) => {
    let res = await api.register(data)
    if (!res) {
      io.emit('registerFail')
    } else {
      io.emit('registerSuccess', res)
    }
  })

  socket.on('login', async (data) => {
    let res = await api.login(data)
    if (!res) {
      io.emit('loginFail')
    } else {
      io.emit('loginSuccess', res)
    }
  })

  socket.on('getAllFriend', async (data) => {
    let friends = await api.getAllFriend(data)
    io.emit('getAllFriendSuccess', friends)
  })

  socket.on('addFriends', async (data, user, roomName) => {
    if (data === user.name) {
      io.emit('addFriendsFail', '不能添加自己为好友哦~')
      return
    }
    let res = await api.addFriends(data, user, roomName)
    if (!res) {
      io.emit('addFriendsFail', '搜索用户不存在诶')
      return
    }
    io.emit('addFriendsSuccess', res, '添加成功，快来一起聊天吧！')
  })

  socket.on('setRoomId', async (id) => {
    await api.setRoomId({ objectId: id, id: socket.id })
  })

  socket.on('updateTarget', async (id) => {
    let res = await api.updateTarget(id)
    // 只给当前 socket 更新
    io.to(socket.id).emit('updateTargetSuccess', res)
  })

  // > 消息区域
  socket.on('getHistoryMessage', async (data) => {
    let message = await api.getHistoryMessage(data)
    if (message) io.emit('getHistoryMessageSuccess', message)
  })

  socket.on('sendMessage', async (name, data) => {
    // 通知接收方
    socket.broadcast.to(data.to.roomID).emit('getMessage', data)
    // 持久化存储
    let res = await api.saveMessage(name, data)
    if (!res) {
      io.emit('sendMessageFail', '发送失败，请检查网络情况')
      return
    }
  })
})

export default io
