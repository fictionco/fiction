import express from "express"
import * as axios from "axios"
import knex from "knex"
import dompurify from "dompurify"
import * as vue from "vue"
import * as vueRouter from "vue-router"
import dayjs from "dayjs"
import chalk from "chalk"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
import tz from "dayjs/plugin/timezone"
import updateLocale from "dayjs/plugin/updateLocale"
import weekOfYear from "dayjs/plugin/weekOfYear"
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(updateLocale)
dayjs.extend(weekOfYear)
dayjs.updateLocale("en", { weekStart: 1 })

// currently vue references NODE_ENV so in case this is required outside of main
// applications, let's make sure we have vars set
if (typeof window !== "undefined" && typeof window.process == "undefined") {
  // @ts-ignore (avoid confusion with node process.env)
  window.process = { env: {} }
}

const clean = (text: string) => dompurify.sanitize(text)

export { dayjs, express, axios, knex, chalk, vue, vueRouter, clean }
