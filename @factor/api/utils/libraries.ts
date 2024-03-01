import express from 'express'
import * as axios from 'axios'
import knex from 'knex'
import * as zod from 'zod'
import * as vue from 'vue'
import * as vueRouter from 'vue-router'
import dayjs from 'dayjs'
import chalk from 'chalk'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import updateLocale from 'dayjs/plugin/updateLocale'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import createDOMPurify from 'dompurify'
import * as unhead from '@unhead/vue'
import { twMerge } from 'tailwind-merge'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(updateLocale)
dayjs.extend(weekOfYear)
dayjs.updateLocale('en', { weekStart: 1 })

function clean(text: unknown) {
  if (typeof window === 'undefined') {
    console.error('clean() doesn\'t have access to window, returning empty string')
    return ''
  }

  // Create a DOMPurify instance using the appropriate window object
  const DOMPurify = createDOMPurify(window)

  if (!text)
    return ''

  if (typeof text !== 'string')
    return `text is not a string (${typeof text})`

  // Custom DOMPurify configuration
  const config = {
    USE_PROFILES: { html: true, svg: true },
    ADD_TAGS: ['clipPath', 'defs', 'use', 'linearGradient', 'stop', 'ellipse'],
    ADD_ATTR: ['xlink:href', 'fill', 'viewBox'],
  }

  // Sanitize the text
  return DOMPurify.sanitize(text, config)
}
export { dayjs, express, axios, knex, chalk, vue, vueRouter, clean, unhead, twMerge, zod }
