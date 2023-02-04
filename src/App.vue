<template>
  <div class="web_chat">
    <router-view></router-view>
  </div>
</template>

<script setup>
import ChatApp from './components/ChatApp.vue'
</script>

<style scoped lang="less">
.web_chat {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: fixed;
  background: url('./assets/images/bgc.jpg') no-repeat center;
  background-size: cover;
}
</style>
