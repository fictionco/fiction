<template>
  <section class="">
    <div
      class="
        mx-auto
        max-w-lg
        md:max-w-7xl
        py-12
        lg:py-16
        px-4
        md:px-20
        lg:px-12
      "
    >
      <div class="text-center">
        <h2 class="text-4xl font-extrabold tracking-tight">Keep Exploring</h2>
        <p class="text-xl text-bluegray-500 py-4">
          There are hundreds of reasons you'll love Darwin
        </p>
      </div>
      <div class="pt-12 lg:pt-24">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <template v-for="(feature, i) in list" :key="i">
            <div class="block">
              <div
                class="w-6 h-6"
                :class="feature?.class"
                v-html="feature?.icon"
              />
              <router-link
                :to="feature?.path"
                class="
                  block
                  text-base
                  font-medium
                  my-2.5
                  hover:text-primary-500
                "
              >
                {{ feature?.name }}
              </router-link>
              <dd
                class="text-sm text-bluegray-500"
                v-html="feature?.description"
              />
              <div class="mt-4">
                <router-link
                  :to="feature?.path"
                  class="
                    block
                    text-bluegray-500
                    hover:text-primary-500
                    text-sm
                    font-medium
                  "
                  >Learn More &rarr;</router-link
                >
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { featuresList } from "../map"
import { computed } from "vue"
export default {
  components: {},
  props: {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    features: { type: Array, default: () => [] },
  },
  setup() {
    const list = computed(() => {
      return Object.values(featuresList).filter((_) => _.path)
    })
    return { list }
  },
}
</script>
