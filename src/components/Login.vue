<template>
  <div class="login">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>欢迎来到 web_chat</h2>
        </div>
      </template>
      <div class="avatar">
        <el-avatar :size="80" :src="circleUrl" />
      </div>
      <div class="input">
        <el-input v-model="body.username" placeholder="用户名">
          <template #prefix>
            <Epuser />
          </template>
        </el-input>
        <el-input v-model="body.password" placeholder="密码" type="password">
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
import circleUrl from '@/assets/images/avatar.jpg'
import api from '@/api/login'
import { message } from '@/utils'
import { useRouter } from 'vue-router'

const router = useRouter()

let body = ref({
  username: '',
  password: '',
})

// 注册
let loading = ref(false)
const register = async () => {
  loading.value = true
  let res = await api.register(body.value)
  if (res.data.type === 'success') {
    message.success('注册成功')
    // 持续性存储
    window.sessionStorage.setItem(
      'current_user',
      JSON.stringify({
        ...body.value,
        id: res.data.id,
      })
    )
    router.push('/chat')
  } else {
    message.warn('可恶, 这个名称被人抢先一步占了(ノ｀Д)ノ')
  }
  loading.value = false
}

// 登录
let loading1 = ref(false)
const login = async () => {
  let res = await api.login(body.value)
  console.log(res)
  if (res.data !== 'fail') {
    message.success('登录成功，欢迎回来~')
    // 持续性存储
    window.sessionStorage.setItem(
      'current_user',
      JSON.stringify({
        ...body.value,
        id: res.data.objectId,
      })
    )
    router.push('/chat')
  } else {
    message.error('啊哦, 出了点小问题')
  }
  loading.value = false
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
