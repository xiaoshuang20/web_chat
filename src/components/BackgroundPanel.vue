<template>
  <div class="content">
    <div class="window">
      <BubbleFrame
        v-for="(msg, index) in props.message"
        :key="index"
        :isSend="msg.from?.name === props.currentUser"
        :msg="msg"
      />
    </div>
    <div class="write">
      <div class="emoji">
        <ul>
          <el-popover
            v-for="(item, index) in icons"
            :key="index"
            placement="bottom-start"
            trigger="hover"
            :content="item.tip"
            :hide-after="0"
          >
            <template #reference>
              <li class="iconfont" :class="[item.icon]"></li>
            </template>
          </el-popover>
        </ul>
      </div>
      <div class="text">
        <el-input
          type="textarea"
          v-model="message"
          @keydown.enter.stop="sendMessage"
        />
      </div>
      <div class="send">
        <el-button @click="sendMessage">
          发送
          <EpPromotion class="icon" />
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import BubbleFrame from './BubbleFrame.vue'

let props = defineProps(['message', 'currentUser'])
let emits = defineEmits(['sendMessage'])

// 发送消息
let message = ref('')
const sendMessage = () => {
  // 去除回车符
  message.value = message.value.replace(/^\s+|\s+$/g, '')
  if (message.value) {
    emits('sendMessage', message.value)
  }
  setTimeout(() => {
    message.value = ''
  }, 0)
}

// 系列功能
let icons = ref([
  {
    type: 'smile',
    icon: 'icon-smile',
    tip: '表情',
  },
  {
    type: 'history',
    icon: 'icon-history',
    tip: '显示消息记录',
  },
])
</script>

<style scoped lang="less">
.content {
  flex: 3;
  background-color: #e6f8fa;

  .window {
    height: 65%;
    width: 100%;
    overflow: auto;
    background-color: #e6f8fa;
  }

  .write {
    position: relative;
    height: 35%;
    border-top: 1px solid #d5e6e8;

    .emoji {
      box-sizing: border-box;
      height: 20%;

      ul {
        display: flex;
        padding: 5px 5px;

        li {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30px;
          height: 30px;
          margin-left: 6px;
          font-size: 20px;
          opacity: 0.7;

          &:hover {
            cursor: pointer;
            background-color: #d9eaec;
          }
        }
      }
    }

    .text {
      // background-color: pink;
      height: 50%;
      :deep(.el-textarea) {
        height: 100%;
        .el-textarea__inner {
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
            background: #c2d1d2;
            border-radius: 8px;
          }
        }
      }
    }

    .send {
      position: absolute;
      right: 10px;
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
</style>
