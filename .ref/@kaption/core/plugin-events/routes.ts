import { AppRoute } from '@factor/api'

export function getRoutes() {
  return [
    new AppRoute({
      name: 'eventOverview',
      niceName: () => 'Tracked Events',
      parent: 'app',
      path: '/project/:projectId/events/tracking',
      component: () => import('./el/PageEventDashboard.vue'),
      meta: { dashboardId: 'events' },
    }),
    new AppRoute({
      name: 'eventIndex',
      niceName: () => 'Events',
      parent: 'app',
      path: '/project/:projectId/events',
      meta: { eventEdit: true },
      component: () => import('./el/PageEventIndex.vue'),
      isActive: ({ appRoute }) => {
        return !!appRoute?.meta.eventEdit
      },
    }),
    new AppRoute({
      name: 'eventNew',
      niceName: () => 'Create New Event',
      parent: 'app',
      path: '/project/:projectId/events/create',
      component: () => import('./el/PageNewEvent.vue'),
    }),
    new AppRoute({
      name: 'eventEdit',
      niceName: () => 'Edit Event',
      parent: 'app',
      meta: { eventEdit: true },
      path: '/project/:projectId/events/:eventId',
      component: () => import('./el/CustomEventEdit.vue'),
    }),
  ]
}
