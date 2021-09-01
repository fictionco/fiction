<template>
  <section>
    <div class="mx-auto max-w-2xl px-4">
      <h2 class="text-3xl font-bold tracking-tight text-center sm:text-5xl">
        {{ title }}
      </h2>
      <p
        class="
          mt-8
          text-base text-bluegray-500
          leading-relaxed
          text-center
          md:text-xl
        "
      >
        {{ content }}
      </p>
    </div>
    <div class="max-w-screen-3xl m-auto my-12 lg:-mx-36">
      <div
        class="
          grid grid-cols-2
          justify-center
          items-center
          sm:grid-cols-3
          lg:flex lg:flex-wrap
        "
      >
        <template v-for="(integration, i) in integrations" :key="i">
          <router-link
            :to="integration?.path ?? '/docs/installation-guides'"
            class="
              block
              py-3
              lg:p-6
              mx-4
              my-4
              rounded-md
              transform
              transition-all
              hover:-translate-y-1 hover:shadow-2xl
            "
            :title="integration?.name"
          >
            <div
              class="
                flex
                items-center
                justify-center
                w-32
                mx-auto
                sm:w-full
                max-w-full
              "
              :class="integration?.class"
              v-html="integration?.logo"
            />
          </router-link>
        </template>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { integrationsList } from "../map"
import { computed, PropType } from "vue"
export default {
  components: {},
  props: {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    list: {
      type: Array as PropType<(keyof typeof integrationsList)[]>,
      default: () => [],
    },
  },
  setup(props) {
    const integrations = computed(() => {
      return props.list.map((_) => integrationsList[_])
    })
    return { integrations }
  },
}
</script>
