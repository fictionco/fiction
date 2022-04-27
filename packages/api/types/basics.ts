export const logLevel = {
  trace: { color: "#5233ff", priority: 5 },
  debug: { color: "#00BD0C", priority: 5 },
  info: { color: "#00ABFF", priority: 10 },
  warn: { color: "#ffa500", priority: 30 },
  error: { color: "#FF0000", priority: 40 },
}

export const logCategory = {
  event: { color: "#5233ff", priority: 10 },
  save: { color: "#FF9500", priority: 10 },
  fetch: { color: "#ff7de5", priority: 10 },
  data: { color: "#FF9500", priority: 10 },
  send: { color: "#00BD0C", priority: 10 },
  serve: { color: "#00ffff", priority: 20 },
  build: { color: "#ffdf40", priority: 20 },
  create: { color: "#00ffa2", priority: 20 },
  done: { color: "#00BD0C", priority: 20 },
  note: { color: "#00BD0C", priority: 40 },
  ...logLevel,
}
