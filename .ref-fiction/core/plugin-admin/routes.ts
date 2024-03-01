// @unocss-include
import { AppRoute } from '@factor/api'
import AdminWrap from './AdminWrap.vue'

export default () => [
  new AppRoute({
    name: 'app',
    niceName: () => 'App',
    path: '/app',
    priority: 10,
    auth: async ({ user, factorRouter, route }) => {
      const paramOrganizationId = route.params?.organizationId as string | undefined
      // if not logged in, redirect to login
      if (!user && paramOrganizationId !== 'example') {
        return {
          navigate: { path: factorRouter?.link('authLogin').value || '/404' },
          id: 'appParent',
          reason: `user: ${!!user} and paramOrganizationId: ${paramOrganizationId}`,
        }
      }
    },
    component: AdminWrap,
  }),
  new AppRoute({
    name: 'home',
    niceName: () => 'Home',
    path: '/',
    parent: 'app',
    icon: 'i-heroicons-home',
    component: () => import('../plugin-app-store/PageHome.vue'),
    isActive: ({ route }) => {
      return route.path.includes('home')
    },
  }),
  new AppRoute({
    name: 'orgHome',
    niceName: () => 'Home',
    parent: 'app',
    icon: 'i-heroicons-home',
    path: '/org/:organizationId/home',
    component: () => import('../plugin-app-store/PageHome.vue'),
  }),
  new AppRoute({
    name: 'renderCreate',
    niceName: () => 'Generate',
    icon: 'i-heroicons-rectangle-stack',
    parent: 'app',
    path: '/org/:organizationId/render/create/:modelId?',
    component: () => import('../plugin-models/el/RenderCreate.vue'),
    isActive: ({ route }) => {
      return route.path.includes('render')
    },
  }),

  new AppRoute({
    name: 'notFound404',
    niceName: () => '404',
    path: '/:pathMatch(.*)*',
    priority: 1000,
    parent: 'app',
    component: () => import('./PageNotFound.vue'),
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
]
