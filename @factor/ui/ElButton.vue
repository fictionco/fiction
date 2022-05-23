<template>
  <component
    :is="to ? 'router-link' : href ? 'a' : 'button'"
    :to="to"
    class="relative select-none items-center rounded-lg border font-medium ring-offset-2 focus:outline-none focus:ring-2"
    :class="btnClass"
    :href="href"
  >
    <transition v-if="loading" name="fade">
      <div class="absolute left-0 flex w-full items-center justify-center">
        <svg
          class="h-4 w-4 animate-spin"
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
<script lang="ts" setup>
import { vue } from "@factor/api"
const props = defineProps({
  loading: { type: [Boolean, String], default: false },
  btn: {
    type: String as vue.PropType<
      | "primary"
      | "default"
      | "input"
      | "danger"
      | "warning"
      | "green"
      | "subtle"
      | "secondary"
      | "outline"
      | "outlineWhite"
    >,
    required: true,
  },
  size: {
    type: String as vue.PropType<"xs" | "sm" | "md" | "lg">,
    default: "",
  },
  to: { type: String, default: "" },
  href: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  format: {
    type: String as vue.PropType<"block" | "inline">,
    default: "inline",
  },
})
const btnClass = vue.computed(() => {
  const btn = props.btn

  let out = ""

  if (btn == "danger") {
    out =
      "text-red-600 bg-white hover:bg-red-600 focus:ring-red-600 border-red-600 hover:text-white"
  } else if (btn == "warning") {
    out =
      "text-orange-500 bg-white hover:bg-orange-500 focus:ring-orange-500 border-orange-500 hover:text-white"
  } else if (btn == "secondary") {
    out =
      "text-primary-600 bg-primary-50 hover:bg-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500 border-primary-50 hover:border-primary-500"
  } else if (btn == "primary") {
    out =
      "text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-100 border-primary-500"
  } else if (btn == "outline") {
    out =
      "text-primary-500  hover:bg-primary-50 focus:ring-primary-100 border-primary-500"
  } else if (btn == "outlineWhite") {
    out =
      "text-white hover:bg-white bg-opacity-05 focus:ring-white border-white"
  } else if (btn == "green") {
    out =
      "text-green-600 bg-green-50 hover:bg-green-500 hover:bg-green-500 hover:text-white focus:ring-green-500 border-green-50 hover:border-green-500"
  } else if (btn == "subtle") {
    out =
      "border-slate-200 text-slate-500  hover:border-slate-400 focus:ring-primary-100"
  } else if (btn == "input") {
    out =
      "border-input-edge text-input-body bg-input-base hover:bg-input-base-alt focus:ring-primary-100"
  } else {
    out =
      "border-slate-300 text-slate-700 bg-white hover:border-slate-400 focus:ring-primary-100"
  }

  let sizeClasses = "px-2.5 py-1.5 text-sm"
  if (props.size == "md") {
    sizeClasses = "px-3 py-1.5 text-base"
  } else if (props.size == "sm") {
    sizeClasses = "px-2 py-1 text-xs"
  } else if (props.size == "xs") {
    sizeClasses = "px-2 py-1 text-xs"
  } else if (props.size == "lg") {
    sizeClasses = "px-4 py-2 text-base rounded-md"
  }

  let formatClasses = "inline-flex"
  if (props.format == "block") {
    formatClasses = "flex justify-center w-full"
  }

  out += ` ${sizeClasses} ${formatClasses}`

  if (props.disabled) {
    out = btnClass.value + " opacity-40 cursor-not-allowed"
  }

  return out
})
</script>
