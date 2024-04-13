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
      // 登录后需要jion已加入的群聊，否则收不到后继群消息
      let joinGroup = await api.getAllGroup(res.objectId)
      joinGroup.forEach((item) => {
        socket.join(item.objectId)
        console.log(res.objectId, '加入：', item.objectId)
      })
      io.to(socket.id).emit('loginSuccess', res)
    }
  })

  socket.on('getAllFriend', async (data) => {
    let friends = await api.getAllFriend(data.objectId)
    let lastMsg = []
    for (let i = 0; i < friends.length; i++) {
      let res = await api.getHistoryMessage(
        `${data.objectId}_${friends[i].objectId}`
      )
      lastMsg.push(res)
    }
    // 避免不同页面之间的刷新互相影响
    io.to(socket.id).emit('getAllFriendSuccess', friends, lastMsg)
  })

  socket.on('getAllGroup', async (data) => {
    let groups = await api.getAllGroup(data.objectId)
    io.to(socket.id).emit('getAllGroupSuccess', groups)
  })

  socket.on('addFriends', async (data, user) => {
    if (data === user.name) {
      io.to(socket.id).emit('addFriendsFail', '不能添加自己为好友哦~')
      return
    }
    let friends = await api.getAllFriend(user.objectId)
    if (friends.findIndex((item) => item.name === data) !== -1) {
      io.to(socket.id).emit('addFriendsFail', '已经是好友了，快去聊天吧~')
      return
    }

    let res = await api.addFriends(data, user)
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

  socket.on('changeSignature', async (user, data) => {
    await api.changeSignature(user.objectId, data)
    socket.broadcast.emit('changeSignatureSuccess', user.objectId, data)
  })

  socket.on('changeName', async (user, data) => {
    await api.changeName(user.objectId, data)
    socket.broadcast.emit('changeNameSuccess', user.objectId, data)
  })

  socket.on('uploadAvatar', async (file, user) => {
    let res = await api.uploadAvatar(file)
    io.to(socket.id).emit('changeAvatar', res)
    socket.broadcast.emit('changeAvatarSuccess', user, res)
    await api.changeAvatar(user.objectId, res)
  })

  socket.on('uploadImg', async (file, user) => {
    let res = await api.uploadImg(file)
    io.to(socket.id).emit('sendImg', res)
  })

  socket.on('creatGroup', async (users) => {
    let res = await api.createGroup(users)
    if (res) {
      io.to(socket.id).emit('createGroupSuccess', '创建群聊成功~')
      // 广播给所有用户
      io.emit('isJoinGroup', res)
    }
  })

  socket.on('initJoinGroup', async (user) => {
    // 登录后需要jion已加入的群聊，否则收不到后继群消息
    let joinGroup = await api.getAllGroup(user.objectId)
    joinGroup.forEach((item) => {
      socket.join(item.objectId)
      console.log(user.objectId, '加入：', item.objectId)
    })
  })

  socket.on('joinGroup', async (groupId, userId) => {
    let res = await api.joinGroup(groupId, userId)
    if (res) {
      // 加入房间
      socket.join(groupId)
      console.log(userId, '加入房间：', groupId)
      const allGroup = await api.getAllGroup(userId)
      const group = allGroup.find((item) => item.objectId === groupId)
      io.to(socket.id).emit('joinGroup', group)
    } else {
      console.log('不加入')
    }
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

  socket.on('sendGroupMessage', async (group, data) => {
    let res = await api.saveGroupMessage(group, data)
    if (!res) {
      io.to(socket.id).emit('sendMessageFail', '发送失败，请检查网络情况')
      return
    }
    // 通知接收方 (房间中除发送者之外的每个socket都会收到该事件)
    socket.to(group).emit('getGroupMessage', data, group)
  })

  socket.on('changeReadStatus', async (msg) => {
    let { from, to, currentTime } = msg
    await api.changeReadStatus(`${from.objectId}_${to.objectId}`, currentTime)
  })

  socket.on('clearUnread', async (name) => {
    await api.clearUnread(name)
  })
})

export default io
