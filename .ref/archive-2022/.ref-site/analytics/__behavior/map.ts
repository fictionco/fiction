import type { Component } from 'vue'
import { defineAsyncComponent as def } from 'vue'
import { mapTypeHelper } from '../../util'
import behaviorScreenshot from './img/screenBehavior.webp'
import thumbBehavior from './img/thumbBehavior.webp'

export const map = mapTypeHelper({
  behavior: {
    header: 'full',
    class: 'text-green-500',
    bgClass: 'text-green-50',
    path: '/platform/behavior',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12.97 10.987a.989.989 0 00-.202-1.104L9.403 6.518l1.924-1.923a.962.962 0 00-.481-1.616C7.516 1.662 5.568 1.183 1.94.777c-.343-.039-.675.02-.91.254-.233.234-.264.593-.253.91.128 3.752.619 5.7 2.202 8.905a.962.962 0 001.616.442l1.923-1.923 3.447 3.447a.884.884 0 00.93.204v0a3.535 3.535 0 002.003-1.868l.072-.161z"></path></g></svg>`,
    name: 'Behavioral Analytics',
    tagline: 'Track every interaction',
    screenshot: behaviorScreenshot,
    thumb: thumbBehavior,
    category: 'Analytics',
    description:
      'Use behavioral data, like scrolls and clicks, to enhance traditional metrics like bounce rate and time on site.',
    aspects: [
      {
        align: 'wide',
        tagline: 'High Resolution Analytics',
        name: 'Understand what performs and what doesn\'t..',
        description: `Traditional metrics, like bounce rate, don't give you the full story.
          Kaption tracks and aggregates every interaction on your site to help you see what creates engagement and leads to conversion.`,
        figure: def<Component>(() => import('./BehaviorFigure.vue')),
      },
      {
        align: 'wide',
        tagline: 'Depth of Engagement',
        name: 'See how visitors are engaging.',
        description: `Use metrics like scroll depth or touches per page to see if users are really reading your material. As you optimize, see the results improve over time.`,
        figure: def<Component>(() => import('./BehaviorEngage.vue')),
      },
    ],
  },
})
