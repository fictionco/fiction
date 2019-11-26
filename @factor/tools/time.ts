import dayjs from "dayjs"

function _isNumber(value) {
  return !!(!isNaN(parseFloat(value)) && isFinite(value))
}

export function timeUtil(time) {
  if (isUnixTimestamp(time)) {
    return dayjs.unix(time)
  } else {
    return dayjs(time)
  }
}

export function isUnixTimestamp(v) {
  if (_isNumber(v)) {
    v = parseFloat(v)

    return /^\d{8,11}$/.test(v) ? true : false
  } else {
    return false
  }
}

export function standardDate(time) {
  return timeUtil(time).format("MMM DD, YYYY")
}

export function standardTime(time) {
  return timeUtil(time).format("h:mma (MM/D)")
}

export function internationalDate(time) {
  return timeUtil(time).format("YYYY-M-DD")
}

export function internationalMonth(time) {
  return timeUtil(time).format("YYYY-MM")
}

export function toDate(time) {
  return timeUtil(time).toDate()
}

export function timestamp(date = null) {
  if (!date) {
    return timeUtil().unix()
  } else {
    return timeUtil(date).unix()
  }
}
