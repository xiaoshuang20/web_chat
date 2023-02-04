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
          <el-input placeholder="搜索">
            <template #prefix>
              <Epsearch />
            </template>
          </el-input>
          <el-button type="primary">
            <EpPlus />
          </el-button>
        </div>
        <ul>
          <li
            v-for="(user, index) in users"
            :key="user.objectId"
            @click="changeCurrent(index)"
            :class="{ active: current === index }"
          >
            <div class="left">
              <el-avatar :size="40" :src="circleUrl" />
            </div>
            <div class="center">
              <span>{{ user.name }}</span>
              <p>hello, 这是一段测试信息，测试多余文字溢出</p>
            </div>
            <div class="right">
              <span>{{ user.updatedAt.slice(11, 16) }}</span>
              <div class="msg_unread">
                <p>1</p>
              </div>
            </div>
          </li>
        </ul>
        <div class="footer">
          进阶功能（我的/好友请求/气泡样式/历史记录/创建房间）
        </div>
      </div>
      <BackgroundPanel :message="message" />
    </div>
  </div>
</template>

<script setup>
import circleUrl from '@/assets/images/avatar.jpg'
import BackgroundPanel from './BackgroundPanel.vue'
import { io } from 'socket.io-client'

const socket = io() // 因为在 vite.config.js 文件中配置了代理，所以可以视为同域
onMounted(() => {
  initConnect()
})

const initConnect = async () => {
  await getAllFriend()
  getHistoryMessage()
}
const test = ref('')
let currentUser = ref('xiao')
let targetUser = ref('')

/**
 * > 用户区域
 */
let current = ref(0) // 当前选中用户
const changeCurrent = (index) => {
  current.value = index
}
const users = ref([])
// const getAllFriend = async () => {
//   let res = await UserService.getAllFriends({ id: 'irJ2AAAU' })
//   users.value = res.data
//   targetUser.value = res.data[0].name
// }

/**
 * > 消息区域
 */
let message = ref([])
const getHistoryMessage = () => {
  socket.emit(
    'searchHistoryMessage',
    `${currentUser.value}-${targetUser.value}`
  )
  socket.on('getHistoryMessage', (res) => {
    console.log(res)
    message.value = res
  })
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

            .msg_unread {
              margin-top: 5px;
              //   消息数超过两位数时变宽度
              //   width: 25px;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              text-align: center;
              line-height: 20px;
              background-color: #fe5438;

              p {
                color: white;
                font-size: 12px;
              }
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

      .footer {
        position: absolute;
        bottom: 0;
        height: 30px;
        width: 100%;
        background-color: pink;
      }
    }
  }
}
</style>
