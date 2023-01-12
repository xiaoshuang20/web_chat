<template>
  <div
    :class="{
      receive: !props.isSend,
      send: props.isSend
    }"
  >
    <div class="chat-bubble-avatar" v-if="!props.isSend">
      <el-avatar :size="40" :src="circleUrl" />
    </div>
    <div class="chat-bubble-msg">
      <div class="chat-bubble-time"></div>
      <div class="chat-bubble-text">
        <ChatContent :isSend="props.isSend" />
      </div>
    </div>
    <div class="chat-bubble-avatar" v-if="props.isSend">
      <el-avatar :size="40" :src="circleUrl" />
    </div>
  </div>
</template>

<script setup>
import circleUrl from '@/assets/images/avatar.jpg'
import ChatContent from './ChatContent.vue'

let props = defineProps(['isSend'])
</script>

<style scoped lang="less">
.receive {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  //   background-color: pink;

  .chat-bubble-avatar {
    padding-left: 10px;
  }
}

.send {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: right;
  //   background-color: pink;

  .chat-bubble-avatar {
    padding-right: 10px;
  }
}
</style>
