// export function getFictionNavItems(args: { fictionAdmin: FictionAdmin, fictionUser: FictionUser, site?: Site }) {
//   const { fictionAdmin, fictionUser, site } = args
//   const urls = fictionAdmin.urls()
//   const isLoggedIn = fictionUser.activeUser.value
//   return isLoggedIn
//     ? [
//         { label: 'Dashboard', href: urls.dashboard, icon: { class: 'i-tabler-tools' } },
//         { label: 'Account Settings', href: urls.settings, icon: { class: 'i-tabler-user' } },
//         { label: 'Sign Out', href: '/?_logout=1', icon: { class: 'i-tabler-arrow-down-left' } },
//       ]
//     : [
//         { label: 'Sign In', href: getFictionAuthUrl({ fictionAdmin, site }), icon: { class: 'i-tabler-arrow-up-right' } },
//       ]
// }

// export function openAuthPopup(args: { fictionUser: FictionUser, fictionEnv: FictionEnv }) {
//   const { fictionUser, fictionEnv } = args
//   // Determine the auth URL based on environment
//   const baseUrl = fictionEnv.isProd.value ? 'https://www.fiction.com' : 'http://localhost:4444'
//   const authUrl = `${baseUrl}/app/auth`

//   // Calculate popup dimensions and position
//   const width = 450
//   const height = 600
//   const left = (window.innerWidth - width) / 2 + window.screenX
//   const top = (window.innerHeight - height) / 2 + window.screenY

//   // Open popup with specified dimensions and position
//   const popup = window.open(
//     authUrl,
//     'fiction-auth-popup',
//     `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`,
//   )

//   // Focus the popup if it was successfully created
//   if (popup) {
//     popup.focus()
//   }
//   else {
//     // If popup was blocked, fallback to redirect
//     console.warn('Popup blocked. Consider enabling popups for this site.')
//     const authUrlWithRedirect = `${authUrl}?redirect=${window.location.href}`
//     window.location.href = authUrlWithRedirect
//   }

//   // Set up message listener for auth completion
//   window.addEventListener('message', async (event) => {
//     // Only accept messages from fiction domains
//     if (!event.origin.match(/^https?:\/\/(.*\.)?fiction\.com|localhost/)) {
//       return
//     }

//     if (event.data?.type === 'auth-success' && event.data?.token) {
//       // Handle successful authentication
//       await fictionUser.setCurrentUser({
//         token: event.data.token,
//         user: event.data.user,
//         reason: 'auth-popup',
//       })

//       // // Close the popup if it's still open
//       // if (popup && !popup.closed) {
//       //   popup.close()
//       // }
//     }
//   }, false)
// }
