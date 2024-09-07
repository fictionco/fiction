import { shortId, vue } from '@fiction/core'
import { setup } from '../../tag'
import App from './App.vue'
import '@unocss/reset/tailwind.css'

vue.createApp(App).mount('#app')

const tag = await setup({ orgId: 'example', siteId: 'example', beaconUrl: '#', anonymousId: shortId() })

await tag.init()
