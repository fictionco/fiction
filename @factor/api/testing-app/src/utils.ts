export const randomId = () => {
  return `id-${(Math.random() + 1).toString(36).slice(7)}`
}

export const randomRoute = () => {
  const routes = ["/", "/tour", "/contact", "/about"]

  return routes[Math.floor(Math.random() * routes.length)]
}
