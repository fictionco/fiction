<script lang="ts" setup>
import type { FictionAdmin } from '@fiction/admin'
import type { NavListItem } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { getFictionAuthUrl } from '@fiction/admin'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElAvatar from '@fiction/ui/common/ElAvatar.vue'
import NavMobileItem from './NavMobileItem.vue'
import NavMobilePanel from './NavMobilePanel.vue'
import SubscribeButton from './SubscribeButton.vue'

defineOptions({
  name: 'NavMobile',
})

const { vis, nav = [], card } = defineProps<{
  vis: boolean
  nav?: NavListItem[]
  card: Card<UserConfig>
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
  <NavMobilePanel :card :vis @update:vis="emit('update:vis', $event)">
    <div class="p-6 pb-32 flex flex-col justify-between gap-16 h-full">
      <div class="grow flex flex-col ">
        <SubscribeButton size="lg" rounding="md" :card icon-after="i-tabler-bolt" />
        <div v-if="nav.length" class="space-y-3 pt-6 mt-8">
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
      <div class="space-y-3 flex flex-col justify-end pt-8">
        <!-- Sign In Button (if not logged in) -->
        <div v-if="!user" class="pt-12">
          <XButton
            design="solid"
            theme="default"
            rounding="md"
            size="lg"
            format="block"
            data-test-id="mobile-sign-in-button"
            :href="getFictionAuthUrl({ fictionAdmin })"
            icon="i-tabler-north-star"
          >
            Sign In to Fiction
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
