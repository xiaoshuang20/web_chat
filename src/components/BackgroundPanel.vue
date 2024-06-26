<template>
  <div class="content">
    <div class="window" ref="window">
      <BubbleFrame
        v-for="(msg, index) in props.message"
        :key="index"
        :isSend="msg.from?.objectId === props.currentUser.objectId"
        :msg="msg"
      />
    </div>
    <div class="write">
      <div class="expand">
        <ul>
          <el-popover
            v-for="(item, index) in icons"
            :key="index"
            placement="bottom-start"
            trigger="hover"
            :content="item.tip"
            :hide-after="0"
            :show-after="500"
          >
            <template #reference>
              <li
                @click="handleExpand(item)"
                class="iconfont"
                :class="[item.icon]"
              ></li>
            </template>
          </el-popover>
        </ul>
      </div>
      <!-- contenteditable -->
      <div class="text">
        <el-input
          type="textarea"
          v-model="message"
          @keydown.enter.stop="sendMessage"
          ref="input"
        />
      </div>
      <div class="send">
        <el-button @click="sendMessage">
          发送
          <EpPromotion class="icon" />
        </el-button>
      </div>
      <Transition name="emoji">
        <el-card class="emoji" v-show="isShowEmoji">
          <ul class="expression-list">
            <li
              v-for="item in expressions"
              :key="item.title"
              @click.stop="chooseEmoji(item.title)"
            >
              <img :src="getAssetsFile(item.url)" alt="" />
            </li>
          </ul>
        </el-card>
      </Transition>
    </div>
    <input type="file" ref="photo" v-show="false" @change="selectImage" />
  </div>
</template>

<script setup>
import BubbleFrame from './BubbleFrame.vue'
import { expressions, getAssetsFile } from '@/utils'

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

// 窗口滚动条
const isScroll = computed(() => (el) => {
  if (el.scrollHeight > el.clientHeight) {
    return true
  } else {
    return false
  }
})
// 最新消息自动滚动
const scroll = () => {
  // 接收到新的消息时保持滚动条在最底部
  nextTick(() => {
    window.value.scrollTop = window.value.scrollHeight
  })
}
defineExpose({ scroll }) // 将该事件暴露出去
// 监听消息添加/输入事件
let timer = null
const input = ref()
const window = ref()
watchEffect(() => {
  // 这里只会触发一次（疑惑：props.message变化监听不到？）
  scroll()
  if (props.message && window.value) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // 这样会触发回流，但没办法，未出现滚动条时 hover 不能生效
      if (isScroll.value(window.value)) {
        window.value.setAttribute('_scroll', true)
      } else {
        window.value.setAttribute('_scroll', false)
      }
    }, 200)
  }
})
watch(message, () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    // 这样会触发回流，但没办法，未出现滚动条时 hover 不能生效
    if (isScroll.value(input.value.textarea)) {
      input.value.textarea.setAttribute('_scroll', true)
    } else {
      input.value.textarea.setAttribute('_scroll', false)
    }
  }, 800)
})

// 系列功能
let icons = ref([
  {
    type: 'emoji',
    icon: 'icon-smile',
    tip: '表情',
  },
  {
    type: 'photo',
    icon: 'icon-img',
    tip: '图片',
  },
  {
    type: 'history',
    icon: 'icon-history',
    tip: '显示消息记录',
  },
])
const handleExpand = (data) => {
  switch (data.type) {
    case 'emoji':
      handleEmoji()
      break
    case 'photo':
      handlePhoto()
      break
    case 'history':
      break
    default:
      break
  }
}
// 表情栏
let isShowEmoji = ref(false)
const handleEmoji = () => {
  isShowEmoji.value = !isShowEmoji.value
  if (isShowEmoji.value) {
    document.addEventListener('click', closeEmojiCard, true)
  }
}
// 选择表情
const chooseEmoji = (data) => {
  message.value += data
  closeEmojiCard()
}
// 关闭表情卡片
const closeEmojiCard = (e) => {
  isShowEmoji.value = false
  document.removeEventListener('click', closeEmojiCard)
}
// 发送图片
const photo = ref()
const handlePhoto = () => {
  photo.value.click()
}
// 发送图片
const selectImage = (e) => {
  const reg = /\.(?:png|jpg|jepg)$/i
  let file = e.target.files[0]
  if (!reg.test(file.name)) {
    messageU.warn('请选择正确格式的图片文件!')
    return
  }
  let maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    messageU.warn('图片大小不能超过5M!')
    return
  }

  // 读 base64 编码
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = () => {
    let res = reader.result
    emits('uploadImg', res)
  }
}
// 历史记录（待定）
</script>

<style scoped lang="less">
.content {
  flex: 3;
  background-color: #e6f8fa;

  .window {
    box-sizing: border-box;
    height: 65%;
    width: 100%;
    padding-bottom: 12px;
    padding-right: 10px;
    padding-left: 10px;
    overflow: hidden;
    background-color: #e6f8fa;

    &[_scroll='true']:hover {
      overflow: auto;
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

  .write {
    position: relative;
    height: 35%;
    border-top: 1px solid #d5e6e8;

    .expand {
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
          padding: 0 10px;
          color: #666666;
          background-color: transparent;
          line-height: 20px;

          &[_scroll='true']:hover {
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

    .emoji {
      position: absolute;
      top: -225px;
      width: 346px;

      :deep(.el-card__body) {
        padding: 10px 0;
        padding-right: 8px;
        height: 200px;
        overflow-y: hidden;

        &:hover {
          overflow-y: auto;
          padding-right: 0;
        }

        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-thumb {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color: #cdcdcd;
        }

        &::-webkit-scrollbar-track {
          background-color: transparent;
        }

        ul {
          list-style: none;
          padding: 0 5px;
          margin-left: 8px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;

          li {
            width: 30px;
            height: 30px;
            padding: 5px;

            &:hover {
              background-color: #f3f3f4;
            }

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .emoji-enter-from,
    .emoji-leave-to {
      opacity: 0;
      top: -245px;
    }

    .emoji-enter-to,
    .emoji-leave-from {
      opacity: 1;
      top: -225px;
    }

    .emoji-enter-active,
    .emoji-leave-active {
      transition: all 0.5s ease;
    }
  }
}
</style>
