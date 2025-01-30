import type { FictionAdminSettings } from '..'
import { Widget } from '@fiction/admin/dashboard/widget'
import { vue } from '@fiction/core'

export function getWidgets(_service: FictionAdminSettings) {
  const onboardWelcome = new Widget({
    key: 'onboardWelcome',
    title: 'Welcome to Fiction',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./WidgetVideo.vue')),
  })

  const overviewWidget = new Widget({
    key: 'overviewWidget',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./WidgetOverview.vue')),
  })

  return { onboardWelcome, overviewWidget }
}
