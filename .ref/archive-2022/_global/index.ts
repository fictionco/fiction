import { defineAsyncComponent as def } from 'vue'

export const elements = {
  progressBar: def(() => import('../el/ElemProgressBar.vue')),
  page: def(() => import('../AppPage.vue')),
  zeroState: def(() => import('../el/ElemZeroState.vue')),
}
