import type { Component } from 'vue'
import { defineAsyncComponent as def } from 'vue'
import { mapTypeHelper } from '../../util'
import thumbBot from './img/thumbBot.webp'
import screenSecurity from './img/screenSecurity.webp'

export const map = mapTypeHelper({
  bots: {
    header: 'full',
    class: 'text-red-500',
    bgClass: 'bg-red-50',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-width="1.5" d="M1.094 8.896C1.056 9.192 1 9.49 1 9.793c0 .762.15 1.505.296 2.224l.031.153c.093.463.485.814.957.843l.76.048c1.276.082 2.6.168 3.956.168 1.356 0 2.68-.085 3.956-.168l.76-.048a1.05 1.05 0 00.957-.843l.031-.153c.145-.719.296-1.462.296-2.224 0-.302-.068-.601-.105-.897H1.094z"></path><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 3a5.896 5.896 0 00-5.896 5.896h11.792A5.896 5.896 0 007 3z"></path><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8.912 7a.497.497 0 100-.994.497.497 0 000 .994z"></path><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5.089 7a.497.497 0 100-.994.497.497 0 000 .994z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 2.984V.772"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.851 13.169V8.895"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.149 13.164V8.895"></path></g></svg>`,
    path: '/platform/bots',
    name: 'Bot Flagging',
    tagline: 'Optimize for real behavior',
    description:
      'Optimize and prioritize referrers by flagging bots and detecting fraudulent traffic',
    screenshot: screenSecurity,
    thumb: thumbBot,
    category: 'Analytics',
    aspects: [
      {
        align: 'wide',
        tagline: 'Bot Referrer',
        name: 'How do your bots behave?',
        description: `Use Kaption to learn how and what bots are doing on your website or app.`,
        figure: def<Component>(() => import('./FigureBot.vue')),
      },
      {
        align: 'wide',
        tagline: 'Bot Referrer',
        name: 'Who is sending you bad traffic?',
        description: `You need to know where to spend your time and money. That's why it's important to know what traffic sources are sending you bots.`,
        figure: def<Component>(() => import('./FigureBotReferrer.vue')),
      },
    ],
  },
})
