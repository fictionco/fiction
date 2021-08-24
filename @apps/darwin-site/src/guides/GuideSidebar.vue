<template>
  <div
    class="
      fixed
      z-10
      inset-0
      flex-none
      h-full
      bg-opacity-25
      w-full
      lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-60
      xl:w-72
      lg:block
      hidden
    "
  >
    <div
      id="navWrapper"
      class="
        rounded-lg
        shadow-xl
        ring-1 ring-black ring-opacity-5
        overflow-y-auto
        scrolling-touch
        overflow-hidden
        lg:shadow-none
        lg:ring-0
        lg:h-auto
        lg:block
        lg:sticky
        lg:bg-transparent
        lg:top-0
      "
    >
      <div
        class="
          hidden
          lg:block
          h-12
          pointer-events-none
          absolute
          inset-x-0
          z-10
          bg-gradient-to-b
          from-white
        "
      />
      <nav
        class="
          px-1
          pt-6
          overflow-y-auto
          font-normal
          text-base
          sm:px-3
          xl:px-5
          lg:text-sm
          pb-10
          lg:pt-10 lg:pb-14
          sticky
        "
      >
        <ul>
          <li class="mb-10">
            <router-link
              to="/guides"
              class="
                flex
                items-center
                px-3
                py-2
                rounded-md
                hover:text-primary-500 hover:bg-light-50
              "
            >
              <ElemHoverArrow direction="left" size="large" /> Guides
            </router-link>
          </li>
          <li>
            <h5
              class="
                px-3
                mb-3
                lg:mb-3
                text-sm
                font-medium
                text-bluegray-500
                tracking-wider
                uppercase
              "
            >
              {{ title }}
            </h5>
          </li>
          <li v-for="(item, index) in menu" :key="index" class="flex">
            <router-link
              :to="item.route"
              class="
                w-full
                flex
                items-center
                px-3
                py-2
                rounded-md
                hover:text-primary-500 hover:bg-light-50
              "
              >{{ item.name }}</router-link
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { MenuItem } from "@factor/types"
import { PropType, ref } from "vue"

import ElemHoverArrow from "../_global/ElemHoverArrow.vue"

export default {
  components: {
    ElemHoverArrow,
  },
  props: {
    title: { type: String, default: "" },
    menu: { type: Array as PropType<MenuItem[]>, default: () => [] },
  },
  setup() {
    const Nav = ref([
      {
        name: "User experience guide",
        path: "/guides/user-experience",
      },
      {
        name: "UX stats and trends",
        path: "/guides/user-experience/stats-and-trends",
      },
      {
        name: "Analyze and measure",
        path: "/guides/user-experience/analyze",
      },
      {
        name: "Improve UX",
        path: "/guides/user-experience/improve-strategy",
      },
    ])

    return { Nav }
  },
}
</script>
