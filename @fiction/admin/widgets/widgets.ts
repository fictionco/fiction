import type { FictionAdminSettings } from '..'
import { Widget } from '@fiction/admin/dashboard/widget'
import { vue } from '@fiction/core'

export function getWidgets(_service: FictionAdminSettings) {
  const onboardWelcome = new Widget({
    key: 'onboardWelcome',
    title: 'Set yourself up for success',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./WidgetOnboard.vue')),
  })



  return { onboardWelcome }
}
