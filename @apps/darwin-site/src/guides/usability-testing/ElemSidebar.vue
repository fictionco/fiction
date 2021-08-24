<template>
  <div
    class="
      fixed
      z-40
      inset-0
      flex-none
      h-full
      bg-opacity-25
      w-full
      lg:bg-white lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-60
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
        bg-white
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
          <li class="mt-4">
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
              Usability testing
            </h5>
          </li>
          <li v-for="(item, index) in Nav" :key="index" class="flex">
            <router-link
              :to="item.path"
              class="
                w-full
                flex
                items-center
                px-3
                py-2
                rounded-md
                transition-colors
                duration-200
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
import { ref } from "vue"

export default {
  components: {},
  setup() {
    const Nav = ref([
      {
        name: "Usability testing guide",
        path: "/guides/usability-testing",
      },
      {
        name: "Usability testing methods",
        path: "/guides/usability-testing/methods",
      },
      {
        name: "Usability testing questions",
        path: "/guides/usability-testing/questions",
      },
      {
        name: "Analyze results",
        path: "/guides/usability-testing/analyze",
      },
    ])

    return { Nav }
  },
}
</script>
