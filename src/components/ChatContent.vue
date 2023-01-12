<template>
  <div
    :class="{
      c_receive: !props.isSend,
      c_send: props.isSend
    }"
  >
    <span>开心！</span>
  </div>
</template>

<script setup>
let props = defineProps(['isSend'])
</script>

<style scoped lang="less">
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
    background-color: #cedee0;
    clip-path: polygon(100% 0, 0 100%, 0 20%);
  }
}
</style>
