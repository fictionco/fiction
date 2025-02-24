<script setup lang="ts">
import type { ActionButton } from '../../schemas/schemas.js'
import type { EmailSendConfig } from '../util.js'
import { colorList } from '@fiction/core/utils/colors.js'
import { computed } from 'vue'
import { renderEmailHtmlFromMarkdown } from '../markdownParser.js'

const {
  subject = '',
  title = '',
  subTitle = '',
  bodyHtml = '',
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
const primaryColor = computed(() => previewMode === 'dark' ? colorList[theme]?.[400] : colorList[theme]?.[600])
const textColor = computed(() => previewMode === 'dark' ? colorList.gray[0] : colorList.gray[900])
const textColorSubdued = computed(() => previewMode === 'dark' ? colorList.gray[300] : colorList.gray[600])
const hrColor = computed(() => previewMode === 'dark' ? colorList.gray[600] : colorList.gray[200])
const bgColor = computed(() => previewMode === 'dark' ? colorList.gray[900] : previewMode === 'light' ? colorList.gray[0] : undefined)

const fontStack = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif'
const previewText = computed(() => preview || (title ? `${title} -- ${subTitle || ''}` : ''))

// Base styles that can be reused
const baseStyles = {
  container: `width:100%;max-width:600px;margin:0 auto;padding:32px 16px;font-family:${fontStack};color:${textColor.value};`,
  link: `color:${textColor.value};text-decoration:none;`,
  hr: `border:none;border-top:1px solid ${hrColor.value};margin:3em 0; width: 5em;`,
  footerText: `font-size:13px;opacity:0.6;`,
}

function getButtonStyle(item: ActionButton): string {
  const theme = item.theme || 'default'
  const size = item.size || 'md'
  const padding = size === 'sm' ? '8px 12px' : size === 'lg' ? '12px 20px' : '8px 12px'
  const fontSize = size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px'

  return `display:inline-block;border-radius:9999px;font-weight:600;text-decoration:none;padding:${padding};font-size:${fontSize};${
    theme === 'primary'
      ? `background-color:${primaryColor.value};color:white;`
      : theme === 'naked'
        ? `background-color:rgba(229,231,235,0.4);color:${primaryColor.value};`
        : 'background-color:rgba(63,63,70,0.7);color:white;'}`
}

const markdownContent = computed(() => bodyMarkdown ? renderEmailHtmlFromMarkdown(bodyMarkdown, { previewMode, theme }) : '')
</script>

<template>
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <title>{{ subject || "No Subject" }}</title>
      <style type="text/css">
        /* Base typography */
        body { line-height: 1.6; font-size: 18px; }
        p {
        margin: 1.5em 0;
        font-size: 18px;
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
        margin: 1.5em 0;
        padding-left: 1.5em;
        font-size: 18px;
        }
        li { margin: 0.5em 0; }
        li p { margin: 0; }
        dt {
        font-weight: 600;
        margin-top: 1em;
        }
        dd { margin-left: 1.5em; }

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
        margin: 2em 0;
        text-align: center;
        }
        figcaption {
        margin-top: 0.75em;
        font-size: 16px;
        color: v-bind(textColorSubdued);
        }

        /* Links */
        a {
        color: v-bind(primaryColor);
        text-decoration: none;
        transition: opacity 0.2s;
        }
        a:hover { opacity: 0.8; }

        hr { border: none; border-top: 1px solid rgba(0,0,0,.1); margin: 2em 0; }
      </style>
    </head>
    <body style="margin:0;padding:0;" :style="{ backgroundColor: bgColor }">
      <!-- Preview Text Hack -->
      <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; font-family: sans-serif;">
        {{ previewText }}
        <!-- Prevent Gmail app from showing funky characters -->
        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
        <!-- Force preview text to fill available space -->
        &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
        &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      </div>

      <!-- Main Container -->
      <div :style="baseStyles.container">
        <!-- Super Title -->
        <table v-if="superTitle" style="margin-bottom:16px;">
          <tbody>
            <tr>
              <td>
                <img v-if="superTitle.icon?.url" :src="superTitle.icon.url" width="22" alt="" style="vertical-align:middle;border-radius:6px;border:2px solid rgba(255,255,255,0.1);">
              </td>
              <td>
                <a v-if="superTitle?.text" :href="superTitle.href || '#'" :style="`${baseStyles.link}margin-left:.5em;font-weight: 600;font-size:.9em;`">{{ superTitle?.text }}</a>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Title Section -->
        <h1
          style="margin:0 0 8px;font-size:24px;line-height:1.33;"
        >
          {{ title }}
        </h1>
        <h3
          v-if="subTitle"
          style="margin:0;font-weight:normal;font-size:24px;line-height:1.33;"
          :style="{ color: textColorSubdued }"
          v-html="subTitle"
        />

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
            :style="{ color: textColorSubdued }"
          >
            {{ mediaFeatured.caption }}
          </figcaption>
        </figure>

        <!-- Content -->
        <div v-if="bodyMarkdown" v-html="markdownContent" />

        <!-- Buttons -->
        <div v-if="buttons" style="margin:32px 0;">
          <a
            v-for="(btn, i) in buttons"
            :key="i"
            :href="btn.href"
            :style="getButtonStyle(btn) + (i > 0 ? 'margin-left:12px;' : '')"
            v-html="btn.label"
          />
        </div>

        <hr :style="baseStyles.hr">

        <!-- Footer -->
        <div style="margin-top:2em;">
          <!-- Footer Links -->
          <div style="margin-bottom:32px;">
            <a
              v-for="(link, i) in footerLinks"
              :key="i"
              :href="link.href"
              :style="{
                marginRight: '16px',
                fontWeight: 600,
                color: 'inherit',
                textDecoration: 'none',
              }"
            >{{ link.label }}</a>
          </div>

          <!-- Company Info -->
          <div :style="baseStyles.footerText">
            <div>© {{ new Date().getFullYear() }} {{ company }}</div>
            <div v-if="streetAddress" style="margin-top:4px;">
              {{ streetAddress }}
            </div>
          </div>

          <!-- Legal Footer -->
          <table style="width:100%;margin-top:32px;" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <a v-if="unsubscribeUrl" :href="unsubscribeUrl" :style="baseStyles.link + baseStyles.footerText">Unsubscribe</a>
                <span :style="baseStyles.footerText">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                <a href="/privacy" :style="baseStyles.link + baseStyles.footerText">Privacy</a>
                <span :style="baseStyles.footerText">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                <a href="/terms" :style="baseStyles.link + baseStyles.footerText">Terms</a>
              </td>
              <td v-if="poweredByFiction" style="text-align:right;">
                <a
                  href="https://www.fiction.com"
                  target="_blank"
                  rel="noopener"
                  :style="baseStyles.link + baseStyles.footerText"
                >
                  Created with Fiction.com
                </a>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </body>
  </html>
</template>
