<script lang="ts" setup>
import { displayDateTime, vue } from '@factor/api'
import ElPanel from '@factor/ui/ElPanel.vue'
import ElZeroBanner from '@factor/ui/ElZeroBanner.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElLightbox from '../../ui/ElLightbox.vue'
import type { Render, RenderImage } from '../model'
import { useFictionApp } from '../../util'
import ElImage from '../../ui/ElImage.vue'

const props = defineProps({
  renders: {
    type: Array as vue.PropType<Render[]>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'refresh', payload: string): void
}>()

const { factorRouter, fictionModel } = useFictionApp()

vue.computed<string>({
  get: () => factorRouter.params.value.modelId as string,
  set: val => factorRouter.goto('renderCreate', { modelId: val }),
})

const deletingRender = vue.ref('')
const allImages = vue.computed(() => {
  const images: RenderImage[] = []
  props.renders.forEach((render) => {
    render.imagesFull.value.forEach(image => images.push(image))
  })
  return images
})
const selectedImage = vue.ref(-1)

function getImageIndex(image: RenderImage) {
  return allImages.value.findIndex(i => i.url === image.url)
}

function getRenderDetails(render: Render) {
  const c = render.renderConfig.value
  return [
    { name: 'Prompt', value: c.prompt, classes: 'col-span-12' },
    { name: 'Steps', value: c.numInferenceSteps },
    { name: 'Guidance', value: c.guidanceScale },
    { name: 'Seed', value: c.seed },
    { name: 'Aspect', value: c.aspect },
    { name: 'Negative Prompt', value: c.negativePrompt, isAdvanced: true },
    { name: 'Dimensions', value: `${c.width}px x ${c.height}px`, isAdvanced: true },
    { name: 'Status', value: render.status.value, isAdvanced: true },
    { name: 'RenderId', value: `${render.renderId}`, isAdvanced: true },
    { name: 'Model', value: render.modelId, isAdvanced: true },
    { name: 'No. Outputs', value: c.numOutputs, isAdvanced: true },
    { name: 'Concept Tag', value: c.conceptTag, isAdvanced: true },
    { name: 'Author', value: render.userId, isAdvanced: true },
  ].filter(_ => !_.isAdvanced || render.showDetails.value)
}

async function deleteRender(renderId: string) {
  deletingRender.value = renderId
  await fictionModel.requests?.ManageRender.projectRequest({
    _action: 'delete',
    renderConfig: { renderId },
  })
  emit('refresh', renderId)
  deletingRender.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <TransitionGroup name="list">
      <slot />
      <template v-if="renders.length > 0">
        <ElPanel
          v-for="render in renders"
          :id="`render-${render.renderId}`"
          :key="render.renderId"
          :title="`Created ${displayDateTime(render.createdAt)}`"
          class=" "
          :actions="[
            {
              name: 'Delete',
              btn: 'default',
              size: 'sm',
              onClick: () => deleteRender(render.renderId),
              loading: deletingRender === render.renderId,
            },
          ]"
        >
          <div class="space-y-6">
            <div class="grid grid-cols-12 gap-3 md:gap-8">
              <ElImage
                v-for="(image, i) in render.imagesFull.value"
                :key="i"
                class="4xl:col-span-4 col-span-6"
                :image="image"
                @click.stop="selectedImage = getImageIndex(image)"
              />
            </div>

            <div class="grid grid-cols-12 gap-6 text-xs">
              <div
                v-for="(item, i) in getRenderDetails(render)"
                :key="i"
                :class="
                  item.classes ? item.classes : 'col-span-12 lg:col-span-3'
                "
              >
                <dt class="font-semibold">
                  {{ item.name }}
                </dt>
                <dd class="text-theme-900 mt-1 sm:col-span-2 sm:mt-0">
                  {{ item.value }}
                </dd>
              </div>
            </div>
            <div v-if="!render.showDetails.value">
              <ElButton
                class=""
                btn="default"
                size="xs"
                @click="render.showDetails.value = true"
              >
                More Details
              </ElButton>
            </div>
          </div>
        </ElPanel>
      </template>
      <ElPanel v-else title="Render Images">
        <ElZeroBanner
          title="No images yet"
          description="You haven't generated any images yet. Use the render form to generate with this model."
        />
      </ElPanel>
    </TransitionGroup>
    <ElLightbox
      v-model:selected="selectedImage"
      :images="allImages"
    />
  </div>
</template>

<style lang="less">
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
