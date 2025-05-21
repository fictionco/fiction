import * as unhead from '@unhead/vue'
import * as axios from 'axios'
import chalk from 'chalk'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import timezone from 'dayjs/plugin/timezone.js'
import updateLocale from 'dayjs/plugin/updateLocale.js'
import utc from 'dayjs/plugin/utc.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import createDOMPurify from 'dompurify'
import knex from 'knex'
import * as vue from 'vue'
import * as vueRouter from 'vue-router'
import * as zod from 'zod/v4'
import { log } from '../plugin-log'
import { isSSR } from './vars'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
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

export function def<T extends vue.Component>(loader: vue.AsyncComponentLoader<T>): T {
  return vue.defineAsyncComponent<T>({
    loader,
    loadingComponent: isSSR() ? undefined : { template: '<div/>' },
    onError: (err, retry, fail, attempts) => {
      const ssr = isSSR()
      if (attempts <= 2) {
        retry()
      }
      else {
        log.info('AsyncComponent', 'Loading Error', {
          error: err.message,
          ...(!ssr && { component: loader.toString().split('/').pop() }),
        })
        fail()
      }
    },
  })
}

export { axios, chalk, clean, dayjs, knex, unhead, vue, vueRouter, zod }
