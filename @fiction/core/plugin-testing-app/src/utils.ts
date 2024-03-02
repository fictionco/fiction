export function randomId() {
  return `id-${(Math.random() + 1).toString(36).slice(7)}`
}

export function randomRoute() {
  const routes = ['/', '/tour', '/contact', '/about']

  return routes[Math.floor(Math.random() * routes.length)]
}
