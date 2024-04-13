import Bmob from 'hydrogen-js-sdk'
import fs from 'fs'
import path from 'path'

const dir = path.resolve()

const user = {
  // 用户登录
  async login(data) {
    const queryUsers = Bmob.Query('users')
    queryUsers.equalTo('name', '==', data.name)
    queryUsers.equalTo('password', '==', data.password)
    let res = await queryUsers.find()
    if (res.length === 0) {
      return false
    } else {
      return res[0]
    }
  },

  // 用户注册
  async register(data) {
    const queryUsers = Bmob.Query('users')
    queryUsers.equalTo('name', '==', data.name)
    let temp = await queryUsers.find()
    // 用户名保证唯一
    if (temp.length === 0 && !!data.name && !!data.password) {
      queryUsers.set('name', data.name)
      queryUsers.set('password', data.password)
      queryUsers.set('type', 'user')
      queryUsers.set('avatarUrl', '/static/img/avatar.jpg')
      // queryUsers.set('roomID', data.id)
      queryUsers.set('signature', '这里什么也没有哦~')
      let res = await queryUsers.save()
      let result = await this.getUserMsg(res.objectId)
      return result
    } else {
      return false
    }
  },
  // 获取用户全部信息
  async getUserMsg(id) {
    const queryUsers = Bmob.Query('users')
    let res = await queryUsers.get(id)
    return res
  },

  // 获取所有好友
  async getAllFriend(id) {
    const queryUsers = Bmob.Query('users')
    // 筛选条件
    queryUsers.field('friends', id)
    let res = await queryUsers.relation('users')
    return res.results
  },

  // 获取所有加入的群聊
  async getAllGroup(id) {
    const queryUsers = Bmob.Query('users')
    // 筛选条件
    queryUsers.field('group', id)
    let res = await queryUsers.relation('group_message')
    return res.results
  },

  // 添加好友
  async addFriends(name, user) {
    const queryUsers = Bmob.Query('users')
    queryUsers.equalTo('name', '==', name)
    let res = await queryUsers.find()
    if (res.length === 0) return false

    let flag1 = await this.add(res[0].objectId, user.objectId)
    let flag2 = await this.add(user.objectId, res[0].objectId)
    let flag3 = await this.createRoom(`${user.objectId}_${res[0].objectId}`)
    if (flag1 && flag2 && flag3) {
      return res[0]
    }
  },
  async add(user1, user2) {
    const relation = Bmob.Relation('users')
    const relID = relation.add(user2)
    const queryUsers = Bmob.Query('users')
    const res = await queryUsers.get(user1)
    res.set('friends', relID)
    res.save()
    return true
  },
  async createRoom(roomName) {
    const queryUsersMessage = Bmob.Query('user_message')
    queryUsersMessage.set('users', roomName)
    let res = await queryUsersMessage.save()
    if (res.objectId) return true
  },

  // 设置 roomID
  async setRoomId(data) {
    const queryUsers = Bmob.Query('users')
    let res = await queryUsers.get(data.objectId)
    res.set('roomID', data.id)
    res.save()
  },

  // 更新 target 对象
  async updateTarget(id) {
    let res = await this.getUserMsg(id)
    return res
  },

  // 更新个性签名
  async changeSignature(id, data) {
    let res = await this.getUserMsg(id)
    res.set('signature', data)
    res.save()
  },

  // 更新用户名
  async changeName(id, data) {
    let res = await this.getUserMsg(id)
    res.set('name', data)
    res.save()
  },

  // 创建群聊
  async createGroup(users) {
    const queryGroupMessage = Bmob.Query('group_message')
    const roomName = users.join(',')
    queryGroupMessage.set('users', roomName)
    let res = await queryGroupMessage.save()

    if (res.objectId) {
      const groupName = await this.addGroup(users, res.objectId)
      const temp = await queryGroupMessage.get(res.objectId)
      temp.set('name', groupName)
      temp.save()
      return res.objectId
    }
  },

  // 用户记录加入的群聊
  async addGroup(users, groupId) {
    const groupName = []
    const relation = Bmob.Relation('group_message')
    const relID = relation.add(groupId)
    const queryUsers = Bmob.Query('users')
    for (let i = 0; i < users.length; i++) {
      let res = await queryUsers.get(users[i])
      res.set('group', relID)
      groupName.push(res.name)
      res.save()
      if (groupName.length === users.length) return groupName.join(',')
    }
  },

  // 是否加入新群聊
  async joinGroup(groupId, userId) {
    let res = await this.getAllGroup(userId)
    if (res.findIndex((item) => item.objectId === groupId) !== -1) {
      return true
    }
    return false
  },

  // 改群名
  async editGroupName(name, groupId) {
    const queryUsers = Bmob.Query('group_message')
    let res = await queryUsers.get(groupId)
    res.set('name', name)
    res.save()
    return true
  },

  // 上传头像
  async uploadAvatar(file) {
    // 上传到 assets会导致资源重新加载
    let fileName = Date.now() + '.png'
    let temp = dir.split('\\')
    temp[temp.length - 1] = 'public/static/avatar/'
    let filePath = temp.join('/') + fileName
    let base64 = file.replace(/^data:image\/\w+;base64,/, '')
    let dataBuffer = Buffer.from(base64, 'base64')
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, dataBuffer, function (err) {
        if (!err) {
          resolve('/static/avatar/' + fileName)
        } else {
          reject(false)
        }
      })
    })
  },
  async changeAvatar(id, path) {
    let res = await this.getUserMsg(id)
    res.set('avatarUrl', path)
    res.save()
  },

  // 发送图片
  async uploadImg(file) {
    // 上传到 assets会导致资源重新加载
    let fileName = Date.now() + '.png'
    let temp = dir.split('\\')
    temp[temp.length - 1] = 'public/static/chatImg/'
    let filePath = temp.join('/') + fileName
    let base64 = file.replace(/^data:image\/\w+;base64,/, '')
    let dataBuffer = Buffer.from(base64, 'base64')
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, dataBuffer, function (err) {
        if (!err) {
          resolve('/static/chatImg/' + fileName)
        } else {
          reject(false)
        }
      })
    })
  },
}

const message = {
  async uitl(name) {
    const queryUsersMessage = Bmob.Query('user_message')
    queryUsersMessage.equalTo('users', '==', name)
    let res = await queryUsersMessage.find()
    return res
  },

  // 获取聊天信息
  async getHistoryMessage(name) {
    let res = await this.uitl(name)
    if (res.length === 0) {
      // xiao-test 和 test-xiao 消息记录是一样的
      const arr = name.split('_')
      res = await this.uitl(arr.reverse().join('_'))
    }
    return res[0].message
  },

  // 发送信息
  async saveMessage(name, msg) {
    const queryUsersMessage = Bmob.Query('user_message')
    let res = await this.uitl(name)
    if (res.length === 0) {
      const arr = name.split('_')
      res = await this.uitl(arr.reverse().join('_'))
    }
    let res1 = await queryUsersMessage.get(res[0].objectId)
    res1.add('message', [msg])
    res1.save()
    return true
  },

  // 发送群聊消息
  async saveGroupMessage(group, msg) {
    const queryGroupMessage = Bmob.Query('group_message')
    let res = await queryGroupMessage.get(group)
    res.add('message', [msg])
    res.save()
    return true
  },

  // 标记消息未读状态
  async changeReadStatus(name, targetTime) {
    const queryUsersMessage = Bmob.Query('user_message')
    let res = await this.uitl(name)
    if (res.length === 0) {
      const arr = name.split('_')
      res = await this.uitl(arr.reverse().join('_'))
    }

    let message = res[0].message
    let index = message.findIndex((item) => {
      return item.currentTime === targetTime
    })
    message[index].isRead = false
    let res1 = await queryUsersMessage.get(res[0].objectId)
    res1.set('message', message)
    res1.save()
  },

  // 清除未读消息
  async clearUnread(name) {
    const queryUsersMessage = Bmob.Query('user_message')
    let res = await this.uitl(name)
    if (res.length === 0) {
      const arr = name.split('_')
      res = await this.uitl(arr.reverse().join('_'))
    }

    let message = res[0].message
    message.forEach((item, index) => {
      if (!item.isRead) {
        message[index].isRead = true
      }
    })
    let res1 = await queryUsersMessage.get(res[0].objectId)
    res1.set('message', message)
    res1.save()
  },
}

export default {
  ...user,
  ...message,
}
