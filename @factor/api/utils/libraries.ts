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
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(tz)

const clean = (text: string) => dompurify.sanitize(text)

export { dayjs, express, axios, knex, chalk, vue, vueRouter, clean }
