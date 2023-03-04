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
      io.to(socket.id).emit('registerFail')
    } else {
      io.to(socket.id).emit('registerSuccess', res)
    }
  })

  socket.on('login', async (data) => {
    let res = await api.login(data)
    if (!res) {
      io.to(socket.id).emit('loginFail')
    } else {
      io.to(socket.id).emit('loginSuccess', res)
    }
  })

  socket.on('getAllFriend', async (data) => {
    let friends = await api.getAllFriend(data.objectId)
    let lastMsg = []
    for (let i = 0; i < friends.length; i++) {
      let res = await api.getHistoryMessage(`${data.name}_${friends[i].name}`)
      lastMsg.push(res)
    }
    // 避免不同页面之间的刷新互相影响
    io.to(socket.id).emit('getAllFriendSuccess', friends, lastMsg)
  })

  socket.on('addFriends', async (data, user, roomName) => {
    if (data === user.name) {
      io.to(socket.id).emit('addFriendsFail', '不能添加自己为好友哦~')
      return
    }
    let res = await api.addFriends(data, user, roomName)
    if (!res) {
      io.to(socket.id).emit('addFriendsFail', '搜索用户不存在诶')
      return
    }
    io.to(socket.id).emit(
      'addFriendsSuccess',
      res,
      '添加成功，快来一起聊天吧！'
    )
  })

  socket.on('setRoomId', async (id) => {
    await api.setRoomId({ objectId: id, id: socket.id })
  })

  // > 消息区域
  socket.on('sendMessage', async (name, data) => {
    // 更新聊天对象信息（对方登录后自带的房间 ID 值会变，需要实时更新）
    let res1 = await api.updateTarget(data.to.objectId)
    // 持久化存储(需要先存储，否则后续接收方修改消息未读状态时查询不到完整消息记录)
    let res2 = await api.saveMessage(name, data)
    if (!res2) {
      io.to(socket.id).emit('sendMessageFail', '发送失败，请检查网络情况')
      return
    }
    // 通知接收方
    socket.broadcast.to(res1.roomID).emit('getMessage', data)
  })

  socket.on('changeReadStatus', async (msg) => {
    let { from, to, currentTime } = msg
    await api.changeReadStatus(`${from.name}_${to.name}`, currentTime)
  })

  socket.on('clearUnread', async (name) => {
    await api.clearUnread(name)
  })
})

export default io
