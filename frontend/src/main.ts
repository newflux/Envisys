import { createApp } from 'vue'
import './assets/icomat.css'
import './assets/style.css'
import App from './App.vue'
import Tres from '@tresjs/core'

const app = createApp(App)
app.use(Tres)
app.mount('#app')

// The scroll timeline binds to DOM nodes once, so a hot-swapped component would be left
// orphaned (invisible). In dev, reload the whole page after every update instead.
if (import.meta.hot) import.meta.hot.on('vite:afterUpdate', () => location.reload())

