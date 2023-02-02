<template>
  <div class="content">
    <div class="window">
      <BubbleFrame
        v-for="msg in props.message"
        :key="msg._id"
        :isSend="msg.from?.name === currentUser"
        :content="msg.content"
      />
    </div>
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
</template>

<script setup>
import BubbleFrame from './BubbleFrame.vue'

let props = defineProps(['message'])

let test = ref('')
let currentUser = ref('xiao')
</script>

<style scoped lang="less">
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
