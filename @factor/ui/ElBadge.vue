<script lang="ts" setup>
import { getNavComponentType, vue } from '@factor/api'

const props = defineProps({
  loading: { type: [Boolean, String], default: false },
  btn: {
    type: String as vue.PropType<
      | 'danger'
      | 'caution'
      | 'success'
      | 'primary'
      | 'default'
      | 'theme'
      | 'naked'
    >,
    default: '',
  },
  size: {
    type: String as vue.PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
    default: '',
  },
  href: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  format: {
    type: String as vue.PropType<'block' | 'inline'>,
    default: 'inline',
  },
  rounded: {
    type: String as vue.PropType<'md' | 'lg' | 'full'>,
    default: '',
  },
})

const btnClass = vue.computed(() => {
  const base = {
    danger: 'bg-danger-100 text-danger-700 hover:bg-danger-200 hover:text-danger-800',
    caution: 'bg-caution-100 text-caution-600 hover:bg-caution-200 hover:text-caution-700',
    primary: 'bg-primary-700 text-primary-200 hover:bg-primary-800 hover:text-primary-100',
    success: 'bg-success-100 text-success-700 hover:bg-success-200 hover:text-success-800',
    theme: 'bg-theme-700 text-theme-200 hover:bg-theme-800 hover:text-theme-100',
    naked: '',
    default: 'bg-theme-100 text-theme-500 hover:bg-theme-200 hover:text-theme-700',
  }

  const size = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-6 py-2 text-base',
    xl: 'px-8 py-2 text-xl',
  }

  const baseClasses = base[props.btn]
  const sizeClasses = size[props.size]

  return [baseClasses, sizeClasses].join(' ')
})
</script>

<template>
  <component
    :is="getNavComponentType({ name: 'badge', href })"
    :to="href"
    :href="href"
    class="inline-block whitespace-nowrap rounded-full font-sans font-medium tracking-tight"
    :class="btnClass"
  >
    <slot />
  </component>
</template>
