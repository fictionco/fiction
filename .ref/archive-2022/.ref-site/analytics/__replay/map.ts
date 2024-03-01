// import replayIndexScreenshot from "./img/dashboardReplayIndex.webp"
import type { Component } from 'vue'
import { defineAsyncComponent as def } from 'vue'
import { mapTypeHelper } from '../../util'
import replayScreenshot from './img/dashboardReplay.webp'
import thumbReplay from './img/thumbReplay.webp'

export const map = mapTypeHelper({
  replay: {
    header: 'full',
    class: 'text-orange-500',
    bgClass: 'text-orange-50',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="#ffffff" stroke="currentColor" stroke-width="1.5" d="M1.182 11.887c.052.48.433.86.913.913 1.569.172 3.212.408 4.905.408s3.336-.236 4.905-.408c.48-.052.861-.433.913-.913.168-1.563.39-3.2.39-4.887 0-1.687-.223-3.324-.39-4.887a1.031 1.031 0 00-.913-.913C10.336 1.028 8.693.792 7 .792s-3.336.236-4.905.408c-.48.052-.861.433-.913.913C1.015 3.676.792 5.313.792 7c0 1.687.223 3.324.39 4.887z"></path><path fill="" stroke="currentColor" stroke-width="1.5" d="M13.05 4.237c-.045-.448-.095-.892-.144-1.33-.03-.267-.06-.531-.088-.794a1.031 1.031 0 00-.913-.913c-.293-.032-.59-.067-.887-.101C9.72.949 8.376.792 7 .792S4.28.948 2.982 1.1c-.298.034-.594.069-.887.1-.48.053-.861.434-.913.914-.028.263-.058.527-.088.794-.049.438-.098.882-.143 1.33h12.098z"></path><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.225 8.718c0 .347.055.821.116 1.247.08.562.635.923 1.17.736.925-.322 1.783-.792 2.414-1.464a.756.756 0 000-1.039c-.631-.672-1.49-1.142-2.413-1.464-.536-.187-1.09.174-1.171.736-.061.426-.116.9-.116 1.248z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.387.855L4.46 4.237"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.497.93l-.902 3.307"></path></g></svg>`,
    path: '/platform/replay',
    name: 'Session Replay',
    tagline: 'See what your users see',
    description:
      'See where users get stuck, increase conversion rates, and debug your product faster with smart metadata.',
    // screenshot: replayIndexScreenshot,
    screenshot: replayScreenshot,
    thumb: thumbReplay,
    category: 'Analytics',
    aspects: [
      {
        align: 'wide',
        tagline: 'Qualitative Analytics',
        name: 'Qualitative Meets Quantitative',
        description: `Kaption combines detailed data analytics along with qualitative tools to give you the best of both worlds.`,
        figure: def<Component>(() => import('./Replay.vue')),
      },
      {
        align: 'wide',
        tagline: 'Qualitative Analytics',
        name: 'The Science of Empathy',
        description: `Your visitors experience your site with new eyes. Watch session replays to visualize how they absorb your content, where they get stuck, and thus where you can improve...`,
        figure: def<Component>(() => import('./ReplayMouse.vue')),
      },
      {
        align: 'wide',
        tagline: 'Powerful Data At Your Fingertips',
        name: 'Focus Your (Recording) Efforts',
        description: `With Kaption, you only record the sessions that you feel are interesting to your business. For example, record when a conversion happens or if a user hits an error.`,
        figure: def<Component>(() => import('./ReplaySettings.vue')),
      },
    ],
  },
})
