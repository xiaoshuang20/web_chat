<template>
  <div class="chat_window">
    <div class="header">
      <h4>web_chat</h4>
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
          <li class="active">
            <div class="left">
              <el-avatar :size="40" :src="circleUrl" />
            </div>
            <div class="center">
              <span>test</span>
              <p>hello，这是一段测试信息，测试多余文字溢出</p>
            </div>
            <div class="right">
              <span>18:49</span>
              <div class="msg_unread">
                <p>1</p>
              </div>
            </div>
          </li>
          <li>
            <div class="left">
              <el-avatar :size="40" :src="circleUrl" />
            </div>
            <div class="center">
              <span>test</span>
              <p>hello，这是一段测试信息，测试多余文字溢出</p>
            </div>
            <div class="right">
              <span>18:49</span>
              <div class="msg_unread">
                <p>1</p>
              </div>
            </div>
          </li>
        </ul>
        <div class="footer">进阶功能（待定）</div>
      </div>
      <div class="content">
        <div class="chat_his"></div>
        <div class="window"></div>
        <div class="write">
          <div class="emoji">
            <span class="iconfont icon-expression"></span>
          </div>
          <div class="text">
            <el-input type="textarea" v-model="test" />
          </div>
          <div class="send">
            <el-button>
              发送
              <EpPromotion class="icon" />
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { io } from 'socket.io-client'
// const socket = io() // 因为在 vite.config.js 文件中配置了代理，所以可以视为同域
const test = ref('')
// onMounted(() => {
//   initConnect()
// })

// const initConnect = () => {
//   socket.on('pushMsg', (data) => {
//     console.log(data)
//   })
// }

// const sendMsgToServer = () => {
//   console.log('click')
//   socket.emit('sendMsg', 'xiaoshuang')
// }
</script>

<style scoped lang="less">
.chat_window {
  margin: 10% auto;
  width: 65%;
  height: 60%;
  background-color: #ffedde;

  .header {
    height: 7%;
    background-image: linear-gradient(to right, #00acf3, #00e47c);
    display: flex;
    justify-content: space-between;

    h4 {
      display: flex;
      align-items: center;
      margin-left: 20px;
      text-shadow: 0 0 10px #dfd8d8;
      background: linear-gradient(135deg, #14ffe9, #ffeb3b, #ff00e0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 18px;
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

    .content {
      flex: 3;
      background-color: #e6f8fa;

      .window {
        height: 65%;
        width: 100%;
        background-color: #e6f8fa;
      }

      .write {
        position: relative;
        height: 35%;
        border-top: 1px solid #d5e6e8;

        .emoji {
          box-sizing: border-box;
          height: 20%;
          padding: 2px 5px;

          span {
            width: 35px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 8px;
            font-size: 20px;

            &:hover {
              cursor: pointer;
              background-color: #d9eaec;
            }
          }
        }

        .text {
          height: 55%;
          :deep(.el-textarea__inner) {
            overflow: hidden;
            height: 100%;
            resize: none;
            box-shadow: none;
            padding: 10px;
            color: #666666;
            background-color: transparent;
            line-height: 20px;

            &:hover {
              overflow-y: auto;
              padding-right: 0;
            }
            &::-webkit-scrollbar {
              width: 10px;
            }
            &::-webkit-scrollbar-thumb {
              background: #bfbfbf;
              border-radius: 8px;
            }
          }
        }

        .send {
          position: absolute;
          right: 20px;
          bottom: 10px;

          .el-button {
            color: #e0f6f9;
            border: 1px solid #a0e4ec;
            background-color: #00b6cc;

            &:hover {
              background-color: #19c5d8;
            }

            .icon {
              margin-left: 3px;
            }
          }
        }
      }
    }
  }
}
</style>
