<template>
  <div class="chat_window"></div>
</template>

<script setup>
// import { io } from 'socket.io-client'
// const socket = io() // 因为在 vite.config.js 文件中配置了代理，所以可以视为同域

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
  width: 70%;
  height: 60%;
  background-color: #ffedde;
}
</style>
