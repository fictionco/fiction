import express from "express"
import axios from "axios"
import * as vue from "vue"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
import tz from "dayjs/plugin/timezone"
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(tz)

export { dayjs, express, axios, vue }
