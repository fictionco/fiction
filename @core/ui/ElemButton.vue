<template>
  <component
    :is="href ? 'a' : to ? 'router-link' : 'button'"
    :to="to"
    :href="href"
    class="
      relative
      inline-flex
      items-center
      border
      rounded-md
      shadow-sm
      font-medium
      focus:outline-none focus:ring-2 focus:ring-offset-2
    "
    :class="btnClass"
  >
    <transition v-if="loading" name="fade">
      <div class="absolute left-0 w-full flex items-center justify-center">
        <svg
          class="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </transition>
    <span class="flex items-center" :class="loading ? 'opacity-0' : ''">
      <slot />
    </span>
  </component>
</template>
<script lang="ts">
import { computed, PropType } from "vue"
export default {
  props: {
    loading: { type: Boolean, default: false },
    btn: { type: String, default: "" },
    size: { type: String as PropType<"xs" | "sm" | "md" | "lg">, default: "" },
    to: { type: String, default: "" },
    href: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
  },
  setup(props) {
    const btnClass = computed(() => {
      let out = ""
      if (props.btn == "danger") {
        out =
          "text-red-500 bg-white hover:bg-red-500 focus:ring-red-500 border-red-500 hover:text-white"
      } else if (props.btn == "warning") {
        out =
          "text-orange-500 bg-white hover:bg-orange-500 focus:ring-orange-500 border-orange-500 hover:text-white"
      } else if (props.btn == "secondary") {
        out =
          "text-primary-600 bg-primary-50 hover:bg-primary-100 focus:ring-primary-500 border-primary-50 hover:border-primary-100"
      } else if (props.btn == "primary") {
        out =
          "text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 border-primary-500"
      } else if (props.btn == "green") {
        out =
          "text-green-600 bg-green-50 hover:bg-green-500 hover:bg-green-500 hover:text-white focus:ring-green-500 border-green-50 hover:border-green-500"
      } else if (props.btn == "outline") {
        out =
          "text-primary-500  hover:bg-primary-50 focus:ring-primary-500 border-primary-500"
      } else if (props.btn == "outlineWhite") {
        out = "text-white  hover:bg-white hover:bg-opacity-20 border-white"
      } else if (props.btn == "default") {
        out =
          "border-bluegray-300 text-bluegray-800 bg-white hover:bg-bluegray-50 focus:ring-primary-500"
      }

      let sizeClasses = "px-4 py-2 text-base "
      if (props.size == "md") {
        sizeClasses = "px-3 py-1.5 text-base"
      } else if (props.size == "sm") {
        sizeClasses = "px-3 py-2 text-base lg:px-2.5 lg:py-1.5 lg:text-sm"
      } else if (props.size == "xs") {
        sizeClasses = "px-2.5 py-1.5 text-sm lg:px-2 lg:py-1 lg:text-xs"
      } else if (props.size == "lg") {
        sizeClasses = "px-6 py-4 text-lg"
      }

      out += ` ${sizeClasses}`

      if (props.disabled) {
        out = out + " opacity-40 cursor-not-allowed"
      }

      return out
    })

    return { btnClass }
  },
}
</script>
