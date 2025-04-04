<script lang="ts" setup>
import type { Site } from '../../site'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import ElModalConfirm from '@fiction/ui/modal/ElModalConfirm.vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: [String], default: '' },
  inputClass: { type: String, default: '' },
  site: { type: Object as vue.PropType<Site>, required: true },
})

const showSetHomeModal = vue.ref(false)

async function setNewHomepage() {
  await props.site.setEditPageAsHome()
}

const isHome = vue.computed(() => props.modelValue === '_home')
</script>

<template>
  <div>
    <div class="space-y-2 mt-3">
      <div v-if="isHome">
        <XButton
          data-test-id="current-home"
          theme="green"
          design="outline"
          hover="none"
          size="xs"
          icon="i-tabler-home"
          rounding="full"
          @click.prevent
        >
          Current Home Page
        </XButton>
      </div>

      <div v-if="!isHome">
        <XButton
          rounding="full"
          data-test-id="set-to-home"
          tag="div"
          size="xs"
          icon="i-tabler-home"
          design="outline"
          theme="primary"
          @click.stop="showSetHomeModal = true"
        >
          Set As New Homepage
        </XButton>
        <ElModalConfirm
          v-model:vis="showSetHomeModal"
          title="Confirm New Homepage"
          sub="Sure you want to make this page the homepage?"
          @confirmed="setNewHomepage()"
        />
      </div>
    </div>
  </div>
</template>
