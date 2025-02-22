<script setup lang="ts">
import type { PropType } from 'vue'
import type { ActionButton } from '../../schemas/schemas.js'
import type { MediaItem } from '../../types'
import { colorList } from '@fiction/core/utils/colors.js'
import { computed } from 'vue'
import { renderEmailHtmlFromMarkdown } from '../markdownParser.js'

const props = defineProps({
  fromName: { type: String, default: '' },
  fromEmail: { type: String, default: '' },
  avatarUrl: { type: String, default: undefined },
  subject: { type: String, default: '' },
  title: { type: String, default: '' },
  subTitle: { type: String, default: '' },
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
  primaryColor: { type: String, default: 'blue' },
})

// Precalculate colors based on props
const primaryColor = computed(() => colorList[props.primaryColor as keyof typeof colorList]?.[500] || colorList.blue[500])
const textColor = computed(() => props.previewMode === 'dark' ? colorList.gray[0] : colorList.gray[900])
const hrColor = computed(() => props.previewMode === 'dark' ? colorList.gray[600] : colorList.gray[200])
const bgColor = computed(() => props.previewMode === 'dark' ? colorList.gray[900] : props.previewMode === 'light' ? colorList.gray[0] : undefined)

const fontStack = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif'

const previewText = computed(() => {
  return props.preview || (props.title ? `${props.title} -- ${props.subTitle || ''}` : '')
})

function getButtonStyle(item: ActionButton): string {
  const theme = item.theme || 'default'
  const size = item.size || 'md'

  // Simplified button styles
  let styles = ''

  // Base styles
  styles += 'display:inline-block;border-radius:9999px;font-weight:500;text-decoration:none;'

  // Color based on theme
  if (theme === 'primary') {
    styles += `background-color:${primaryColor.value};color:white;`
  }
  else if (theme === 'naked') {
    styles += `background-color:rgba(229,231,235,0.4);color:${primaryColor.value};`
  }
  else { // default
    styles += `background-color:rgba(63,63,70,0.7);color:white;`
  }

  // Size styles
  if (size === 'sm') {
    styles += 'padding:0.5rem 0.75rem;font-size:0.875rem;'
  }
  else if (size === 'lg') {
    styles += 'padding:0.75rem 1.25rem;font-size:1.125rem;'
  }
  else { // md
    styles += 'padding:0.75rem 1rem;font-size:1rem;'
  }

  return styles
}

// Helper function to render markdown (consider using a simpler markdown parser)
function renderMarkdown(md: string): string {
  return renderEmailHtmlFromMarkdown(md)
}

const markdownContent = computed(() => props.bodyMarkdown ? renderMarkdown(props.bodyMarkdown) : '')
</script>

<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>{{ subject || "No Subject" }}</title>
    <meta name="description" :content="previewText">
  <!-- Styles -->
  </head>
  <body>
    <div style="-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;" :style="{ color: textColor, fontFamily: fontStack }">
      <table
        style="width:100%;border-spacing:0;border-collapse:separate;border:0;"
        cellpadding="0"
        cellspacing="0"
        :style="{ backgroundColor: bgColor }"
      >
        <tbody>
          <!-- Preview text with white space hack -->
          <tr v-if="previewText">
            <td style="padding:0;font-size:0;line-height:0;max-height:0;overflow:hidden;">
              {{ previewText }}
              <!-- White space hack to prevent email clients from pulling unwanted text -->
              <div style="display:none;max-height:0;overflow:hidden;">
                &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0;">
              <table
                style="width:100%;max-width:600px;margin:0 a uto;border-spacing:0;border-collapse:separate;border:0"
                cellpadding="0"
                cellspacing="0"
              >
                <tbody>
                  <tr>
                    <td style="padding:32px 16px;">
                      <!-- Email content -->

                      <!-- Super header -->
                      <table v-if="mediaSuper" style="width:100%;margin-bottom:16px;">
                        <tbody>
                          <tr>
                            <td v-if="mediaSuper.media?.url" width="22">
                              <a :href="mediaSuper.href || '#'">
                                <img style="border-radius:6px;border:2px solid rgba(255,255,255,0.1);" width="22" :src="mediaSuper.media?.url" alt="">
                              </a>
                            </td>
                            <td v-if="mediaSuper?.label" :style="mediaSuper.media?.url ? 'padding-left:12px;' : ''">
                              <a :href="mediaSuper.href || '#'" style="text-decoration:none;font-weight:normal;font-size:14px;" :style="{ color: textColor }">
                                {{ mediaSuper?.label }}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- Title section -->
                      <table style="width:100%;">
                        <tbody>
                          <tr>
                            <td>
                              <h1
                                data-test-id="email-title"
                                :data-title="title"
                                style="margin:0;font-weight:bold;font-size:24px;line-height:1.33;"
                              >
                                {{ title }}
                              </h1>

                              <h3
                                v-if="subTitle"
                                data-test-id="email-sub-title"
                                style="margin:0;font-weight:normal;font-size:24px;line-height:1.33;opacity:0.6;"
                              >
                                <span v-html="subTitle" />
                              </h3>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- Divider -->
                      <hr :style="{ border: 'none', borderTop: `1px solid ${hrColor}`, opacity: 0.5, margin: '2rem 0' }">

                      <!-- Email body -->
                      <div v-if="bodyMarkdown" data-test-id="email-content" class="body-content" v-html="markdownContent" />

                      <!-- Action buttons -->
                      <table v-if="actions" style="width:100%;margin-top:32px;margin-bottom:32px;text-align:left;">
                        <tbody>
                          <tr>
                            <td>
                              <table style="display:inline-block;">
                                <tr>
                                  <td v-for="(item, i) in actions" :key="i" :style="i === 0 ? '' : 'padding-left:12px;'">
                                    <a
                                      :href="item.href"
                                      :data-type="item.theme"
                                      :style="getButtonStyle(item)"
                                      v-html="item.label"
                                    />
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- Divider -->
                      <hr :style="{ border: 'none', borderTop: `1px solid ${hrColor}`, opacity: 0.5, margin: '2rem 0' }">

                      <!-- Footer -->
                      <table style="width:100%;margin-top:32px;text-align:left;">
                        <tbody>
                          <tr>
                            <td style="width:65%;vertical-align:top;">
                              <img v-if="mediaFooter?.media?.url" width="80" :src="mediaFooter.media?.url" :alt="mediaFooter.label || ''">
                              <div style="margin-top:16px;">
                                <a
                                  v-if="mediaFooter?.label"
                                  :style="{ color: textColor, opacity: 0.4, textDecoration: 'none' }"
                                  :href="mediaFooter?.href || '#'"
                                >
                                  {{ mediaFooter.label }} &#x2197;
                                </a>
                              </div>
                            </td>
                            <td style="width:35%;text-align:right;vertical-align:top;font-size:12px;">
                              <div v-if="legal" style="font-size:14px;margin-bottom:16px;margin-top:0;">
                                <a
                                  v-if="legal.label"
                                  :style="{ color: textColor, textDecoration: 'none', marginBottom: '4px' }"
                                  :href="legal.href || '#'"
                                >
                                  {{ legal?.label }}
                                </a>
                                <div v-if="legal?.description" style="opacity:0.7;">
                                  {{ legal?.description }}
                                </div>
                              </div>
                              <a
                                v-if="unsubscribeUrl"
                                :href="unsubscribeUrl"
                                :style="{ color: textColor, textDecoration: 'none', opacity: 0.5 }"
                              >
                                Unsubscribe
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</template>
