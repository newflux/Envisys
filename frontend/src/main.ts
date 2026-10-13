import { createApp } from 'vue'
import './assets/icomat.css'
import './assets/style.css'
import App from './App.vue'
import Tres from '@tresjs/core'

const app = createApp(App)
app.use(Tres)
app.mount('#app')

