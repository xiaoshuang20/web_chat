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
        <ul v-if="friends">
          <li
            v-for="(user, index) in friends"
            :key="user.objectId"
            @click="changeCurrent(index)"
            :class="{ active: current === index }"
          >
            <div class="left">
              <el-avatar :size="40" :src="user.avatarUrl" />
            </div>
            <div class="center">
              <span>{{ user.name }}</span>
              <p>
                {{
                  historyMsg[`to_${user.name}`]
                    ? historyMsg[`to_${user.name}`][
                        historyMsg[`to_${user.name}`].length - 1
                      ].content
                    : '已添加好友'
                }}
              </p>
            </div>
            <div class="right">
              <span>{{
                historyMsg[`to_${user.name}`]
                  ? expressTime(
                      historyMsg[`to_${user.name}`][
                        historyMsg[`to_${user.name}`].length - 1
                      ].currentTime
                    )
                  : expressTime(user.updatedAt)
              }}</span>
              <div class="msg_unread_box">
                <div
                  v-show="unreadNum(user.name) !== -1"
                  :class="{ much_msg: unreadNum(user.name) > 99 }"
                >
                  <p>
                    {{ unreadNum(user.name) > 99 ? 99 : unreadNum(user.name) }}
                  </p>
                  <span v-if="unreadNum(user.name) > 99">+</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="no_friends">还没有好友哦!</p>
        <div class="footer">
          <!-- 进阶功能（我的/好友请求/气泡样式/创建房间） -->
          <ul>
            <li>
              <el-popover
                placement="top-start"
                trigger="hover"
                content="this is content, this is content, this is content"
                :hide-after="0"
              >
                <template #reference>
                  <el-button class="expand"><Epuser /></el-button>
                </template>
              </el-popover>
            </li>
          </ul>
        </div>
      </div>
      <BackgroundPanel
        v-if="targetUser"
        :message="message"
        :currentUser="currentUser.name"
        @sendMessage="sendMessage"
      />
      <div class="emptyUser" v-else>这里还什么也没有哦, 快去跟好友聊天吧！</div>
    </div>
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
</template>

<script setup>
import BackgroundPanel from './BackgroundPanel.vue'
import { io } from 'socket.io-client'
import { getCurrentTime, expressTime } from '../utils'
import { computed } from 'vue'

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
  return `${currentUser.value?.name}_${targetUser.value?.name}`
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
      historyMsg.value[`to_${item.name}`] = msg[index]
    })
  }
}
// 添加好友
let dialogVisible = ref(false)
let addName = ref('')
const addFriend = () => {
  if (addName.value === '') {
    ElMessage({
      message: '输入用户昵称才能搜索哦',
      type: 'warning',
    })
    return
  }
  socket.emit(
    'addFriends',
    addName.value,
    currentUser.value,
    `${currentUser.value?.name}_${addName.value}`
  )
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
  ElMessage({
    message: msg,
    type: 'success',
  })
  handleClose()
}
const addFriendsFail = (data) => {
  ElMessage({
    message: data,
    type: 'warning',
  })
  handleClose()
}
const handleClose = () => {
  dialogVisible.value = false
  addName.value = ''
}
// 切换聊天对象
let current = ref() // 当前选中用户
const changeCurrent = async (index) => {
  if (current.value === index) return
  current.value = index
  targetUser.value = friends.value[index]
  message.value = historyMsg.value[`to_${targetUser.value.name}`]
    ? [...historyMsg.value[`to_${targetUser.value.name}`]]
    : []
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

/**
 * > 消息区域
 */
let message = ref([]) // 历史记录
// 未读消息
let unreadNum = computed(() => (name) => {
  let temp = historyMsg.value[`to_${name}`]
  let num = 0
  if (temp) {
    temp.forEach((item) => {
      if (item.from.name !== currentUser.value.name && !item.isRead) num++
    })
    return num ? num : -1
  } else {
    return -1
  }
})
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
  if (historyMsg.value[`to_${targetUser.value.name}`]) {
    historyMsg.value[`to_${targetUser.value.name}`].push(body)
  } else {
    historyMsg.value[`to_${targetUser.value.name}`] = [body]
  }
  socket.emit('sendMessage', roomName.value, body)
}
// 添加信息
const addMessage = (msg) => {
  // 不能影响当前对话框
  if (
    msg.from.objectId === targetUser.value?.objectId ||
    msg.from.objectId === currentUser.value.objectId
  ) {
    message.value.push(msg)
  }
}
const sendMessageFail = (data) => {
  ElMessage({
    message: data,
    type: 'error',
  })
}
// 收到消息
const getMessage = (msg) => {
  if (msg.from.objectId !== targetUser.value?.objectId) {
    msg.isRead = false
  }
  addMessage(msg)
  socket.emit('changeReadStatus', msg)
  // 保证侧边栏展示的是最后一条历史信息
  if (historyMsg.value[`to_${msg.from.name}`]) {
    historyMsg.value[`to_${msg.from.name}`].push(msg)
  } else {
    historyMsg.value[`to_${msg.from.name}`] = [msg]
  }
}
</script>

<style scoped lang="less">
.chat_window {
  position: absolute;
  width: 900px;
  height: 550px;

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

      ul {
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
        background-color: pink;
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
}
</style>
