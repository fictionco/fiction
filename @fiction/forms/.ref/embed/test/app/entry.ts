import { vue } from '@factor/api'
import '@unocss/reset/tailwind.css'
import { setup } from '../../tag'
import App from './App.vue'

vue.createApp(App).mount('#app')

const tag = await setup({ project: { projectId: 'example' } })

await tag.init()
