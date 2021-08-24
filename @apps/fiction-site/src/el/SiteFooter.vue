<template>
  <footer aria-labelledby="footerHeading">
    <h2 id="footerHeading" class="sr-only">Footer</h2>

    <div class="max-w-7xl mx-auto py-12 px-8 lg:py-16 lg:px-8">
      <div
        class="text-center items-center space-x-4 space-y-4 pt-8 text-color-500"
      >
        <span class="text-gray-100"
          >Directions: 950 Glenneyre St. Laguna Beach, CA 92651</span
        >
        <span class="block text-gray-500">
          &copy; 2021
          <a
            href="https://www.fiction.com"
            target="_blank"
            class="hover:text-gray-500"
            >Fiction Inc.</a
          >
          All rights reserved.
        </span>
      </div>
      <div class="flex justify-center items-center mt-16 text-primary-500">
        <svg
          class="w-8 h-8 app-logo"
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="`0 0 123 123`"
          fill="currentColor"
        >
          <path
            d="M105.45 122.22H52.5301C50.8427 122.222 49.1715 121.89 47.6131 121.243C46.0546 120.596 44.6397 119.647 43.4501 118.45L3.12009 78.12C1.63379 76.6368 0.621044 74.7458 0.210077 72.6866C-0.20089 70.6274 0.0084061 68.4925 0.811465 66.5523C1.61452 64.6122 2.97523 62.9539 4.7213 61.7875C6.46737 60.6211 8.52027 59.999 10.6201 60.0001H60.0201V10.5901C60.0285 8.50129 60.6549 6.46175 61.8206 4.72845C62.9862 2.99516 64.6388 1.64567 66.5701 0.850054C68.5115 0.0599857 70.6418 -0.144172 72.6979 0.26279C74.7541 0.669752 76.646 1.67001 78.1401 3.14005L118.45 43.4201C119.645 44.6146 120.593 46.0334 121.238 47.595C121.883 49.1566 122.213 50.8304 122.21 52.5201V105.42C122.205 109.867 120.439 114.131 117.298 117.28C114.157 120.428 109.897 122.204 105.45 122.22V122.22ZM54.7501 104.04H104.08V54.7201L78.2001 28.8501V78.1801H28.8801L54.7501 104.04Z"
            class="a"
          />
        </svg>
      </div>
    </div>
  </footer>
</template>
<script lang="ts">
import { emitEvent } from "@factor/api"
import { ref } from "vue"

export default {
  components: {},
  setup() {
    const bottomSocial = ref([
      {
        path: "https://bit.ly/3olVCKP",
        text: "LinkedIn",
        icon: `<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 7.557h5.349V24H0zM20 7.75c-.057-.018-.111-.037-.17-.054s-.144-.03-.217-.042a4.793 4.793 0 00-.96-.1 7.431 7.431 0 00-5.748 3.144V7.557H7.557V24h5.349v-8.969s4.042-5.63 5.748-1.495V24h5.347V12.9A5.333 5.333 0 0020 7.75z" fill="currentColor"/> <circle cx="3" cy="3" r="3" fill="currentColor"/></svg>`,
      },
      {
        path: "https://bit.ly/2YhnEfX",
        text: "Facebook",
        icon: `<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24"><path d="M7.5 8.25v-3A1.5 1.5 0 019 3.75h1.5V0h-3A4.5 4.5 0 003 4.5v3.75H0V12h3v12h4.5V12h3L12 8.25z" fill="currentColor"/></svg>`,
      },
    ])

    const bottomText = ref(
      `&copy; 2021 <a href="https://www.fiction.com" target="_blank" class="hover:text-gray-500">Fiction Inc.</a> All rights reserved. Directions: 950 Glenneyre St. Laguna
          Beach, CA 92651`,
    )

    return {
      bottomText,
      bottomSocial,
      emitEvent,
    }
  },
}
</script>
