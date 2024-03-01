import { vue } from '@factor/api'
import '@unocss/reset/tailwind.css'
import { setup } from '../../tag'
import App from './App.vue'

vue.createApp(App).mount('#app')

const tag = await setup({ organization: { organizationId: 'example' } })

await tag.init()
