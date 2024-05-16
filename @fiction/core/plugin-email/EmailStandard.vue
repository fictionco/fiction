<script setup lang="ts">
import { EBody, EButton, EColumn, EContainer, EFont, EHead, EHr, EHtml, EImg, ELink, EMarkdown, EPreview, ESection, EStyle, ETailwind, EText } from 'vue-email'
import type { Config as TailwindConfig } from 'tailwindcss'
import twTypography from '@tailwindcss/typography'
import { colorList, tailwindVarColorScheme } from '../utils/colors'
import type { ActionItem, MediaItem } from '../types'
import { vue } from '../utils/libraries'

const props = defineProps({
  subject: { type: String, default: undefined },
  heading: { type: String, default: undefined },
  subHeading: { type: String, default: undefined },
  bodyMarkdown: { type: String, default: undefined },
  preview: { type: String, default: undefined },
  actions: { type: Array as vue.PropType<ActionItem[]>, default: () => [] },
  unsubscribeLink: { type: String, default: undefined },
  mediaSuper: { type: Object as vue.PropType<MediaItem>, default: undefined },
  mediaFooter: { type: Object as vue.PropType<MediaItem>, default: undefined },
})

const fontStack = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"'
const fancyFontStack = `'Geist', ${fontStack}`
const fancyFontStyle = { font: fancyFontStack }

const tailwindConfig: TailwindConfig = {
  content: [],
  darkMode: 'class',
  plugins: [twTypography],
  theme: {
    extend: {
      colors: {
        gray: tailwindVarColorScheme({ color: 'gray' }),
      },
    },
  },
}

const previewText = vue.computed(() => {
  return props.preview || `${props.heading} ${props.subHeading}`
})

function getButtonClass(item: ActionItem): string {
  const buttonStyles = {
    primary: 'dark:bg-blue-600 bg-blue-600 text-white',
    default: 'dark:bg-gray-700 bg-gray-100 text-gray-700',
    naked: 'bg-transparent text-gray-900 hover:text-gray-600',
  }

  const sizeStyles = {
    xs: 'py-1 px-2 rounded-sm text-[12px]',
    sm: 'py-2 px-3 rounded-md text-[14px]',
    md: 'py-3 px-4 rounded-md text-[16px]',
    lg: 'py-3 px-5 rounded-lg text-[18px]',
    xl: 'py-4 px-6 rounded-xl text-[20px]',
  }
  const btn = item.btn || 'default'
  const size = item.size || 'md'
  const typeClass = buttonStyles[btn as keyof typeof buttonStyles] || ''
  const sizeClass = sizeStyles[size] || ''
  return `${typeClass} ${sizeClass}`.trim()
}

const markdownStyles = {
  h1: { ...fancyFontStyle },
  h2: { ...fancyFontStyle },
  h3: { lineHeight: '1.5', ...fancyFontStyle },
  h4: { lineHeight: '1.5', ...fancyFontStyle },
  h5: { lineHeight: '1.5', ...fancyFontStyle },
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
    borderBottom: `1px solid ${colorList.gray[500]}`,
    opacity: '.5',
    margin: '2rem 0',
  },
  blockQuote: {
    padding: '0 0 0 1.5rem',
    margin: '1.5rem 0',
    borderLeft: `4px solid ${colorList.gray[500]}`,
    backgroundColor: 'transparent',
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
    color: colorList.blue[500],
    textDecoration: 'none',
  },
}
</script>

<template>
  <Suspense>
    <ETailwind :config="tailwindConfig">
      <EHtml lang="en">
        <EHead>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>{{ subject || "No Subject" }}</title>
          <meta name="description" :content="previewText">
          <EStyle>
            @media (prefers-color-scheme: dark) {
            }
          </EStyle>
        </EHead>
        <EPreview>{{ previewText }}</EPreview>
        <EBody :style="{ fontFamily: fontStack }" class="dark:bg-gray-900 bg-white dark:text-white text-gray-900">
          <EContainer class="py-24 px-4">
            <ESection v-if="mediaSuper">
              <EColumn v-if="mediaSuper.media?.url" class="w-[24px]">
                <EImg class="rounded-md !border-2 !border-white/10 !border-solid" width="24" :src="mediaSuper.media?.url" />
              </EColumn>
              <EColumn v-if="mediaSuper?.name" class="pl-3">
                <EText class=" text-gray-500 dark:text-gray-300 font-medium text-[16px]">
                  {{ mediaSuper?.name }}
                </EText>
              </EColumn>
            </ESection>

            <ESection :style="{ fontSize: '24px', lineHeight: 1.33, font: fancyFontStack }">
              <div :style="{ fontWeight: 'bold' }">
                {{ heading }}
              </div>
              <div :style="{ fontWeight: 'normal' }" class=" text-gray-500">
                <span v-html="subHeading" /> &#x2198;
              </div>
            </ESection>

            <EHr class="my-8 dark:border-gray-700 border-gray-200" />

            <EMarkdown v-if="bodyMarkdown" :custom-styles="markdownStyles" :source="bodyMarkdown" />

            <EContainer class="mt-12 mb-8 text-left">
              <EContainer class="inline-block">
                <EColumn v-for="(item, i) in actions" :key="i" :class="i === 0 ? '' : 'pl-4'">
                  <EButton :href="item.href" :class="getButtonClass(item)" class="hover:opacity-80 font-bold " :style="{ whiteSpace: 'nowrap' }" v-html="item.name" />
                </EColumn>
              </EContainer>
            </EContainer>

            <EHr class="my-12 border-gray-500 opacity-30" />

            <ESection class="mt-8 text-left text-gray-300 dark:text-gray-500 text-normal text-xs">
              <EColumn class="w-1/2 align-top">
                <template v-if="mediaFooter">
                  <EImg v-if="mediaFooter.media?.url" width="80" :src="mediaFooter.media?.url" alt="Github" />
                  <EText>
                    <ELink v-if="mediaFooter.name" class="text-normal text-gray-300 dark:text-gray-500 mt-4" :href="mediaFooter.href || '#'">
                      {{ mediaFooter.name }} &#x2197;
                    </ELink>
                  </EText>
                </template>
              </EColumn>
              <EColumn class="w-1/2 text-right text-gray-500 align-top">
                <ELink v-if="unsubscribeLink" :href="unsubscribeLink" class="text-gray-500">
                  Unsubscribe
                </ELink>
              </EColumn>
            </ESection>
          </EContainer>
        </EBody>
      </EHtml>
    </ETailwind>
  </Suspense>
</template>
