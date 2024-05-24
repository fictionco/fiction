<script setup lang="ts">
import { EBody, EButton, EColumn, EContainer, EFont, EHead, EHr, EHtml, EImg, ELink, EMarkdown, EPreview, ESection, EStyle, ETailwind, EText } from 'vue-email'
import type { Config as TailwindConfig } from 'tailwindcss'
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { ActionItem, MediaItem } from '../../types'

const props = defineProps({
  to: { type: String, default: undefined },
  from: { type: String, default: undefined },
  subject: { type: String, default: undefined },
  heading: { type: String, default: undefined },
  subHeading: { type: String, default: undefined },
  bodyMarkdown: { type: String, default: undefined },
  preview: { type: String, default: undefined },
  actions: { type: Array as PropType<ActionItem[]>, default: () => [] },
  unsubscribeUrl: { type: String, default: undefined },
  mediaSuper: { type: Object as PropType<MediaItem>, default: undefined },
  mediaFooter: { type: Object as PropType<MediaItem>, default: undefined },
})

const fontStack = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"'
const fancyFontStack = `'Geist', ${fontStack}`

const gray = {
  0: '#ffffff',
  25: '#fbfdff',
  50: '#F8F9FD',
  100: '#e6e9f1',
  200: '#DEDFE2',
  300: '#b3b9c5',
  400: '#7A8599',
  500: '#646E82',
  600: '#394151',
  700: '#1e2026',
  800: '#131519',
  900: '#0e0f11',
  950: '#0A0B0D',
  975: '#08090A',
  1000: '#000000',
}

const blue = {
  0: '#f8f9fa',
  25: '#d3e1ff',
  50: '#F0F3F9',
  100: '#e4ebfb',
  200: '#dae4fc',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#2C67FF',
  600: '#1453f5',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
  975: '#121c3b',
  1000: '#0a0b0d',
}

const tailwindConfig: TailwindConfig = {
  content: [],
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      colors: {
        gray,
      },
    },
  },
}

const previewText = computed(() => {
  return props.preview || (props.heading ? `${props.heading} ${props.subHeading || ''}` : '')
})

function getButtonClass(item: ActionItem): string {
  const buttonStyles = {
    primary: 'dark:bg-blue-600 bg-blue-600 text-white',
    default: 'dark:bg-gray-700 bg-gray-100 text-gray-700',
    naked: 'bg-transparent text-gray-900 hover:text-gray-600',
  }

  const sizeStyles = {
    'xs': 'py-1 px-2 rounded-sm text-[12px]',
    'sm': 'py-2 px-3 rounded-md text-[14px]',
    'md': 'py-3 px-4 rounded-md text-[16px]',
    'lg': 'py-3 px-5 rounded-lg text-[18px]',
    'xl': 'py-4 px-6 rounded-xl text-[20px]',
    '2xl': 'py-5 px-7 rounded-2xl text-[24px]',
  }
  const btn = item.btn || 'default'
  const size = item.size || 'md'
  const typeClass = buttonStyles[btn as keyof typeof buttonStyles] || ''
  const sizeClass = sizeStyles[size] || ''
  return `${typeClass} ${sizeClass}`.trim()
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
    borderBottom: `1px solid ${gray[500]}`,
    opacity: '.5',
    margin: '2rem 0',
  },
  blockQuote: {
    padding: '0 0 0 1.5rem',
    margin: '1.5rem 0',
    borderLeft: `4px solid ${gray[500]}`,
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
    color: blue[500],
  },
  figure: {
    margin: '1.5rem 0',
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
            tbody{font-size: 1rem; line-height: 1.65;}
            h1, h2{
            line-height: 1.2;
            }
            h3, h4, h5{
            line-height: 1.4;
            }
            h5, h6{font-weight: bold;}
            ol, ul, dd, dt{ font-size: 1rem; line-height: 1.65;}
            dt{font-weight: bold; margin-top: 0.5rem;}
            dd{margin-inline-start: 1.5rem;}
            ul, ol{padding-inline-start: 1.5rem;}
            img, figure{max-width: 100%; height: auto; }
            img[data-emoji]{display: inline;}
            figure img{border-radius: .5rem; display: block;}
            figcaption{font-size: 0.8rem; text-align: center; color: #666; margin-top: 0.5rem;}
            @media (prefers-color-scheme: dark) {
            }
            a{ transition: opacity 0.2s;}
            a:hover{opacity: 0.8;}
          </EStyle>
        </EHead>
        <EPreview v-if="previewText">
          {{ previewText }}
        </EPreview>
        <EBody :style="{ fontFamily: fontStack }" class="dark:bg-gray-900 bg-white dark:text-white text-gray-900">
          <EContainer class="py-8 px-4 max-w-[600px]">
            <ESection v-if="mediaSuper" class="mb-6">
              <EColumn v-if="mediaSuper.media?.url" class="w-[22px]">
                <ELink :href="mediaSuper.href || '#'">
                  <EImg class="rounded-md !border-2 !border-white/10 !border-solid" width="22" :src="mediaSuper.media?.url" />
                </ELink>
              </EColumn>
              <EColumn v-if="mediaSuper?.name" class="pl-3">
                <ELink :href="mediaSuper.href || '#'" class="text-gray-500 dark:text-gray-300 font-normal text-[14px]">
                  {{ mediaSuper?.name }}
                </ELink>
              </EColumn>
            </ESection>

            <ESection :style="{ font: fancyFontStack }">
              <EText class="my-0" :style="{ fontWeight: 'bold', fontSize: '24px', lineHeight: 1.33 }">
                {{ heading }}
              </EText>
              <EText v-if="subHeading" class="my-0 text-gray-500" :style="{ fontWeight: 'normal', fontSize: '24px', lineHeight: 1.33 }">
                <span v-html="subHeading" /> &#x2198;
              </EText>
            </ESection>

            <EHr class="my-8 dark:border-gray-700 border-gray-200" />

            <EMarkdown v-if="bodyMarkdown" class="body-content" :custom-styles="markdownStyles" :source="bodyMarkdown" />

            <ESection class="mt-12 mb-8 text-left">
              <ESection class="inline-block">
                <EColumn v-for="(item, i) in actions" :key="i" :class="i === 0 ? '' : 'pl-4'">
                  <EButton :href="item.href" :class="getButtonClass(item)" class="hover:opacity-80 font-bold select-none" :style="{ whiteSpace: 'nowrap' }" v-html="item.name" />
                </EColumn>
              </ESection>
            </ESection>

            <EHr class="my-12 border-gray-500 opacity-30" />

            <ESection class="mt-8 text-left text-gray-300 dark:text-gray-500 text-normal text-xs">
              <EColumn class="w-[65%] align-top">
                <template v-if="mediaFooter">
                  <EImg v-if="mediaFooter.media?.url" width="80" :src="mediaFooter.media?.url" :alt="mediaFooter.name " />
                  <EText>
                    <ELink v-if="mediaFooter.name" class="text-normal text-gray-300 dark:text-gray-500 mt-4" :href="mediaFooter.href || '#'">
                      {{ mediaFooter.name }} &#x2197;
                    </ELink>
                  </EText>
                </template>
              </EColumn>
              <EColumn class="w-[35%] text-right text-gray-400 align-top text-xs">
                <ELink v-if="unsubscribeUrl" :href="unsubscribeUrl" class="text-gray-300 text-normal">
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
