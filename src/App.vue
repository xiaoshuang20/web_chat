<template>
  <button @click="sendMsgToServer">发送消息给服务端</button>
</template>

<script setup>
import { io } from 'socket.io-client'
const socket = io() // 因为在 vite.config.js 文件中配置了代理，所以可以视为同域

onMounted(() => {
  initConnect()
})

const initConnect = () => {
  socket.on('pushMsg', (data) => {
    console.log(data)
  })
}

const sendMsgToServer = () => {
  console.log('click')
  socket.emit('sendMsg', 'xiaoshuang')
}
</script>

<style scoped lang="less"></style>
