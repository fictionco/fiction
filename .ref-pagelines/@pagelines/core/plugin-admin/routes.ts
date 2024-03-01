// @unocss-include
import { AppRoute } from '@factor/api'

export default () => [
  new AppRoute({
    name: 'app',
    niceName: () => 'App',
    path: '/app',
    priority: 10,
    auth: async ({ user, route }) => {
      const paramOrganizationId = route.params?.organizationId as string
      // if not logged in, redirect to login
      if (!user && paramOrganizationId !== 'example') {
        return {
          navigate: { path: '/auth/login' },
          id: 'appParent',
          reason: `user: ${!!user} and paramOrganizationId: ${paramOrganizationId}`,
        }
      }
    },
    component: () => import('./AdminWrap.vue'),
  }),
  new AppRoute({
    name: 'auth',
    niceName: () => 'Auth',
    path: '/auth/:mode',
    component: () => import('./AuthWrap.vue'),
  }),
  new AppRoute({
    name: 'adminHome',
    niceName: () => 'Home',
    parent: 'app',
    icon: 'i-heroicons-home',
    path: '/org',
    component: () => import('../plugin-agent/PageChatIndex.vue'),
  }),

  new AppRoute({
    name: 'orgHome',
    niceName: () => 'AI Agents',
    parent: 'app',
    icon: 'i-heroicons-home',
    path: '/org/:organizationId/home',
    component: () => import('../plugin-agent/PageChatIndex.vue'),
    isActive: ({ route }) => {
      return route.path.includes('agent') || route.path.includes('home')
    },
  }),

  new AppRoute({
    name: 'dashboard',
    parent: 'app',
    path: '/org/:organizationId',
    component: () => import('../plugin-agent/PageChatIndex.vue'),
  }),

  new AppRoute({
    name: 'appTest',
    niceName: () => 'App Test',
    path: '/testing',
    component: () => import('./test/AppTest.vue'),
  }),

  new AppRoute({
    name: 'organizationIndex',
    niceName: () => 'Your Organizations',
    path: '/org',
    icon: 'i-heroicons-building-office',
    parent: 'app',
    component: () => import('./PageOrganizations.vue'),
  }),
  new AppRoute({
    name: 'accountNewOrg',
    niceName: () => 'New Organization',
    path: '/org/new',
    parent: 'app',
    component: () => import('./PageNewOrganization.vue'),
  }),

  new AppRoute({
    name: 'orgSettings',
    niceName: () => 'Settings',
    parent: 'app',
    path: '/org/:organizationId/settings',
    menus: ['organization'],
    icon: 'i-heroicons-adjustments-vertical',
    component: () => import('./PageOrganizationSettings.vue'),
  }),

  new AppRoute({
    name: 'developer',
    niceName: () => 'Developer',
    icon: 'i-heroicons-code-bracket-square',
    path: '/org/:organizationId/dev',
    component: () => import('./PageDeveloper.vue'),
    parent: 'app',
  }),
  new AppRoute({
    name: 'accountSettings',
    niceName: () => 'Account Settings',
    path: '/manage/account',
    icon: 'i-heroicons-adjustments-vertical',
    parent: 'app',
    component: () => import('./PageEditAccount.vue'),
  }),
  new AppRoute({
    name: 'editProfile',
    niceName: () => 'Edit Profile',
    path: '/manage/profile',
    icon: 'i-heroicons-user',
    parent: 'app',
    component: () => import('./PageEditProfile.vue'),
  }),

  new AppRoute({
    name: 'accountChangePassword',
    niceName: () => 'Change Password',
    path: '/manage/account/credential/password',
    icon: 'i-heroicons-key',
    parent: 'app',
    component: () => import('./PageChangeCredential.vue'),
  }),

  new AppRoute({
    name: 'accountChangeEmail',
    niceName: () => 'Change Email',
    path: '/manage/account/credential/email',
    parent: 'app',
    component: () => import('./PageChangeCredential.vue'),
  }),
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
    component: () => import('./PageTeamIndex.vue'),
  }),
  new AppRoute({
    name: 'teamMember',
    niceName: () => 'Team Member',
    path: '/org/:organizationId/team/:userId',
    parent: 'app',
    component: () => import('./PageTeamEdit.vue'),
  }),
  new AppRoute({
    name: 'teamInvite',
    niceName: () => 'Team Invite',
    path: '/org/:organizationId/team/invite',
    parent: 'app',
    component: () => import('./PageTeamInvite.vue'),
  }),
  new AppRoute({
    name: 'checkout',
    parent: 'app',
    path: '/org/:organizationId/checkout-plan',
    component: () => import('./PageBillingSuccess.vue'),
  }),
  new AppRoute({
    name: 'manageBilling',
    parent: 'app',
    icon: 'i-heroicons-credit-card',
    path: '/org/:organizationId/change-plan',
    component: () => import('./PageBillingManage.vue'),
  }),
]
