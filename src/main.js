import { createApp } from 'vue'
import App from './App.vue'
import drag from './utils/v-drag'
import router from './router'
import './assets/css/common.less'

const app = createApp(App)
app.use(router)
// 注册自定义指令
app.directive('drag', drag)

app.mount('#app')
