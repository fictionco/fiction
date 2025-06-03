<script lang="ts" setup>
import type { FictionAdmin } from '@fiction/admin'
import type { NavListItem } from '@fiction/core'
import { getFictionAuthUrl } from '@fiction/admin'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import NavMobileItem from './NavMobileItem.vue'
import NavMobilePanel from './NavMobilePanel.vue'

defineOptions({
  name: 'NavMobile',
})

const { vis, nav = [] } = defineProps<{
  vis: boolean
  nav?: NavListItem[]
}>()

const emit = defineEmits<{
  (event: 'update:vis', payload: boolean): void
}>()

const { fictionUser, fictionAdmin } = useService<{ fictionAdmin: FictionAdmin }>()
const user = vue.computed(() => fictionUser.activeUser?.value)

function closePanel() {
  emit('update:vis', false)
}
</script>

<template>
  <NavMobilePanel :vis @update:vis="emit('update:vis', $event)">
    <div class="p-6 pb-24 flex flex-col justify-center gap-16 h-full">
      <div class="grow-0 flex flex-col gap-8">
        <div v-if="nav.length" class="space-y-3">
          <ul class="space-y-3">
            <li v-for="(item, idx) in nav" :key="idx">
              <NavMobileItem
                :item
                @click="closePanel()"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="space-y-3 flex flex-col justify-end border-t border-theme-700 pt-8">
        <!-- Sign In Button (if not logged in) -->
        <div v-if="!user" class="pt-12">
          <XButton
            design="solid"
            theme="primary"
            rounding="md"
            size="lg"
            format="block"
            icon-after="i-tabler-arrow-right"
            data-test-id="mobile-sign-in-button"
            :href="getFictionAuthUrl({ fictionAdmin })"
          >
            Sign In
          </XButton>
        </div>
        <XButton
          v-else
          class="gap-1"
          design="solid"
          rounding="md"
          size="lg"
          :href="fictionAdmin.urls().dashboard"
        >
          <span class="flex items-center gap-1.5 ">
            <span><ElAvatar :user class="size-6" /></span>
            <span>Dashboard</span>
          </span>
        </XButton>
      </div>
    </div>
  </NavMobilePanel>
</template>
