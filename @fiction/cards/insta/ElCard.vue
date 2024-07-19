<script lang="ts" setup>
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import ElModal from '@fiction/ui/ElModal.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const vis = vue.ref(false)

vue.onMounted(async () => {

})
</script>

<template>
  <div>test</div>
</template>
