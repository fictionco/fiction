<script setup lang="ts">
import ElButton from '@kaption/core/ui/ElButton.vue'
import { vue } from '@factor/api'
import ImageRender from './ImageRender.vue'
import flowers from './flowers.jpg'
import flowers2 from './flowers2.jpg'
import ProModal from './ProModal.vue'

const proModalVis = vue.ref(false)
const features = vue.ref([
  {
    heading: 'Increase Search Traffic',
    description:
      'Use fiction to quickly generate content based on templates designed to be search-optimized.',
    bg: flowers2,
  },
  {
    heading: 'Convert More Visitors',
    description:
      'Fiction helps you create multiple versions of content that can be served to your audience in different contexts',
    bg: flowers,
  },
])

function showProModal() {
  proModalVis.value = true
}
</script>

<template>
  <div class="px-4">
    <div
      class="header flex flex-col justify-end bg-cover bg-center relative py-8"
    >
      <div class="flex justify-between items-center">
        <div class=" ">
          <div class="text-xl font-bold tracking-tight">
            Create mockups and designs with AI
          </div>
          <div class="sub font-normal">
            Use WayLight to quickly create new designs, mockups, staging and
            more.
          </div>
        </div>
        <div>
          <ElButton
            btn="primary"
            size="lg"
            @click.stop="showProModal()"
          >
            Upgrade to Pro
          </ElButton>
        </div>
      </div>
    </div>
    <div class="builder grid-cols-12 grid gap-12">
      <div class="col-span-3">
        <ImageRender />
      </div>
      <div class="col-span-9">
        <div class="font-bold text-lg mb-4">
          Latest Renders
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div
            v-for="(item, i) in features"
            :key="i"
            class="aspect-[4/3] bg-cover bg-center text-white p-4 relative overflow-hidden flex flex-col justify-end bg-black"
            :style="{ backgroundImage: `url(${item.bg})` }"
          >
            <div class="z-20 max-w-[90%]">
              <div class="font-medium">
                {{ item.heading }}
              </div>
            </div>
            <div
              class="bg-gradient-to-b from-black/0 to-black/60 absolute bottom-0 h-[100%] left-0 w-full z-0"
            />
          </div>
        </div>
      </div>
    </div>
    <ProModal v-model:vis="proModalVis" />
  </div>
</template>
