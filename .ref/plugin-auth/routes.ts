import { AppRoute } from '../plugin-router'

const alreadyLoggedIn: AppRoute<string>['auth'] = async ({
  user,
  factorRouter,
}) => {
  let navigate: boolean | string = true
  if (user && user.emailVerified)
    navigate = factorRouter?.link('home').value ?? '/404'

  return { id: 'authRoutes', navigate }
}

export default [
  new AppRoute({
    name: 'authLogin',
    niceName: () => 'Login',
    path: '/login',
    component: () => import('./AuthLogin.vue'),
    auth: alreadyLoggedIn,
  }),
  new AppRoute({
    name: 'authRegister',
    niceName: () => 'Register',
    path: '/register',
    component: () => import('./AuthRegister.vue'),
    auth: alreadyLoggedIn,
  }),
  new AppRoute({
    name: 'authResetPassword',
    niceName: () => 'Reset Password',
    path: '/reset-password',
    component: () => import('./AuthResetPassword.vue'),
  }),
  new AppRoute({
    name: 'authSetPassword',
    niceName: () => 'Set Password',
    path: '/set-password',
    component: () => import('./AuthSetPassword.vue'),
  }),
  new AppRoute({
    name: 'authVerify',
    niceName: () => 'Verify Email',
    path: '/verify',
    component: () => import('./AuthVerify.vue'),
  }),
]
