<script setup lang="ts">
import type { Config as TailwindConfig } from 'tailwindcss'
import type { PropType } from 'vue'
import type { ActionButton } from '../../schemas/schemas.js'
import type { MediaItem } from '../../types'
import { Body, Button, Column, Container, Head, Heading, Hr, Html, Img, Markdown, Preview, Section, Style, Tailwind, Text } from '@vue-email/components'
import { computed } from 'vue'

const props = defineProps({
  fromName: { type: String, default: '' },
  fromEmail: { type: String, default: '' },
  avatarUrl: { type: String, default: undefined },
  subject: { type: String, default: '' },
  heading: { type: String, default: '' },
  subHeading: { type: String, default: '' },
  bodyMarkdown: { type: String, default: '' },
  preview: { type: String, default: undefined },
  actions: { type: Array as PropType<ActionButton[]>, default: undefined },
  unsubscribeUrl: { type: String, default: undefined },
  mediaSuper: { type: Object as PropType<MediaItem>, default: undefined },
  mediaFooter: { type: Object as PropType<MediaItem>, default: undefined },
  legal: { type: Object as PropType<MediaItem>, default: undefined },
  // set later
  to: { type: String, default: undefined },
  bodyHtml: { type: String, default: undefined },
  bodyText: { type: String, default: undefined },
  previewMode: { type: String as PropType<'dark' | 'light' | ''>, default: '' },
  primaryColor: { type: String as PropType<keyof typeof colorList>, default: 'blue' },
})

const colorList = {
  black: { 0: '#ffffff', 25: '#404040', 50: '#333333', 100: '#262626', 200: '#1a1a1a', 300: '#0d0d0d', 400: '#080808', 500: '#000000', 600: '#000000', 700: '#000000', 800: '#000000', 900: '#000000', 950: '#000000', 975: '#000000', 1000: '#000000' },
  white: { 0: '#ffffff', 25: '#ffffff', 50: '#ffffff', 100: '#ffffff', 200: '#ffffff', 300: '#fafafa', 400: '#f5f5f5', 500: '#f0f0f0', 600: '#dedede', 700: '#cccccc', 800: '#bfbfbf', 900: '#b3b3b3', 950: '#a6a6a6', 975: '#999999', 1000: '#000000' },
  slate: { 0: '#ffffff', 25: '#f7fafc', 50: '#f3f6f9', 100: '#e2e6ef', 200: '#c5cad4', 300: '#a6adb9', 400: '#7e899e', 500: '#5e6e85', 600: '#3c4a5f', 700: '#2d3748', 800: '#202838', 900: '#161d2f', 950: '#0d1424', 975: '#0a0f1d', 1000: '#000000' },
  gray: { 0: '#ffffff', 25: '#fbfdff', 50: '#F8F9FD', 100: '#e6e9f1', 200: '#DEDFE2', 300: '#b3b9c5', 400: '#7A8599', 500: '#646E82', 600: '#394151', 700: '#1e2026', 800: '#131519', 900: '#0e0f11', 950: '#0A0B0D', 975: '#08090A', 1000: '#000000' },
  zinc: { 0: '#ffffff', 25: '#fcfcfc', 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b', 975: '#020204', 1000: '#000000' },
  neutral: { 0: '#ffffff', 25: '#fcfcfc', 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a', 975: '#020202', 1000: '#000000' },
  stone: { 0: '#ffffff', 25: '#fbfbfa', 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09', 975: '#020201', 1000: '#000000' },
  red: { 0: '#ffffff', 25: '#fff0f0', 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a', 975: '#3f0606', 1000: '#000000' },
  orange: { 0: '#ffffff', 25: '#fffaf0', 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407', 975: '#3d1004', 1000: '#000000' },
  amber: { 0: '#ffffff', 25: '#fffdf0', 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03', 975: '#401700', 1000: '#000000' },
  yellow: { 0: '#ffffff', 25: '#fffef0', 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12', 950: '#422006', 975: '#3c1c00', 1000: '#000000' },
  lime: { 0: '#ffffff', 25: '#f9ffe8', 50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314', 950: '#1a2e05', 975: '#162b00', 1000: '#000000' },
  green: { 0: '#ffffff', 25: '#e8fff0', 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16', 975: '#032b14', 1000: '#000000' },
  emerald: { 0: '#ffffff', 25: '#e5ffef', 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22', 975: '#022920', 1000: '#000000' },
  teal: { 0: '#ffffff', 25: '#e8fffd', 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#93c5fd', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e', 975: '#032d2c', 1000: '#000000' },
  cyan: { 0: '#ffffff', 25: '#e0fefe', 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344', 975: '#062f40', 1000: '#000000' },
  sky: { 0: '#ffffff', 25: '#e6faff', 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49', 975: '#062d45', 1000: '#000000' },
  blue: { 0: '#f8f9fa', 25: '#d3e1ff', 50: '#F0F3F9', 100: '#e4ebfb', 200: '#dae4fc', 300: '#639df6', 400: '#60a5fa', 500: '#2C67FF', 600: '#1453f5', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554', 975: '#121c3b', 1000: '#0a0b0d' },
  indigo: { 0: '#ffffff', 25: '#eeeff8', 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b', 975: '#1b1845', 1000: '#000000' },
  violet: { 0: '#ffffff', 25: '#f3f0ff', 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065', 975: '#2b0e5e', 1000: '#000000' },
  purple: { 0: '#ffffff', 25: '#faf0ff', 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764', 975: '#37065e', 1000: '#000000' },
  fuchsia: { 0: '#ffffff', 25: '#fdf0ff', 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e', 975: '#45044a', 1000: '#000000' },
  pink: { 0: '#ffffff', 25: '#fff0f4', 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724', 975: '#4b0620', 1000: '#000000' },
  rose: { 0: '#ffffff', 25: '#fff0f2', 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519', 975: '#470516', 1000: '#000000' },
} as const

const fontStack = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"'
const fancyFontStack = `'Geist', ${fontStack}`

const tailwindConfig: TailwindConfig = {
  content: [],
  darkMode: props.previewMode ? 'selector' : 'media',
  plugins: [],
  theme: {
    extend: {
      colors: {
        gray: colorList.gray,
        primary: colorList[props.primaryColor],
      },
    },
  },
}

const primaryColor = colorList[props.primaryColor]

const previewText = computed(() => {
  return props.preview || (props.heading ? `${props.heading} -- ${props.subHeading || ''}` : '')
})

function getButtonClass(item: ActionButton): string {
  const buttonStyles = {
    primary: 'bg-primary-500 text-white',
    default: 'bg-gray-700/70 text-white',
    naked: 'text-primary-500 bg-gray-200/40',
  }

  const sizeStyles = {
    'xxs': 'py-0.5 px-1.5 rounded-sm text-[11px]',
    'xs': 'py-1 px-2 rounded-sm text-[12px]',
    'sm': 'py-2 px-3 rounded-md text-[14px]',
    'md': 'py-3 px-4 rounded-md text-[16px]',
    'lg': 'py-3 px-5 rounded-lg text-[18px]',
    'xl': 'py-4 px-6 rounded-xl text-[20px]',
    '2xl': 'py-5 px-7 rounded-2xl text-[24px]',
  }

  const theme = item.theme || 'default'
  const size = item.size || 'md'
  return `${buttonStyles[theme as keyof typeof buttonStyles] || buttonStyles.default} ${sizeStyles[size] || ''}`.trim()
}

const markdownStyles = {
  p: {
    fontSize: '1.1rem',
    lineHeight: '1.65',
    fontWeight: 'normal',
  },
  li: {
    padding: '.5rem 0',
  },
  hr: {
    border: 'none',
    borderBottom: `1px solid ${colorList.gray[200]}`,
    opacity: '.5',
    margin: '2rem 0',
  },
  blockQuote: {
    padding: '0 0 0 1.5rem',
    margin: '1.5rem 0',
    borderLeft: `2px solid ${colorList.gray[500]}`,
    background: 'transparent',
    fontSize: '1.45em',
    fontStyle: 'italic',
  },
  image: {
    margin: '1.5rem 0',
    padding: '0',
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
  },
  link: {
    color: '',
  },
  figure: {
    margin: '1.5rem 0',
  },
}

function generateColorStyles(isDark: boolean) {
  return `
  body {
    background-color: ${isDark ? colorList.gray[900] : colorList.gray[0]};
    color: ${isDark ? '#ffffff' : colorList.gray[900]};
  }
  a { color: ${isDark ? primaryColor[400] : primaryColor[500]}; }
  hr { border-color: ${isDark ? colorList.gray[700] : colorList.gray[200]} !important; }
`
}
</script>

<template>
  <Tailwind :config="tailwindConfig">
    <Html lang="en" dir="ltr" :class="previewMode">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>{{ subject || "No Subject" }}</title>
        <meta name="description" :content="previewText">
        <Style>
          {{ generateColorStyles(false) }}
          @media (prefers-color-scheme: dark) {
          {{ generateColorStyles(true) }}
          }
          .dark { {{ generateColorStyles(true) }} }
          .light { {{ generateColorStyles(false) }} }
          tbody { font-size: 1rem; line-height: 1.65; }
          h1, h2 { line-height: 1.2; }
          h3, h4, h5 { line-height: 1.4; }
          h5, h6 { font-weight: bold; }
          ol, ul, dd, dt { font-size: 1rem; line-height: 1.65; }
          dt { font-weight: bold; margin-top: 0.5rem; }
          dd { margin-inline-start: 1.5rem; }
          ul, ol { padding-inline-start: 1.5rem; }
          img, figure { max-width: 100%; height: auto; }
          img[data-emoji] { display: inline; }
          figure img { border-radius: .5rem; display: block; }
          figcaption { font-size: 0.8rem; text-align: center; color: #666; margin-top: 0.5rem; }
          a { transition: opacity 0.2s; }
          a:hover { opacity: 0.8; }
        </Style>
      </Head>
      <Preview v-if="previewText">
        {{ previewText }}
      </Preview>
      <Body :style="{ fontFamily: fontStack }">
        <Container class="py-8 px-4 max-w-[600px]">
          <Section v-if="mediaSuper" :style="{ marginBottom: '24px' }">
            <Column v-if="mediaSuper.media?.url" class="w-[22px]">
              <a :href="mediaSuper.href || '#'">
                <Img class="rounded-md !border-2 !border-white/10 !border-solid" width="22" :src="mediaSuper.media?.url" />
              </a>
            </Column>
            <Column v-if="mediaSuper?.name" :class="mediaSuper.media?.url ? `pl-3` : ''">
              <a :href="mediaSuper.href || '#'" class="text-inherit font-normal text-[14px] no-underline">
                {{ mediaSuper?.name }}
              </a>
            </Column>
          </Section>

          <Section :style="{ font: fancyFontStack }">
            <Heading as="h1" :data-heading="heading" :style="{ margin: '0 0 0 0', fontWeight: 'bold', fontSize: '24px', lineHeight: 1.2 }">
              {{ heading }}
            </Heading>

            <Heading v-if="subHeading" as="h3" class="my-0 opacity-60" :style="{ margin: '0 0 0 0', fontWeight: 'normal', fontSize: '24px', lineHeight: 1.33 }">
              <span v-html="subHeading" /> <span class="opacity-40">&#x2198;</span>
            </Heading>
          </Section>

          <Hr :style="{ margin: '32px 0' }" />

          <Markdown v-if="bodyMarkdown" class="body-content" :markdown-custom-styles="markdownStyles" :source="bodyMarkdown" />

          <Section v-if="actions" class="mt-8 mb-8 text-left">
            <Section :style="{ display: 'inline-block' }">
              <Column v-for="(item, i) in actions" :key="i" :class="i === 0 ? '' : 'pl-3'">
                <Button
                  :href="item.href"
                  :data-type="item.theme"
                  :class="getButtonClass(item)"
                  class="rounded-full hover:opacity-80 font-medium select-none"
                  :style="{ whiteSpace: 'nowrap' }"
                  v-html="item.name"
                />
              </Column>
            </Section>
          </Section>

          <Hr class="my-12 " />

          <Section class="mt-8 text-left subtle-text text-normal text-xs">
            <Column class="w-[65%] align-top">
              <template v-if="mediaFooter">
                <Img v-if="mediaFooter.media?.url" width="80" :src="mediaFooter.media?.url" :alt="mediaFooter.name " />
                <Text>
                  <a v-if="mediaFooter.name" class="text-normal mt-4 no-underline text-inherit opacity-40 hover:opacity-80" :href="mediaFooter.href || '#'">
                    {{ mediaFooter.name }} &#x2197;
                  </a>
                </Text>
              </template>
            </Column>
            <Column class="w-[35%] text-right  align-top text-xs">
              <div v-if="legal" class="text-sm mb-4 mt-0">
                <a v-if="legal.name" class="mb-1 text-inherit no-underline" :href="legal.href || '#'">
                  {{ legal?.name }}
                </a>
                <div v-if="legal?.desc" class="opacity-70">
                  {{ legal?.desc }}
                </div>
              </div>
              <a v-if="unsubscribeUrl" :href="unsubscribeUrl" class="opacity-50 text-inherit no-underline">
                unsubscribe
              </a>
            </Column>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
</template>
