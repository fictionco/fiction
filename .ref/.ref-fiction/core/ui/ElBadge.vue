<script lang="ts" setup>
import { vue } from '@factor/api'

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
      | string
    >,
    default: '',
  },
  size: {
    type: String as vue.PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
    default: '',
  },
  to: { type: String, default: '' },
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
  let out = ''
  if (props.btn === 'danger') {
    out = 'bg-theme-700 text-theme-200 hover:bg-theme-800 hover:text-theme-100'
  }
  else if (props.btn === 'caution') {
    out
      = 'bg-caution-100 text-caution-600 hover:bg-caution-200 hover:text-caution-700'
  }
  else if (props.btn === 'primary') {
    out
      = 'bg-primary-700 text-primary-200 hover:bg-primary-800 hover:text-primary-100'
  }
  else if (props.btn === 'success') {
    out
      = 'bg-success-100 text-success-700 hover:bg-success-200 hover:text-success-800'
  }
  else if (props.btn === 'theme') {
    out = 'bg-theme-700 text-theme-200 hover:bg-theme-800 hover:text-theme-100'
  }
  else if (props.btn === 'naked') {
    out = ''
  }
  else {
    out = 'bg-theme-100 text-theme-500 hover:bg-theme-200 hover:text-theme-700'
  }

  if (props.size === 'xs')
    out += ' px-3 py-0.5 text-xs'
  else if (props.size === 'xl')
    out += ' px-8 py-2 text-xl'
  else
    out += ' px-4 py-1.5 text-sm'

  return out
})
</script>

<template>
  <component
    :is="
      to || (href && !href?.includes('http'))
        ? 'router-link'
        : href
          ? 'a'
          : 'div'
    "
    :to="to || href"
    class="inline-block whitespace-nowrap rounded-full font-semibold capitalize tracking-tight"
    :href="href"
    :class="btnClass"
  >
    <slot />
  </component>
</template>
