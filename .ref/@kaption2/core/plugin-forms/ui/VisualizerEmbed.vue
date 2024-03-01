<script setup lang="ts">
import { vue } from '@factor/api'
import { setup } from '../../plugin-embed/tag'
import { useKaption } from '../../utils/inject'
import type { EmbedMode, EmbedTrigger } from '../../plugin-embed/util'

const { factorRouter, kaptionForms } = useKaption()

const mode = vue.computed<EmbedMode>(() => {
  return (factorRouter.query.value.mode || 'inline') as EmbedMode
})

const trigger = vue.computed<EmbedTrigger>(() => {
  return (factorRouter.query.value.trigger || 'click') as EmbedTrigger
})

const embedUrl = vue.computed(() => {
  const urlString = kaptionForms.getFormUrl(
    factorRouter.params.value.formId as string,
  )
  const url = new URL(urlString)

  url.search = new URLSearchParams(
    factorRouter.query.value as Record<string, string>,
  ).toString()

  return url.toString()
})

vue.onMounted(async () => {
  const tag = await setup({ project: { projectId: 'example' } })

  await tag.init()
})
</script>

<template>
  <div
    class="mx-auto my-24 max-w-3xl px-6 text-left font-sans text-theme-700 md:px-12"
  >
    <div class="text-center">
      <h1 class="text-6xl font-bold capitalize tracking-tight">
        {{ mode }}
      </h1>
      <div
        class="my-2 text-2xl font-bold uppercase tracking-wide text-theme-300"
      >
        Example Website
      </div>
    </div>

    <div class="space-y-4 text-2xl">
      <div class="mt-12 text-theme-400">
        <div class="my-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec aliquet
          urna turpis, nec sodales lorem lobortis at.
        </div>
        <div class="my-8 text-center">
          <button
            type="button"
            class="inline-flex items-center rounded-full border border-transparent bg-theme-600 px-12 py-5 text-2xl font-semibold text-white shadow-lg hover:bg-theme-700"
            :data-kaption-embed="embedUrl"
          >
            Launch Form
          </button>
        </div>
        <div class="my-6">
          Ut iaculis mi tellus, id porttitor sapien interdum eu. In et iaculis
          urna, tristique consequat purus. Nulla gravida tortor non viverra
          rutrum. Donec tincidunt porttitor fringilla.
        </div>

        <div class="my-6">
          Nam id ante augue. Suspendisse faucibus sodales purus ut gravida. Sed
          pulvinar dui id augue imperdiet, vitae euismod velit faucibus. Ut
          cursus ultrices massa lacinia vulputate.
        </div>
      </div>
    </div>
  </div>
</template>
