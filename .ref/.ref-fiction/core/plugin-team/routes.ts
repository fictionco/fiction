// @unocss-include
import { AppRoute } from '@factor/api'

export default [
  new AppRoute({
    name: 'team',
    niceName: () => 'Team',
    path: '/org/:organizationId/team',
    menus: ['organization'],
    icon: 'i-heroicons-user-group',
    isActive: ({ route }) => {
      return route.path.includes('team')
    },
    parent: 'app',
    component: () => import('./el/OrgTeam.vue'),
  }),
  new AppRoute({
    name: 'teamMember',
    niceName: () => 'Team Member',
    path: '/org/:organizationId/team/:userId',
    parent: 'app',
    component: () => import('./el/OrgTeamEdit.vue'),
  }),
  new AppRoute({
    name: 'teamInvite',
    niceName: () => 'Team Invite',
    path: '/org/:organizationId/team/invite',
    parent: 'app',
    component: () => import('./el/OrgTeamInvite.vue'),
  }),
]
