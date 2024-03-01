// @unocss-include
import { AppRoute } from '@factor/api'

export function routes() {
  return [
    new AppRoute({
      name: 'chatIndex',
      niceName: () => 'AI Agents',
      parent: 'app',
      path: '/org/:organizationId/agent',
      icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
      component: () => import('./PageChatIndex.vue'),
      isActive: ({ route }) => {
        return route.path.includes('agent') || route.path.includes('home')
      },
    }),

    new AppRoute({
      name: 'chat',
      niceName: () => 'Web Agent',
      parent: 'app',
      path: '/org/:organizationId/agent/:agentId/:topicId?',
      icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
      component: () => import('./PageChatEdit.vue'),
    }),
    new AppRoute({
      name: 'agent',
      path: '/visualizer-agent/:agentId?',
      component: () => import('./AgentEntry.vue'),
    }),
    new AppRoute({
      name: 'embedForm',
      path: '/visualizer-embed/:agentId?',
      component: () => import('./VisualizerEmbed.vue'),
    }),
  ]
}
