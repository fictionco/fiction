<script setup lang="ts">
import type { ColorThemeBright } from '@fiction/core/utils/colors.js'
import type { ActionButton, MediaObject, NavListItem, SuperTitle } from '../../schemas/schemas.js'
import type { EmailSendConfig } from '../util.js'
import { colorList } from '@fiction/core/utils/colors.js'
import { computed } from 'vue'
import { renderEmailHtmlFromMarkdown } from '../markdownParser.js'

const {
  subject = '',
  title = '',
  subTitle = '',
  bodyMarkdown = '',
  preview = '',
  buttons,
  superTitle,
  mediaFeatured,
  poweredByFiction = true,
  unsubscribeUrl,
  streetAddress = '',
  company = '',
  theme = 'blue',
  previewMode = '',
  footerLinks = [],
} = defineProps<EmailSendConfig>()

// Precalculate colors based on props
const primaryColor = computed(() => colorList[theme]?.[500] || colorList.blue[500])
const textColor = computed(() => previewMode === 'dark' ? colorList.gray[0] : colorList.gray[900])
const hrColor = computed(() => previewMode === 'dark' ? colorList.gray[600] : colorList.gray[200])
const bgColor = computed(() => previewMode === 'dark' ? colorList.gray[900] : previewMode === 'light' ? colorList.gray[0] : undefined)

const fontStack = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif'

const previewText = computed(() => {
  return preview || (title ? `${title} -- ${subTitle || ''}` : '')
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
  return renderEmailHtmlFromMarkdown(md, { previewMode, theme })
}

const markdownContent = computed(() => bodyMarkdown ? renderMarkdown(bodyMarkdown) : '')
</script>

<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>{{ subject || "No Subject" }}</title>
    <meta name="description" :content="previewText">
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
                style="width:100%;max-width:600px;margin:0 auto;border-spacing:0;border-collapse:separate;border:0"
                cellpadding="0"
                cellspacing="0"
              >
                <tbody>
                  <tr>
                    <td style="padding:32px 16px;">
                      <!-- Email content -->

                      <!-- Super header -->
                      <table v-if="superTitle" style="width:100%;margin-bottom:16px;">
                        <tbody>
                          <tr>
                            <td v-if="superTitle.icon?.url" width="22">
                              <a :href="superTitle.href || '#'">
                                <img style="border-radius:6px;border:2px solid rgba(255,255,255,0.1);" width="22" :src="superTitle.icon?.url" alt="">
                              </a>
                            </td>
                            <td v-if="superTitle?.text" :style="superTitle.icon?.url ? 'padding-left:12px;' : ''">
                              <a :href="superTitle.href || '#'" style="text-decoration:none;font-weight:normal;font-size:14px;" :style="{ color: textColor }">
                                {{ superTitle?.text }}
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

                      <!-- Featured Image -->
                      <table v-if="mediaFeatured?.url" style="width:100%;margin:32px 0;">
                        <tbody>
                          <tr>
                            <td>
                              <img
                                :src="mediaFeatured.url"
                                :alt="mediaFeatured.alt || 'Featured Image'"
                                style="width:100%;height:auto;border-radius:4px;"
                              >
                              <p v-if="mediaFeatured.caption" style="margin:8px 0 0;font-size:14px;text-align:center;opacity:0.6;">
                                {{ mediaFeatured.caption }}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- Email body -->
                      <div v-if="bodyMarkdown" data-test-id="email-content" class="body-content" v-html="markdownContent" />

                      <!-- Action buttons -->
                      <table v-if="buttons" style="width:100%;margin-top:32px;margin-bottom:32px;text-align:left;">
                        <tbody>
                          <tr>
                            <td>
                              <table style="display:inline-block;">
                                <tr>
                                  <td v-for="(item, i) in buttons" :key="i" :style="i === 0 ? '' : 'padding-left:12px;'">
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
                      <table style="width:100%;margin-top:48px;border-spacing:0;">
                        <tbody>
                          <tr>
                            <td style="padding-top:24px;">
                              <!-- Brand & Navigation -->
                              <table style="width:100%;margin-bottom:32px;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <!-- Top Navigation -->
                                      <table style="margin:0;">
                                        <tr>
                                          <td v-for="(link, i) in footerLinks" :key="i" :style="i === 0 ? '' : 'padding-left:24px;'">
                                            <a
                                              :href="link.href"
                                              :style="{
                                                color: textColor,
                                                textDecoration: 'none',
                                                fontSize: '16px',
                                                opacity: 0.8,
                                              }"
                                            >
                                              {{ link.label }}
                                            </a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <!-- Company Info -->
                              <table style="width:100%;margin-bottom:32px;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <div style="font-size:13px;opacity:0.6;">
                                        © {{ new Date().getFullYear().toString() }} {{ company }}
                                      </div>
                                      <div v-if="streetAddress" style="font-size:13px;opacity:0.6;margin-top:4px;">
                                        {{ streetAddress }}
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <!-- Legal Links -->
                              <table style="width:100%;">
                                <tbody>
                                  <tr>
                                    <!-- Left side links -->
                                    <td style="vertical-align:middle;">
                                      <table style="display:inline-block;">
                                        <tr>
                                          <td>
                                            <a
                                              v-if="unsubscribeUrl"
                                              :href="unsubscribeUrl"
                                              :style="{
                                                color: textColor,
                                                textDecoration: 'none',
                                                fontSize: '13px',
                                                opacity: 0.6,
                                              }"
                                            >
                                              Unsubscribe
                                            </a>
                                          </td>
                                          <td style="padding:0 8px;opacity:0.6;">
                                            •
                                          </td>
                                          <td>
                                            <a
                                              href="/privacy"
                                              :style="{
                                                color: textColor,
                                                textDecoration: 'none',
                                                fontSize: '13px',
                                                opacity: 0.6,
                                              }"
                                            >
                                              Privacy
                                            </a>
                                          </td>
                                          <td style="padding:0 8px;opacity:0.6;">
                                            •
                                          </td>
                                          <td>
                                            <a
                                              href="/terms"
                                              :style="{
                                                color: textColor,
                                                textDecoration: 'none',
                                                fontSize: '13px',
                                                opacity: 0.6,
                                              }"
                                            >
                                              Terms
                                            </a>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>

                                    <!-- Fiction branding -->
                                    <td style="vertical-align:middle;text-align:right;">
                                      <a
                                        v-if="poweredByFiction"
                                        href="https://www.fiction.com"
                                        target="_blank"
                                        rel="noopener"
                                        :style="{
                                          color: textColor,
                                          textDecoration: 'none',
                                          fontSize: '13px',
                                          opacity: 0.6,
                                        }"
                                      >
                                        Created with Fiction
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</template>
