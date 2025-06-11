<script setup lang="ts">
import type { EmailSendConfig } from '../util.js'
import { colorList } from '@fiction/core/utils/colors.js'
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
  theme = 'blue',
  previewMode = '',
  footerLinks = [],
  emailType = 'campaign',
} = defineProps<EmailSendConfig>()

// Precalculate colors based on props
const primaryColor = computed(() => previewMode === 'dark' ? colorList[theme]?.[400] : colorList[theme]?.[600])
const primaryColorAlt = computed(() => previewMode === 'dark' ? colorList[theme]?.[500] : colorList[theme]?.[500])
const textColor = computed(() => previewMode === 'dark' ? colorList.gray[0] : colorList.gray[900])
const textColorAlt = computed(() => previewMode === 'dark' ? colorList.gray[300] : colorList.gray[600])
const textColorSubtle = computed(() => previewMode === 'dark' ? colorList.gray[500] : colorList.gray[400])
const hrColor = computed(() => previewMode === 'dark' ? colorList.gray[600] : colorList.gray[300])
const subtleBorderColor = computed(() => previewMode === 'dark' ? colorList.gray[700] : colorList.gray[200])
const bgColor = computed(() => previewMode === 'dark' ? colorList.gray[900] : colorList.gray[0])
const panelColor = computed(() => previewMode === 'dark' ? colorList.gray[800] : colorList.gray[100])

const fontStack = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif'
const previewText = computed(() => preview || [title, subTitle].filter(Boolean).join(' - '))

// Base styles that can be reused
const baseStyles = {
  container: `width:100%;max-width:600px;margin:0 auto;padding:32px 0;font-family:${fontStack};color:${textColor.value};`,
  link: `color:${textColor.value};text-decoration:none;`,
  hr: `border:none;border-top:1px solid ${hrColor.value};margin:2em 0; width: 100%;`,
  hrFooter: `border:none;border-top:1px solid ${subtleBorderColor.value};margin:3em 0 2em; width: 100%;`,
}

unhead.useHead({
  bodyAttrs: { style: () => `margin:0;padding:0;background-color:${bgColor.value};font-family:${fontStack};font-size:18px;color:${textColor.value};` },
  htmlAttrs: { lang: 'en', dir: 'ltr' },
  title: () => subject || 'No Subject',
  meta: [
    { 'http-equiv': 'content-type', 'content': 'text/html; charset=utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'description', content: () => previewText.value },
    { name: 'color-scheme', content: 'light dark' },
    { name: 'supported-color-schemes', content: 'light dark' },
  ],
  style: [
    {
      innerHTML: () => `
       /* Base typography */
        body { line-height: 1.6; font-size: 18px; }

        p, ul, ol, dl {
        margin-top: 1.5em;
        margin-bottom: 1.5em;
        }


        figure,  pre, table, .x-button-container {
          margin: 2em 0;
        }

        p, ul, ol, dl, blockquote, pre, table {
          font-size: 18px;
          line-height: 1.6;
        }

        /* Headers */
        h1, h2, h3, h4, h5, h6 {
        margin: 1.5em 0 0.75em;
        line-height: 1.3;
        }
        h1 { font-size: 36px; }
        h2 { font-size: 27px; }
        h3 { font-size: 22px; }
        h4 { font-size: 20px; }
        h5 { font-size: 18px; }
        h6 { font-size: 18px; }

        /* Lists and definition terms */
        ul, ol, dl {
        padding-left: 1.5em;
        font-size: 18px;
        }
        ul {list-style-type: disc;}
        ol {list-style-type: decimal;}
        li { margin: 0.5em 0; }
        li p { margin: 0; }
        dt {
        font-weight: 600;
        margin-top: 1em;
        }
        dd { margin-left: 1.5em; }



        blockquote {

          margin-left: 1em;
          padding-left: 1.5em;
          font-style: italic;
          border-left: 3px solid ${hrColor.value};
        }

        blockquote p, blockquote{
          line-height: 1.5;
          font-size: 20px;
        }

        blockquote p {
          margin: 1em 0;
        }
        blockquote p:first-child {
          margin-top: 0;
        }
        blockquote p:last-child {
          margin-bottom: 0;
        }

        pre{
          padding: 1em;
          background-color: ${panelColor.value};
          border-radius: 0.5em;
          overflow-x: auto;
          font-size:16px;
        }
        pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
        }

        code {
          background-color: ${panelColor.value};
          padding: 0.1em 0.3em;
          border-radius: 0.3em;
          font-size:16px;
        }

        .prose-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }
        .prose-content tbody tr:nth-child(odd) {
          background-color: rgba(0,0,0,.05);
        }
        .prose-content table td {
          vertical-align: top;
          text-align: center;
        }

        /* Images and figures */
        img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5em;
        }
        img[data-emoji] {
          display: inline;
          border-radius: 0;
          vertical-align: -0.1em;
        }
        figure {
          text-align: center;
        }
        figcaption {
          margin-top: 0.75em;
          font-size: 16px;
          color: ${textColorAlt.value};
        }
        /* Links */
        #themed-content a{
          color: ${primaryColor.value};
          text-decoration: underline;
        }
        #themed-content a:hover {
          color: ${primaryColorAlt.value};
        }

        #themed-footer {
          color: ${textColor.value}
        }
        #themed-footer a {
          color: inherit;
          text-decoration: none;
        }
        #themed-footer a:hover {
        text-decoration: underline;
        }

        #last-line a, #last-line span, #last-line  {
          font-size: 11px;
        }
        #last-line a {
          color: ${textColorSubtle.value};
          text-decoration: none;
        }
        #last-line a:hover {
          text-decoration: underline;
        }

        #last-line span {
          opacity: 0.6;
          margin: 0 1em;
        }


        .x-button {
          display: inline-block;
          padding: 12px 18px;
          background-color: ${primaryColor.value};
          color: #ffffff !important;
          text-decoration: none !important;
          border-radius: 9999px;
          font-weight: 600;
          margin: 0 auto;
          text-align: center;
          mso-padding-alt: 0;
          mso-text-raise: 7.5pt;
          font-size: 16px;
          line-height: 1;
        }

        .x-button.naked {
          background-color: rgba(229,231,235,0.4);
          color: ${primaryColor.value};
        }

        .x-button img {
          vertical-align: -0.3em;
        }

        .x-button:hover {
          background-color: ${primaryColorAlt.value};
        }

        .x-button.sm{
          padding: 8px 16px;
          font-size: 14px;
        }

        .x-button.lg{
          padding: 14px 24px;
          font-size: 18px;
        }

        hr { border: none; border-top: 1px solid rgba(0,0,0,.1); margin: 2em 0; }`,
    },
  ],
})
</script>

<template>
  <div>
    <!-- Preview Text Hack -->
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; font-family: sans-serif;">
      {{ previewText }}
      <!-- Repeating characters to fill preview area -->
      {{ "&#160;".repeat(80) }}
    </div>

    <!-- Main Container -->
    <div :style="baseStyles.container">
      <!-- Title Section -->
      <div id="themed-content" class="themed-content">
        <h1
          style="margin:0 0 8px;font-size:24px;font-weight:600;line-height:1.33;"
        >
          {{ title }}
        </h1>
        <h3
          v-if="subTitle"
          style="margin:0;font-weight:600;font-size:24px;line-height:1.33;"
          :style="{ color: textColorAlt }"
          v-html="subTitle"
        />

        <!-- Super Title -->
        <table v-if="superTitle" style="margin:16px 0;">
          <tbody>
            <tr>
              <td v-if="superTitle.icon?.url">
                <img
                  :src="superTitle.icon.url"
                  width="25"
                  alt="Logo"
                  :style="{
                    display: 'block',
                    borderRadius: '50px',
                    border: '1.5px solid #ffffff',
                    width: '25px',
                    height: '25px',
                    objectFit: 'cover',
                    marginRight: '10px',
                  }"
                >
              </td>
              <td>
                <a
                  v-if="superTitle?.text"
                  :href="superTitle.href"
                  :style="{
                    color: textColorAlt, textDecoration: 'none', fontWeight: 500, fontSize: `14px` }"
                >{{ superTitle?.text }}</a>
              </td>
            </tr>
          </tbody>
        </table>

        <hr :style="baseStyles.hr">

        <!-- Featured Image -->
        <figure v-if="mediaFeatured?.url" style="margin:2em 0;">
          <img
            :src="mediaFeatured.url"
            :alt="mediaFeatured.alt || ''"
            style="width:100%;height:auto;border-radius:4px;"
          >
          <figcaption
            v-if="mediaFeatured?.caption"
            style="margin:8px 0 0;font-size:.9em;text-align:center;"
            :style="{ color: textColorAlt }"
          >
            {{ mediaFeatured.caption }}
          </figcaption>
        </figure>

        <!-- Content -->
        <div v-if="content" class="prose-content" v-html="content" />

        <!-- Buttons -->
        <div v-if="buttons" style="margin:32px 0;">
          <a
            v-for="(btn, i) in buttons"
            :key="i"
            :href="btn.href"
            class="x-button"
            v-html="btn.label"
          />
        </div>
      </div>

      <hr :style="baseStyles.hrFooter">

      <!-- Footer -->
      <div id="themed-footer" style="margin-top:2em;">
        <!-- Footer Links -->
        <div v-if="footerLinks.length" style="margin-bottom:32px;">
          <a
            v-for="(link, i) in footerLinks"
            :key="i"
            :href="link.href"
            :style="{
              marginRight: '16px',
              fontWeight: 600,
              color: 'inherit',
              fontSize: '13px',
            }"
          >{{ link.label }}</a>
        </div>

        <div :style="{ fontSize: '13px', color: textColorSubtle }">
          <div :style="{ fontWeight: '500', color: textColorAlt }">
            © {{ new Date().getFullYear() }} {{ companyName || senderName }}
          </div>
          <div v-if="streetAddress" :style="{ marginTop: '6px', fontSize: '11px' }">
            {{ streetAddress }}
          </div>
        </div>

        <!-- Legal Footer -->
        <table
          id="last-line"
          :style="{
            width: '100%',
            marginTop: '32px',
            fontSize: '11px',
          }"
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr>
              <td v-if="unsubscribeUrl && emailType === 'campaign'">
                <a :href="unsubscribeUrl">Unsubscribe</a>
                <span>•</span>
                <a href="mailto:admin@fiction.com">Report Abuse</a>
              </td>
              <td
                v-if="poweredByFiction"
                :style="{
                  textAlign: unsubscribeUrl && emailType === 'campaign' ? 'right' : 'left',
                }"
              >
                <a
                  href="https://www.fiction.com"
                  target="_blank"
                  rel="noopener"
                >
                  Powered by Fiction.com
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
