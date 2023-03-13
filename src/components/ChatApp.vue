<template>
  <div class="chat_window">
    <div class="header">
      <div class="title" v-drag :drag-min-top="2">
        <h4>web_chat</h4>
      </div>
      <ul>
        <li class="mini">
          <EpMinus />
        </li>
        <li class="full">
          <EpFullScreen />
        </li>
        <li class="close">
          <EpClose />
        </li>
      </ul>
    </div>
    <div class="container">
      <div class="aside">
        <div class="search">
          <el-input
            placeholder="搜索"
            v-model="searchKey"
            @keydown.enter="searchFriend"
          >
            <template #prefix>
              <Epsearch />
            </template>
          </el-input>
          <el-button type="primary" @click.stop="dialogVisible = true">
            <EpPlus />
          </el-button>
        </div>
        <ul v-if="friends" class="user">
          <li
            v-for="user in friends"
            :key="user.objectId"
            @click="changeCurrent(user.objectId)"
            :class="{ active: current === user.objectId }"
          >
            <div class="left">
              <!-- 双击头像查看用户个人信息面板 -->
              <el-avatar
                :size="40"
                :src="user.avatarUrl"
                @dblclick="dbclickUser(user)"
              />
            </div>
            <div class="center">
              <span>{{ user.name }}</span>
              <p>
                {{
                  historyMsg[`to_${user.objectId}`]
                    ? historyMsg[`to_${user.objectId}`][
                        historyMsg[`to_${user.objectId}`].length - 1
                      ].content
                    : '已添加好友'
                }}
              </p>
            </div>
            <div class="right">
              <span>{{
                historyMsg[`to_${user.objectId}`]
                  ? expressTime(
                      historyMsg[`to_${user.objectId}`][
                        historyMsg[`to_${user.objectId}`].length - 1
                      ].currentTime
                    )
                  : expressTime(user.updatedAt)
              }}</span>
              <div class="msg_unread_box">
                <div
                  v-show="unreadNum(user.objectId) !== -1"
                  :class="{ much_msg: unreadNum(user.objectId) > 99 }"
                >
                  <p>
                    {{
                      unreadNum(user.objectId) > 99
                        ? 99
                        : unreadNum(user.objectId)
                    }}
                  </p>
                  <span v-if="unreadNum(user.objectId) > 99">+</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="no_friends">还没有好友哦!</p>
        <div class="footer">
          <!-- 进阶功能（我的/好友请求/气泡样式/创建房间） -->
          <ul class="expand">
            <el-popover
              v-for="(item, index) in expand"
              :key="index"
              placement="top-start"
              trigger="hover"
              :content="item.tip"
              :hide-after="0"
              :show-after="500"
            >
              <template #reference>
                <li
                  @click="handleExpand(item)"
                  class="iconfont"
                  :class="[item.icon]"
                ></li>
              </template>
            </el-popover>
          </ul>
        </div>
      </div>
      <BackgroundPanel
        v-if="targetUser"
        :message="message"
        :currentUser="currentUser"
        @sendMessage="sendMessage"
        ref="panel"
      />
      <div class="emptyUser" v-else>这里还什么也没有哦, 快去跟好友聊天吧！</div>
    </div>
    <!-- 个人信息弹框 -->
    <el-dialog
      v-model="settingDialogVisible"
      width="50%"
      :modal="false"
      draggable
      @close-auto-focus="closeSetting"
      @close="closeSetting"
    >
      <div class="bgc">
        <div class="avatar">
          <el-popover
            placement="bottom-start"
            trigger="hover"
            content="点击更换头像"
            :hide-after="0"
            :show-after="1000"
            v-if="cardMsgUser.objectId === currentUser.objectId"
          >
            <template #reference>
              <el-avatar
                :size="60"
                :src="getAssetsFile(cardMsgUser.avatarUrl)"
                @mouseover="hoverAvatar"
                @mouseleave="leaveAvatar"
                :class="{ hover_color: isHover }"
                @click="hiddenInput.click()"
              />
            </template>
          </el-popover>
          <el-avatar
            v-else
            :size="60"
            :src="getAssetsFile(cardMsgUser.avatarUrl)"
          />
          <div class="user_msg">
            <p class="name">{{ cardMsgUser.name }}</p>
            <p class="signature">{{ cardMsgUser.signature }}</p>
          </div>
          <input
            type="file"
            v-show="false"
            ref="hiddenInput"
            @change="handleFile"
          />
        </div>
      </div>
      <div class="msg">
        <div class="container">
          <span
            class="edit"
            @click="handleEdit"
            v-if="cardMsgUser.objectId === currentUser.objectId"
            >编辑资料</span
          >
          <div class="id">
            <span class="iconfont icon-zuanshi"></span>
            <span>{{ cardMsgUser.objectId }}</span>
          </div>
          <div class="user">
            <span class="iconfont icon-user"></span>
            <span>{{ cardMsgUser.name }}</span>
          </div>
        </div>
        <span class="line"></span>
        <div class="signature">
          <div class="head">
            <span class="iconfont icon-signature"></span>
            <span>个性签名</span>
          </div>
          <div class="content">{{ cardMsgUser.signature }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="添加好友"
    width="30%"
    :modal="false"
    draggable
    @close-auto-focus="handleClose"
    @close="handleClose"
  >
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
      }"
    >
      <span
        :style="{
          width: '40px',
        }"
        >昵称</span
      >
      <el-input v-model="addName" placeholder="请输入添加好友姓名"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addFriend"> 添加 </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="editgDialogVisible"
    title="编辑资料"
    width="30%"
    :modal="false"
    draggable
    @close-auto-focus="handleEditClose"
    @close="handleEditClose"
  >
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
      }"
    >
      <span
        :style="{
          width: '80px',
        }"
        >用户名</span
      >
      <el-input v-model="editName" placeholder="请输入用户名"></el-input>
    </div>
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
      }"
    >
      <span
        :style="{
          width: '80px',
        }"
        >个性签名</span
      >
      <el-input
        v-model="editSignature"
        type="textarea"
        placeholder="这里什么也没有哦~"
        :style="{
          marginTop: '20px',
        }"
      ></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editgDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="edit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import BackgroundPanel from './BackgroundPanel.vue'
import { io } from 'socket.io-client'
import { getCurrentTime, expressTime, getAssetsFile, messageU } from '../utils'

const socket = io() // 因为在 vite.config.js 文件中配置了代理，所以可以视为同域

onMounted(() => {
  initConnect()
})

const initConnect = async () => {
  // 获取当前用户
  currentUser.value = JSON.parse(window.sessionStorage.getItem('current_user'))
  getAllFriend()
  setRoomId()
  socket.on('getAllFriendSuccess', changeFriendsList)
  socket.on('addFriendsSuccess', addFriendsSuccess)
  socket.on('addFriendsFail', addFriendsFail)
  socket.on('sendMessageFail', sendMessageFail)
  socket.on('getMessage', getMessage)
  socket.on('changeNameSuccess', changeName)
  socket.on('changeSignatureSuccess', changeSignature)
  socket.on('changeAvatar', changeAvatar)
  socket.on('changeAvatarSuccess', changeAvatarSuccess)
}

const setRoomId = () => {
  socket.emit('setRoomId', currentUser.value.objectId)
}

/**
 * > 用户区域
 */
let currentUser = ref(null)
let historyMsg = ref({})
let targetUser = ref(null)
const roomName = computed(() => {
  return `${currentUser.value?.objectId}_${targetUser.value?.objectId}`
})

// 获取所有好友
const allFriends = ref(null) // 所有好友列表（缓存）
const friends = ref(null) // 好友列表
const getAllFriend = () => {
  socket.emit('getAllFriend', currentUser.value)
}
const changeFriendsList = (data, msg) => {
  if (data.length !== 0) {
    allFriends.value = data
    friends.value = data
    // 同时记录历史信息
    data.forEach((item, index) => {
      historyMsg.value[`to_${item.objectId}`] = msg[index]
    })
  }
}
// 添加好友
let dialogVisible = ref(false)
let addName = ref('')
const addFriend = () => {
  if (addName.value === '') {
    messageU.warn('输入用户昵称才能搜索哦')
    return
  }
  socket.emit('addFriends', addName.value, currentUser.value)
}
const addFriendsSuccess = (data, msg) => {
  // 直接将添加的好友 push到好友数组，不需要发起获取好友请求
  if (!friends.value) {
    allFriends.value = [data]
    friends.value = [data]
  } else {
    allFriends.value.push(data)
    friends.value.push(data)
  }
  messageU.success(msg)
  handleClose()
}
const addFriendsFail = (data) => {
  messageU.warn(data)
  handleClose()
}
const handleClose = () => {
  dialogVisible.value = false
  addName.value = ''
}
// 切换聊天对象
let current = ref() // 当前选中用户
const changeCurrent = async (userId) => {
  if (current.value === userId) return
  current.value = userId
  targetUser.value = friends.value.find((item) => item.objectId === userId)
  message.value = historyMsg.value[`to_${userId}`]
    ? [...historyMsg.value[`to_${userId}`]]
    : []
  clearUnread(userId)
}
// 搜索好友
let searchKey = ref('')
const searchFriend = () => {
  if (searchKey.value === '') {
    friends.value = [...allFriends.value]
  }
  friends.value = allFriends.value.filter((item) => {
    return item.name.includes(searchKey.value)
  })
}
// 有人改名字了
const changeName = (id, name) => {
  let index = friends.value.findIndex((item) => item.objectId === id)
  if (index !== -1) {
    friends.value[index].name = name
    let index1 = allFriends.value.findIndex((item) => item.objectId === id)
    allFriends.value[index1].name = name
  }
}
// 改签名了
const changeSignature = (id, data) => {
  let index = friends.value.findIndex((item) => item.objectId === id)
  if (index !== -1) {
    friends.value[index].signature = data
    let index1 = allFriends.value.findIndex((item) => item.objectId === id)
    allFriends.value[index1].signature = data
  }
}
// 有人改头像了
const changeAvatarSuccess = (user, path) => {
  let index = friends.value.findIndex((item) => item.objectId === user.objectId)
  if (index !== -1) {
    friends.value[index].avatarUrl = path // 侧边栏头像的更新
    let index1 = allFriends.value.findIndex(
      (item) => item.objectId === user.objectId
    )
    allFriends.value[index1].avatarUrl = path
    // 聊天消息中的头像也要实时更新
    if (targetUser.value?.objectId === user.objectId) {
      message.value.forEach((item, index) => {
        if (item.from.objectId === user.objectId) {
          message.value[index].from.avatarUrl = path
        }
      })
      historyMsg.value[`to_${user.objectId}`] = [...message.value]
    } else {
      historyMsg.value[`to_${user.objectId}`].forEach((item, index) => {
        if (item.from.objectId === user.objectId) {
          historyMsg.value[`to_${user.objectId}`][index].from.avatarUrl = path
        }
      })
    }
  }
}

/**
 * > 消息区域
 */
let message = ref([]) // 历史记录
// 未读消息
let unreadNum = computed(() => (id) => {
  let temp = historyMsg.value[`to_${id}`]
  let num = 0
  if (temp) {
    temp.forEach((item) => {
      // 自己发送的消息不算未读
      if (item.from.name !== currentUser.value.name && !item.isRead) num++
    })
    return num ? num : -1
  } else {
    return -1
  }
})
// 清除未读消息
const clearUnread = (id) => {
  if (unreadNum.value(id) !== -1) {
    historyMsg.value[`to_${id}`].forEach((item, index) => {
      if (!item.isRead) {
        historyMsg.value[`to_${id}`][index].isRead = true
      }
    })
    socket.emit('clearUnread', roomName.value)
  }
}
// 发送信息
const sendMessage = (msg) => {
  // 发信息前对面的老6刷新了怎么办(已解决)
  let body = {
    from: currentUser.value,
    to: targetUser.value,
    content: msg,
    currentTime: getCurrentTime(),
    isRead: true,
  }
  addMessage(body)
  // 保证侧边栏展示的是最后一条历史信息
  if (historyMsg.value[`to_${targetUser.value.objectId}`]) {
    historyMsg.value[`to_${targetUser.value.objectId}`].push(body)
  } else {
    historyMsg.value[`to_${targetUser.value.objectId}`] = [body]
  }
  socket.emit('sendMessage', roomName.value, body)
}
// 添加信息
const panel = ref()
const addMessage = (msg) => {
  // 不能影响当前对话框
  if (
    msg.from.objectId === targetUser.value?.objectId ||
    msg.from.objectId === currentUser.value.objectId
  ) {
    message.value.push(msg)
    panel.value.scroll() //最新消息自动滚动到底部
  }
}
const sendMessageFail = (data) => {
  messageU.error(data)
}
// 收到消息
const getMessage = (msg) => {
  if (msg.from.objectId !== targetUser.value?.objectId) {
    msg.isRead = false
    socket.emit('changeReadStatus', msg)
  }
  addMessage(msg)
  // 保证侧边栏展示的是最后一条历史信息
  if (historyMsg.value[`to_${msg.from.objectId}`]) {
    historyMsg.value[`to_${msg.from.objectId}`].push(msg)
  } else {
    historyMsg.value[`to_${msg.from.objectId}`] = [msg]
  }
}

/**
 * > 扩展功能
 */
// 系列功能
let expand = ref([
  {
    type: 'wordcloud',
    icon: 'icon-chart-word-cloud',
    tip: '生成词云',
  },
  {
    type: 'setting',
    icon: 'icon-setting',
    tip: '个人设置',
  },
])
const handleExpand = (data) => {
  switch (data.type) {
    case 'setting':
      openSetting()
      break
    case 'wordcloud':
      wordcloud()
      break
  }
}
// 个人信息弹窗
let settingDialogVisible = ref(false)
const cardMsgUser = ref()
const openSetting = () => {
  cardMsgUser.value = currentUser.value
  settingDialogVisible.value = true
}
const closeSetting = () => {
  settingDialogVisible.value = false
}
// 好友的信息弹窗
const dbclickUser = (user) => {
  cardMsgUser.value = user
  settingDialogVisible.value = true
}
// 编辑资料
let editgDialogVisible = ref(false)
let editName = ref('')
let editSignature = ref('')
// 打开编辑弹窗
const handleEdit = () => {
  editName.value = currentUser.value.name
  editSignature.value =
    currentUser.value.signature === '这里什么也没有哦~'
      ? ''
      : currentUser.value.signature
  editgDialogVisible.value = true
}
// 关闭编辑弹窗
const handleEditClose = () => {
  editgDialogVisible.value = false
  editName.value = ''
  editSignature.value = ''
}
// 确定修改
const edit = () => {
  if (editName.value === '') {
    messageU.warn('用户名不能为空哦~')
    return
  }
  if (editName.value !== currentUser.name) {
    socket.emit('changeName', currentUser.value, editName.value)
  }
  if (
    editSignature.value !== '' &&
    editSignature.value !== currentUser.signature
  ) {
    socket.emit('changeSignature', currentUser.value, editSignature.value)
  }

  currentUser.value.name = editName.value
  currentUser.value.signature = editSignature.value
  window.sessionStorage.setItem(
    'current_user',
    JSON.stringify(currentUser.value)
  )

  messageU.success('修改成功！')
  editgDialogVisible.value = false
}
// 换头像
const isHover = ref(false)
const hiddenInput = ref()
const hoverAvatar = () => {
  isHover.value = true
}
const leaveAvatar = () => {
  isHover.value = false
}
const handleFile = (e) => {
  const reg = /\.(?:png|jpg|jepg)$/i
  let file = e.target.files[0]
  if (!reg.test(file.name)) {
    messageU.warn('请选择正确格式的图片文件!')
    return
  }
  let maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    messageU.warn('图片大小不能超过5M!')
    return
  }

  // 读 base64 编码
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = () => {
    let res = reader.result
    socket.emit('uploadAvatar', res, currentUser.value)
  }
}
const changeAvatar = (path) => {
  cardMsgUser.value.avatarUrl = path
  currentUser.value.avatarUrl = path
  window.sessionStorage.setItem(
    'current_user',
    JSON.stringify(currentUser.value)
  )
  messageU.success('修改成功！')
  if (message.value.length !== 0) {
    // 当前聊天框里更新头像
    message.value.forEach((item, index) => {
      if (item.from.objectId === currentUser.value.objectId) {
        message.value[index].from.avatarUrl = path
      }
    })
  }
  // 历史记录里也更新头像（我敲，这处理方法我都看不下去，后期看能不能优化下）
  for (let item in historyMsg.value) {
    if (item !== `to_${targetUser.value?.objectId}`) {
      historyMsg.value[item].forEach((msg, index) => {
        if (msg.from.objectId === currentUser.value.objectId) {
          historyMsg.value[item][index].from.avatarUrl = path
        }
      })
    } else {
      // 经量减少点遍历
      historyMsg.value[item] = [...message.value]
    }
  }
}
// 词云图
const wordcloud = () => {}
</script>

<style scoped lang="less">
.chat_window {
  position: absolute;
  width: 1000px;
  height: 600px;

  .header {
    width: 100%;
    height: 7%;
    background-image: linear-gradient(to right, #00acf3, #00e47c);
    display: flex;
    justify-content: space-between;

    .title {
      height: 100%;
      width: 88%;
      display: flex;
      align-items: center;
      margin-left: 20px;
      text-shadow: 0 0 10px #dfd8d8;
      h4 {
        background: linear-gradient(135deg, #14ffe9, #ffeb3b, #ff00e0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 18px;
      }
    }

    ul {
      display: flex;
      justify-content: end;
      height: 100%;

      li {
        height: 100%;
        width: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #f8fffb;

        &:hover {
          background-color: #35e79b;
        }
      }

      .close:hover {
        background-color: #fe5438;
      }
    }
  }

  .container {
    display: flex;
    height: 93%;

    .aside {
      position: relative;
      flex: 1;
      height: 100%;
      border-right: 1px solid #d5e6e8;
      background-color: #e6f8fa;

      .search {
        margin: 10px 5px;
        display: flex;
        justify-content: space-between;

        :deep(.el-input__wrapper) {
          box-shadow: none;
          background-color: #d2f3f7;

          &:hover {
            box-shadow: 0 0 0 1px #409eff inset;
          }
        }

        .el-button {
          width: 32px;
          margin-left: 10px;
          border: none;
          background-color: #b8e3e7;

          &:hover {
            background-color: #b0eef7;
          }
        }
      }

      .user {
        display: flex;
        flex-direction: column;
        margin-right: 1px;
        height: 80%;
        width: 100%;
        overflow-y: scroll;

        &::-webkit-scrollbar {
          width: 0;
        }

        li {
          box-sizing: border-box;
          min-height: 60px;
          width: 100%;
          display: flex;
          border-left: 3px solid #e6f8fa;

          .left {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .center {
            flex: 2;
            height: 100%;
            width: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;

            span,
            p {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            p {
              font-size: 12px;
              color: #6d7576;
            }
          }

          .right {
            flex: 1;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            span {
              font-size: 12px;
              color: #6d7576;
            }

            .msg_unread_box {
              width: 20px;
              height: 20px;

              div {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 5px;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #fe5438;
              }

              p {
                color: white;
                font-size: 12px;
              }

              span {
                color: #fff;
                margin-bottom: 3px;
              }
            }

            // 消息数超过两位数时变宽度
            .much_msg {
              width: 28px !important;
              border-top-left-radius: 10px !important;
              border-top-right-radius: 10px !important;
              border-bottom-left-radius: 10px !important;
              border-bottom-right-radius: 10px !important;
            }
          }

          &:hover {
            cursor: pointer;
            background-color: #daebed;
          }
        }

        .active {
          background-color: #d4e4e6;
          border-left: 3px solid #00b6cc;
        }
      }

      .no_friends {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 50%;
        color: #a8b2ca;
      }

      .footer {
        position: absolute;
        bottom: 0;
        height: 30px;
        width: 100%;
        border-top: 1px solid #d5e6e8;

        .expand {
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          li {
            font-size: 22px;
            padding: 4px;

            &:hover {
              cursor: pointer;
              background-color: #ddeef0;
            }
          }
        }
      }
    }

    .emptyUser {
      flex: 3;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      color: #a8b2ca;
      background-color: #e6f8fa;
    }
  }

  :deep(.el-dialog) {
    position: relative;
    padding: 0;
    border-radius: 10px;

    .el-dialog__header {
      position: absolute;
      margin: 0;
      padding: 0;
      height: 30px;
      width: 100%;
    }

    .el-dialog__body {
      display: flex;
      padding: 0;

      .bgc {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        flex: 1;
        height: 400px;
        background: url('/static/img/home.jpg') no-repeat center;
        background-size: cover;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;

        .avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 30%;
          border-bottom-left-radius: 10px;
          background-color: rgba(112, 118, 135, 0.8);

          .el-avatar {
            border: 1px solid #fff;
            transition: all 0.5s ease-in-out;

            &:hover {
              cursor: pointer;
              transform: rotate(360deg);
            }
          }

          .hover_color {
            border: 1px solid #009bdb;
          }

          .user_msg {
            margin-left: 12px;
            color: #fff;
            .name {
              font-size: 26px;
            }
            .signature {
              width: 120px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 12px;
              opacity: 0.8;
            }
          }
        }
      }

      .msg {
        flex: 1;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        background-image: linear-gradient(to right bottom, #3ac5fc, #4afebf);

        .container {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 26%;
          margin: 50px 24px 0px 24px;
          border-radius: 12px;
          background: linear-gradient(
            to right bottom,
            rgba(255, 255, 255, 0.6),
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.2)
          );
          backdrop-filter: blur(11px);
          border-top: 1px solid rgba(255, 255, 255, 0.8);
          border-left: 1px solid rgba(255, 255, 255, 0.8);

          .iconfont {
            margin-left: 12px;
            margin-right: 12px;
            font-size: 20px;
          }
          .user {
            margin-top: 12px;
          }
          .edit {
            position: absolute;
            top: 8px;
            right: 15px;
            color: #16a4de;

            &:hover {
              cursor: pointer;
              color: #3ac3f7;
            }
          }
        }

        .line {
          display: block;
          margin: 20px auto;
          width: 300px;
          height: 2px;
          background-color: #fff;
          opacity: 0.3;
        }

        .signature {
          .head {
            .iconfont {
              font-size: 20px;
              margin-left: 30px;
              margin-right: 12px;
            }
          }
          .content {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 24px;
            height: 100px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
