<script setup lang="ts">
import type { EmailSendConfig } from '../util.js'
import { colorList } from '@fiction/core/utils/colors.js'
import InputSuperTitle from '@fiction/ui/inputs/InputSuperTitle.vue'
import * as unhead from '@unhead/vue'
import { computed } from 'vue'

const {
  subject = '',
  title = '',
  subTitle = '',
  content = '',
  preview = '',
  buttons,
  superTitle,
  mediaFeatured,
  poweredByFiction = true,
  unsubscribeUrl,
  streetAddress = '',
  companyName = '',
  senderName = '',
  readOnSiteUrl,
  theme = 'blue',
  previewMode = '',
  footerLinks = [],
  emailType = 'campaign',
} = defineProps<EmailSendConfig>()

// 8px spacing system
const spacing = {
  '2xs': '4px',
  'xs': '8px',
  'sm': '16px',
  'md': '24px',
  'lg': '32px',
  'xl': '40px',
  '2xl': '48px',
  '3xl': '56px',
  '4xl': '64px',
  '5xl': '80px',
} as const

// Golden ratio typography scale
const typography = {
  mono: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace',
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  sizes: {
    '2xs': '9px',
    'xs': '11px', // monospace footer text
    'sm': '14px', // captions, metadata
    'base': '16px', // body text
    'md': '18px', // main content
    'lg': '24px', // subtitle
    'xl': '32px', // main title
    '2xl': '42px', // unused
  },
  leading: {
    tight: 1.2,
    normal: 1.5,
    golden: 1.618,
  },
} as const

// Simplified color system
const colors = computed(() => {
  const isDark = previewMode === 'dark'
  const themeColors = colorList[theme] || colorList.blue

  return {
    primary: isDark ? themeColors[400] : themeColors[600],
    primaryHover: themeColors[500],
    text: isDark ? colorList.gray[0] : colorList.gray[950],
    textMuted: isDark ? colorList.gray[400] : colorList.gray[500],
    textSubtle: isDark ? colorList.gray[500] : colorList.gray[400],
    border: isDark ? colorList.gray[700] : colorList.gray[200],
    borderDark: isDark ? colorList.gray[600] : colorList.gray[300],
    bg: isDark ? colorList.gray[900] : colorList.gray[0],
    panel: isDark ? colorList.gray[800] : colorList.gray[50],
    highlight: isDark ? colorList.yellow[800] : colorList.yellow[200],
  }
})

// Consolidated base styles
const styles = computed(() => ({
  container: `
    width: 100%;
    max-width: 550px;
    margin: 0 auto;
    padding: ${spacing['xl']} ${spacing.xs};
    font-family: ${typography.sans};
    font-size: ${typography.sizes.base};
    line-height: ${typography.leading.golden};
    color: ${colors.value.text};
  `,
  topDivider: `
    border: none;
    border-top: 1px solid ${colors.value.border};
    margin: 0 0 ${spacing['3xl']};
    width: 5rem;
  `,
  divider: `
    border: none;
    border-top: 1px solid ${colors.value.border};
    margin: ${spacing['3xl']} 0;
    width: 100%;
  `,
  link: `
    color: ${colors.value.text};
    text-decoration: none;
    font-weight: 400;
    font-size: ${typography.sizes.base};
  `,
  button: `
    display: inline-block;
    padding: ${spacing.sm} ${spacing.md};
    background-color: ${colors.value.primary};
    color: #fff !important;
    text-decoration: none !important;
    border-radius: ${spacing.lg};
    font-weight: 600;
    font-size: ${typography.sizes.sm};
    line-height: ${typography.leading.tight};
    margin: ${spacing.xs} ${spacing.xs} ${spacing.xs} 0;
  `,
  senderHeader: `
    font-size: ${typography.sizes.sm};
    color: ${colors.value.text};
    margin: 0 0 ${spacing['2xl']};
  `,
  senderName: `
    font-family: ${typography.sans};
    font-weight: normal;
  `,
  senderMeta: `
    color: ${colors.value.textSubtle};
    opacity: 0.6;
  `,
}))

const previewText = computed(() =>
  preview || [title, subTitle].filter(Boolean).join(' - '),
)

const emailTypeLabel = computed(() => {
  const labels = {
    alert: 'Info',
    update: 'Update',
    digest: 'Digest',
    campaign: 'Newsletter',
  }
  return labels[emailType] || 'Email'
})

unhead.useHead({
  bodyAttrs: {
    style: () => `
      margin: 0;
      padding: 0;
      background-color: ${colors.value.bg};
      font-family: ${typography.sans};
      font-size: ${typography.sizes.base};
      line-height: ${typography.leading.golden};
      color: ${colors.value.text};
    `,
  },
  htmlAttrs: { lang: 'en', dir: 'ltr' },
  title: () => subject || 'Email',
  meta: [
    { 'http-equiv': 'content-type', 'content': 'text/html; charset=utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'description', content: () => previewText.value },
    { name: 'color-scheme', content: 'light dark' },
  ],
  style: [{
    innerHTML: () => `
      /* Reset & Base */
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body, table, td { border-collapse: collapse; }
      img { border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }

      /* Tufte-style Typography Hierarchy */
      .title {
        font-size: ${typography.sizes.lg};
        line-height: ${typography.leading.tight};
        font-weight: normal;
        margin: 0 0 ${spacing.xs};
        letter-spacing: -0.02em;
      }

      .subtitle {
        font-size: ${typography.sizes.md};
        line-height: ${typography.leading.normal};
        font-weight: normal;
        margin: 0 0 ${spacing['2xl']};
        color: ${colors.value.textMuted};
      }

      /* Content Prose - Typography */
      .prose p { margin: ${spacing.md} 0; }
      .prose h1 {
        font-size: ${typography.sizes.xl};
        font-weight: normal;
        margin: ${spacing['3xl']} 0 ${spacing.md};
        line-height: ${typography.leading.tight};
        letter-spacing: -0.02em;
      }
      .prose h2 {
        font-size: ${typography.sizes.lg};
        font-weight: normal;
        margin: ${spacing['2xl']} 0 ${spacing.md};
        line-height: ${typography.leading.tight};
        letter-spacing: -0.02em;
      }
      .prose h3 {
        font-size: ${typography.sizes.md};
        font-weight: 600;
        margin: ${spacing.xl} 0 ${spacing.sm};
        letter-spacing: -0.02em;
      }
      .prose h4 {
        font-size: ${typography.sizes.base};
        font-weight: 600;
        margin: ${spacing.lg} 0 ${spacing.sm};
      }
      .prose h5 {
        font-size: ${typography.sizes.sm};
        font-weight: 600;
        margin: ${spacing.lg} 0 ${spacing.sm};
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }
      .prose h6 {
        font-size: ${typography.sizes.sm};
        font-weight: normal;
        margin: ${spacing.md} 0 ${spacing.sm};
        color: ${colors.value.textMuted};
        font-style: italic;
      }

      /* Text formatting */
      .prose strong { font-weight: 600; }
      .prose em { font-style: italic; }
      .prose mark {
        background: ${colors.value.highlight};
        padding: ${spacing['2xs']} ${spacing.xs};
        border-radius: 3px;
      }
      .prose del {
        text-decoration: line-through;
        color: ${colors.value.textMuted};
      }
      .prose sup, .prose sub {
        font-size: ${typography.sizes.xs};
        line-height: 0;
        position: relative;
        vertical-align: baseline;
      }
      .prose sup { top: -0.5em; }
      .prose sub { bottom: -0.25em; }

      /* Links - underlined, same color as surrounding text */
      .prose a {
        color: inherit;
        text-decoration: underline;
      }
      .prose a:hover {
        color: ${colors.value.primary};
      }

      /* Lists */
      .prose ul, .prose ol {
        margin: ${spacing.md} 0;
        padding-left: ${spacing.md};
      }
      .prose li { margin: ${spacing.xs} 0; }

      /* Definition Lists */
      .prose dl {
        margin: ${spacing.md} 0;
      }
      .prose dt {
        font-weight: 600;
        margin-top: ${spacing.md};
        margin-bottom: ${spacing.xs};
      }
      .prose dd {
        margin-left: ${spacing.md};
        margin-bottom: ${spacing.xs};
        color: ${colors.value.textMuted};
      }

      /* Blockquotes */
      .prose blockquote {
        margin: ${spacing.lg} 0;
        padding-left: ${spacing.md};
        border-left: 2px solid ${colors.value.border};
        font-style: italic;
        color: ${colors.value.textMuted};
      }
      .prose blockquote footer {
        margin-top: ${spacing.sm};
        font-size: ${typography.sizes.sm};
        font-style: normal;
        color: ${colors.value.textSubtle};
      }

      /* Code */
      .prose code {
        font-family: ${typography.mono};
        font-size: ${typography.sizes.sm};
        background: ${colors.value.panel};
        padding: ${spacing['2xs']} ${spacing.xs};
        border-radius: 3px;
      }

      .prose pre {
        font-family: ${typography.mono};
        font-size: ${typography.sizes.sm};
        background: ${colors.value.panel};
        padding: ${spacing.md};
        border-radius: ${spacing.xs};
        margin: ${spacing.lg} 0;
        overflow-x: auto;
        line-height: ${typography.leading.normal};
      }
      .prose pre code {
        background: transparent;
        padding: 0;
        border-radius: 0;
      }

      /* Horizontal Rules */
      .prose hr {
        border: none;
        border-top: 1px solid ${colors.value.border};
        margin: ${spacing['2xl']} 0;
        width: 100%;
      }

      /* Table Styling */
      .prose table {
        width: 100%;
        border-collapse: collapse;
        margin: ${spacing.lg} 0;
        font-family: ${typography.mono};
        font-size: ${typography.sizes.sm};
      }
      .prose table th {
        text-align: left;
        font-weight: 600;
        padding: ${spacing.sm} ${spacing.xs};
        border-bottom: 2px solid ${colors.value.border};
        background: ${colors.value.panel};
      }
      .prose table td {
        padding: ${spacing.sm} ${spacing.xs};
        border-bottom: 1px solid ${colors.value.border};
        vertical-align: top;
      }
      .prose table tbody tr:nth-child(even) {
        background: ${colors.value.panel};
      }

      /* Callouts & Editor's Pick */
      .prose .callout, .prose .editors-pick {
        background: ${colors.value.panel};
        padding: ${spacing.md};
        border-radius: ${spacing.xs};
        margin: ${spacing.lg} 0;
        border: 1px solid ${colors.value.border};
      }

      /* Footnotes */
      .prose .footnotes {
        margin-top: ${spacing['3xl']};
        font-size: ${typography.sizes.sm};
        color: ${colors.value.textMuted};
      }
      .prose .footnotes hr {
        margin: ${spacing.lg} 0 ${spacing.md};
      }
      .prose .footnotes ol {
        font-family: ${typography.mono};
        font-size: ${typography.sizes.xs};
      }

      /* Buttons */
      .prose .x-button-container, .prose .button-container {
        margin: ${spacing.lg} 0;
        text-align: center;
      }

      .prose .x-button, .prose .button {
        display: inline-block;
        padding: ${spacing.sm} ${spacing.md};
        background-color: ${colors.value.primary};
        color: #fff !important;
        text-decoration: none !important;
        border-radius: ${spacing.lg};
        font-weight: 600;
        font-size: ${typography.sizes.sm};
        line-height: ${typography.leading.tight};
        margin: ${spacing.xs};
      }

      .prose .x-button.lg {
        padding: ${spacing.md} ${spacing.lg};
        font-size: ${typography.sizes.md};
      }

      .prose .x-button:hover, .prose .button:hover {
        background-color: ${colors.value.primaryHover};
      }

      /* Footer */
      .footer {
        font-family: ${typography.mono};
        font-size: ${typography.sizes.xs};
        color: ${colors.value.textSubtle};
        line-height: ${typography.leading.normal};
      }
      .footer a { color: inherit; text-decoration: none; }
      .footer a:hover { text-decoration: underline; }

      /* Media & Figures */
      .prose figure {
        margin: ${spacing['2xl']} 0;
        text-align: center;
      }
      .prose figure img {
        border-radius: ${spacing.xs};
        display: block;
        margin: 0 auto;
      }
      .prose figcaption {
        margin-top: ${spacing.sm};
        font-family: ${typography.mono};
        font-size: ${typography.sizes.xs};
        color: ${colors.value.textMuted};
        text-align: center;
        font-style: italic;
      }
      .prose figcaption a {
        color: inherit;
        text-decoration: underline;
      }
      .prose figcaption a:hover {
        color: ${colors.value.primary};
      }

      .media {
        margin: ${spacing.lg} 0;
        text-align: center;
      }
      .media img {
        border-radius: ${spacing.xs};
        display: block;
        margin: 0 auto;
      }
      .media-caption {
        margin-top: ${spacing.sm};
        font-family: ${typography.mono};
        font-size: ${typography.sizes.xs};
        color: ${colors.value.textMuted};
        text-align: center;
        font-style: italic;
      }

      /* Sender Header */
      .sender-header a {
        color: inherit;
        text-decoration: underline;
      }
      .sender-header a:hover {
        color: ${colors.value.primary};
      }
    `,
  }],
})
</script>

<template>
  <div>
    <!-- Preview Text -->
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
      {{ previewText }}
      {{ "&#8203;".repeat(100) }}
    </div>

    <!-- Main Container -->
    <div :style="styles.container">
      <!-- Header -->
      <header v-if="superTitle || title || subTitle">
        <!-- Simplified Sender Header -->
        <div v-if="InputSuperTitle" class="sender-header" :style="styles.senderHeader">
          <table style="width: 100%;" cellpadding="0" cellspacing="0">
            <tr>
              <td v-if="superTitle?.icon?.url" style="width: 28px; vertical-align: middle;">
                <img
                  :src="superTitle.icon.url"
                  width="20"
                  height="20"
                  alt=""
                  style="border-radius: 50%; display: block;"
                >
              </td>
              <td v-if="superTitle?.text" style="vertical-align: middle;" :style="styles.senderName">
                {{ superTitle?.text }}
              </td>
            </tr>
          </table>
        </div>

        <h1 v-if="title" class="title">
          {{ title }}
        </h1>
        <h2 v-if="subTitle" class="subtitle" v-html="subTitle" />
      </header>

      <!-- Divider after header - 6rem width -->
      <hr v-if="title || subTitle" :style="[styles.topDivider]">

      <!-- Featured Media -->
      <figure v-if="mediaFeatured?.url" class="media">
        <img :src="mediaFeatured.url" :alt="mediaFeatured.alt || ''">
        <figcaption v-if="mediaFeatured.caption" class="media-caption">
          {{ mediaFeatured.caption }}
        </figcaption>
      </figure>

      <!-- Content -->
      <div v-if="content" class="prose" v-html="content" />

      <!-- Action Buttons -->
      <div v-if="buttons?.length" :style="{ margin: `${spacing.xl} 0` }">
        <a
          v-for="(btn, i) in buttons"
          :key="i"
          :href="btn.href"
          class="btn"
          :style="styles.button"
          v-html="btn.label"
        />
      </div>

      <!-- Footer Divider -->
      <hr :style="styles.divider">

      <!-- Footer -->
      <footer class="footer">
        <!-- Footer Links -->
        <div v-if="footerLinks?.length" :style="{ marginBottom: spacing.lg }">
          <template v-for="(link, i) in footerLinks" :key="i">
            <a :href="link.href" style="margin-right: 16px; font-weight: 500;" v-html="link.label" />
          </template>
        </div>

        <!-- Company Info -->
        <div :style="{ marginBottom: spacing.md }">
          <div style="font-weight: 500; margin-bottom: 4px;">
            © {{ new Date().getFullYear() }} {{ companyName }}
          </div>
          <div v-if="streetAddress">
            {{ streetAddress }}
          </div>
        </div>

        <!-- Legal Footer -->
        <table style="width: 100%;" cellpadding="0" cellspacing="0">
          <tr>
            <td v-if="unsubscribeUrl && emailType === 'campaign'">
              <a :href="unsubscribeUrl">Unsubscribe</a>
              <span style="margin: 0 8px; opacity: 0.6;">•</span>
              <a href="mailto:admin@fiction.com">Report</a>
            </td>
            <td
              v-if="poweredByFiction"
              :style="{
                textAlign: (unsubscribeUrl && emailType === 'campaign') ? 'right' : 'left',
              }"
            >
              <a href="https://fiction.com" target="_blank" rel="noopener">
                Powered by Fiction.com
              </a>
            </td>
          </tr>
        </table>
      </footer>
    </div>
  </div>
</template>
