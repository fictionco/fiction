<script setup lang="ts">
import type { NavItem, vue } from '@fiction/core'

defineProps({
  socials: { type: Array as vue.PropType<NavItem[]>, required: true },
  justify: { type: String as vue.PropType<'left' | 'right' | 'center' | 'justify'>, default: 'center' },
})

const socialIcons = [
  { value: 'x', icon: 'i-tabler-brand-x' },
  { value: 'linkedin', icon: 'i-tabler-brand-linkedin' },
  { value: 'facebook', icon: 'i-tabler-brand-facebook' },
  { value: 'instagram', icon: 'i-tabler-brand-instagram' },
  { value: 'youtube', icon: 'i-tabler-brand-youtube' },
  { value: 'github', icon: 'i-tabler-brand-github' },
  { value: 'email', icon: 'i-tabler-mail' },
  { value: 'phone', icon: 'i-tabler-phone' },
  { value: 'pinterest', icon: 'i-tabler-brand-pinterest' },
  { value: 'snapchat', icon: 'i-tabler-brand-snapchat' },
  { value: 'spotify', icon: 'i-tabler-brand-spotify' },
  { value: 'discord', icon: 'i-tabler-brand-discord' },
  { value: 'slack', icon: 'i-tabler-brand-slack' },
]

function getIcon(value?: string) {
  if (!value)
    return ''

  const icon = socialIcons.find(i => i.value === value)
  return icon ? icon.icon : ''
}

const justifyClass = {
  left: 'justify-center md:justify-start',
  right: 'justify-center md:justify-end',
  center: 'justify-center md:justify-center',
  justify: 'justify-center md:justify-between',
}
</script>

<template>
  <div class="socials flex space-x-6 text-2xl" :class="justifyClass[justify]">
    <a v-for="(item, i) in socials" :key="i" :href="item.href" target="_blank" class="text-center flex items-center flex-col justify-end hover:text-primary-500">
      <div :class="getIcon(item.icon)" class="" :title="item.name" />
    </a>
  </div>
</template>
