import { createApp } from 'vue'
import App from './App.vue'
import drag from './utils/v-drag'
// import router from './router'
import './assets/css/common.less'

const app = createApp(App)
// app.use(router)
app.directive('drag', drag)

app.mount('#app')
