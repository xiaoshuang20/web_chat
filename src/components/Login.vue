<template>
  <div class="login">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>欢迎来到 web_chat</h2>
        </div>
      </template>
      <div class="avatar">
        <el-avatar :size="80" src="/static/img/avatar.jpg" />
      </div>
      <div class="input">
        <el-input v-model="body.name" placeholder="用户名">
          <template #prefix>
            <Epuser />
          </template>
        </el-input>
        <el-input
          v-model="body.password"
          placeholder="密码"
          type="password"
          @keydown.enter="login"
        >
          <template #prefix>
            <Eplock />
          </template>
        </el-input>
      </div>
      <div class="btn">
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="register"
          >注册</el-button
        >
        <el-button
          type="primary"
          size="large"
          :loading="loading1"
          class="login"
          @click="login"
          >登录</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { messageU } from '@/utils'
import { useRouter } from 'vue-router'
import { io } from 'socket.io-client'

const router = useRouter()
const socket = io()

onMounted(() => {
  socket.on('registerSuccess', registerSuccess)
  socket.on('registerFail', registerFail)
  socket.on('loginSuccess', loginSuccess)
  socket.on('loginFail', loginFail)
})

let body = ref({
  name: '',
  password: '',
})

// 注册
let loading = ref(false)
const register = async () => {
  loading.value = true
  socket.emit('register', body.value)
}
const registerSuccess = (data) => {
  window.sessionStorage.setItem('current_user', JSON.stringify(data))
  messageU.success('注册成功')
  router.push('/chat')
  loading.value = false
}
const registerFail = () => {
  messageU.warn('可恶, 这个名称被人抢先一步占了(ノ｀Д)ノ')
  loading.value = false
}

// 登录
let loading1 = ref(false)
const login = async () => {
  loading1.value = true
  socket.emit('login', body.value)
}
const loginSuccess = (data) => {
  window.sessionStorage.setItem('current_user', JSON.stringify(data))
  messageU.success('登录成功，欢迎回来~')
  router.push('/chat')
  loading1.value = false
}
const loginFail = () => {
  messageU.error('啊哦, 账号密码好像不对欸')
  loading1.value = false
}
</script>

<style scoped lang="less">
.box-card {
  width: 550px;
  border: none;
  background-color: #e6f8fa;

  :deep(.el-card__header) {
    display: flex;
    justify-content: center;
    height: 130px;
    background-image: linear-gradient(to right bottom, #01b0e9, #01e182);

    h2 {
      background: linear-gradient(135deg, #14ffe9, #ffeb3b, #ff00e0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  :deep(.el-card__body) {
    position: relative;
    .avatar {
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);

      img {
        transition: all 0.5s;
        &:hover {
          cursor: pointer;
          transform: rotate(360deg);
        }
      }
    }
    .input {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 30px;
      .el-input {
        width: 80%;
        margin-bottom: 20px;

        .el-input__wrapper {
          height: 40px;
          border-radius: 28px;
          font-size: 15px;
        }
      }
    }
    .btn {
      display: flex;
      justify-content: center;

      .el-button {
        width: 150px;
      }

      .login {
        margin-left: 30px;
      }
    }
  }
}
</style>
