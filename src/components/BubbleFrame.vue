<template>
  <div
    :class="{
      receive: !props.isSend,
      send: props.isSend,
    }"
  >
    <div class="chat-bubble-avatar" v-if="!props.isSend">
      <el-avatar :size="40" :src="msg.to.avatarUrl" />
    </div>
    <div
      class="chat-bubble-msg"
      @mouseenter="handleHover"
      @mouseleave="handleLeave"
    >
      <p class="chat-bubble-time" v-show="showHistoryTime">
        {{ historyTime(props.msg.currentTime) }}
      </p>
      <div class="chat-bubble-text">
        <div
          :class="{
            c_receive: !props.isSend,
            c_send: props.isSend,
          }"
        >
          <ChatContent :msg="props.msg.content" />
        </div>
      </div>
    </div>
    <div class="chat-bubble-avatar" v-if="props.isSend">
      <el-avatar :size="40" :src="msg.from.avatarUrl" />
    </div>
  </div>
</template>

<script setup>
import ChatContent from './ChatContent.vue'
import { historyTime } from '@/utils'

let props = defineProps(['isSend', 'msg'])

// 显示消息发送的时间
let showHistoryTime = ref(false)
let timer
const handleHover = () => {
  timer = setTimeout(() => {
    showHistoryTime.value = true
  }, 800)
}
const handleLeave = () => {
  showHistoryTime.value = false
  clearTimeout(timer)
}
</script>

<style scoped lang="less">
.receive {
  width: 100%;
  margin-top: 14px;
  display: flex;
  align-items: center;

  .chat-bubble-avatar {
    padding-left: 10px;
  }

  .chat-bubble-msg {
    position: relative;

    .chat-bubble-time {
      position: absolute;
      top: -12px;
      left: 12px;
      white-space: nowrap;
      font-size: 12px;
      color: #a796b8;
    }

    .c_receive {
      box-sizing: border-box;
      position: relative;
      height: 40px;
      padding: 0 12px;
      line-height: 40px;
      margin-left: 12px;
      margin-top: 5px;
      border-radius: 7px;
      background-color: #cedee0;

      &::before {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        left: -7px;
        top: 10px;
        background-color: #cedee0;
        clip-path: polygon(0 0, 100% 100%, 100% 20%);
      }
    }
  }
}

.send {
  width: 100%;
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: right;

  .chat-bubble-avatar {
    padding-right: 10px;
  }

  .chat-bubble-msg {
    position: relative;

    .chat-bubble-time {
      position: absolute;
      top: -12px;
      right: 12px;
      white-space: nowrap;
      font-size: 12px;
      color: #a796b8;
    }

    .c_send {
      box-sizing: border-box;
      position: relative;
      height: 40px;
      padding: 0 12px;
      line-height: 40px;
      margin-right: 12px;
      margin-top: 5px;
      border-radius: 7px;
      color: #f7f9fd;
      background-color: #12b7f5;

      &::before {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        right: -7px;
        top: 10px;
        background-color: #12b7f5;
        clip-path: polygon(100% 0, 0 100%, 0 20%);
      }
    }
  }
}

.emoji-img {
  height: 100%;
  :deep(img) {
    width: 27px;
    height: 27px;
    vertical-align: middle;
  }
}
</style>
