#!/usr/bin/env node
process.noDeprecation = true
const argv = require("yargs").argv

const { _: commands } = argv

if (!process.env.NODE_ENV) {
  if (commands.includes("production")) {
    process.env.NODE_ENV = "production"
  } else {
    process.env.NODE_ENV = "development"
  }
}

const env = process.env.NODE_ENV

if (commands.includes("development")) {
  require("@factor/build-development")()
} else if (commands.includes("production")) {
  require("@factor/build-production")()
} else {
  require("@factor/build-start")()
}
