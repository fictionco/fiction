<script setup lang="ts">
import type { FictionAdmin } from '@fiction/admin'
import type { Card } from '@fiction/site/card'
import type { UserConfig } from './config'
import { useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'

const { card } = defineProps<{ card: Card<UserConfig> }>()
useService<{ fictionAdmin: FictionAdmin }>()

const uc = vue.computed(() => card.userConfig.value || {})
const isEditable = vue.computed(() => card.site?.isEditable.value)

// subscribe
const showSubscribeButton = vue.computed(() => !isEditable.value && !uc.value.hideSubscribe)
const isSubscribed = vue.computed(() => card.site?.activeContact?.value?.status === 'active')
</script>

<template>
  <XButton
    v-if="showSubscribeButton"
    :theme="isSubscribed ? 'default' : 'primary'"
    :design="isSubscribed ? 'ghost' : 'solid'"
    :href="isSubscribed ? undefined : `?_subscribe=1`"
    icon="i-tabler-thumbs-up"
  >
    {{ isSubscribed ? 'Subscribed' : 'Subscribe' }}
  </XButton>
</template>
