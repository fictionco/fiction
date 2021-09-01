<template>
  <section>
    <div class="items-center lg:flex-row">
      <h2
        class="
          max-w-4xl
          text-3xl
          font-extrabold
          tracking-tight
          lg:text-6xl lg:pr-7
        "
      >
        {{ title }}
      </h2>
      <p
        class="
          max-w-4xl
          mt-8
          text-base text-bluegray-500
          leading-relaxed
          md:text-xl
        "
      >
        {{ content }}
      </p>
    </div>
    <div class="pt-12 lg:pt-24">
      <div class="flex flex-col justify-between w-full items-start lg:flex-row">
        <template v-for="(feature, i) in features" :key="i">
          <router-link
            :to="feature?.path ?? '/'"
            class="
              flex-1
              block
              mb-12
              lg:mb-0
              shadow-lg
              border border-bluegray-300
              rounded-lg
            "
            :class="i == 1 ? 'lg:mx-5' : ''"
          >
            <div
              class="
                p-6
                flex
                items-center
                space-x-3
                border-b border-bluegray-400
                justify-center
              "
            >
              <div
                class="w-6 h-6"
                :class="feature?.class"
                v-html="feature?.icon"
              />
              <div class="text-lg font-semibold">{{ feature?.name }}</div>
            </div>
            <div
              class="

                pt-6
                pl-6
                overflow-hidden
                bg-bluegray-100
                shadow-inner
                hover:bg-bluegray-50
              "
            >
              <img
                :src="feature?.thumb"
                :alt="`${feature?.name} Screenshot`"
                class="
                  -mb-48
                  xl:mb-0
                  w-full
                  shadow-xl
                  border-t border-l border-black border-opacity-10
                  rounded-tl-lg
                "
              />
            </div>
            <p
              class="
                px-4
                py-6
                text-center text-sm text-bluegray-500
                border-t border-bluegray-300
              "
            >
              {{ feature?.description }}
            </p>
          </router-link>
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { featuresList } from "../map"
import { computed, PropType } from "vue"
export default {
  components: {},
  props: {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    list: {
      type: Array as PropType<(keyof typeof featuresList)[]>,
      default: () => [],
    },
  },
  setup(props) {
    const features = computed(() => {
      return props.list.map((_) => featuresList[_])
    })
    return { features }
  },
}
</script>
