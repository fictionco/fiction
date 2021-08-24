export enum CliCommand {
  Start = "start",
  Dev = "dev",
  Build = "build",
}

export const logCategory = {
  debug: { color: "#00ABFF", priority: 5 },
  event: { color: "#0471FF", priority: 10 },
  info: { color: "#00ABFF", priority: 10 },
  notify: { color: "#FF9500", priority: 10 },
  record: { color: "#FF9500", priority: 10 },
  request: { color: "#ff7de5", priority: 10 },
  data: { color: "#FF9500", priority: 10 },
  send: { color: "#00BD0C", priority: 10 },
  service: { color: "#00ffff", priority: 20 },
  command: { color: "#FF9500", priority: 20 },
  build: { color: "#ffdf40", priority: 20 },
  generate: { color: "#00ffa2", priority: 20 },
  success: { color: "#00BD0C", priority: 20 },
  warn: { color: "#ffa500", priority: 30 },
  error: { color: "#FF0000", priority: 40 },
  important: { color: "#00BD0C", priority: 40 },
}
