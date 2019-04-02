import dayjs from "dayjs"

export default Factor => {
  return new class {
    constructor() {
      this.init()
    }

    init() {
      dayjs.extend(this.extend)
    }

    util(time) {
      if (this.isUnixTimestamp(time)) {
        return dayjs.unix(time)
      } else {
        return dayjs(time)
      }
    }

    iMonth() {
      return this.util().format("YYYY-MM")
    }

    niceFormat(time) {
      return this.util(time).format("MMM DD, YYYY")
    }

    timeFormat(time) {
      return this.util(time).format("HH:mm, MMM D")
    }

    iFormat(time) {
      return this.util(time).format("YYYY-MM-DD")
    }

    stamp(date = null) {
      if (!date) {
        return this.util().unix()
      } else {
        return this.util(date).unix()
      }
    }

    isUnixTimestamp(v) {
      if (this._isNumber(v)) {
        v = parseFloat(v)

        const digit10 = /^\d{10}$/
        return digit10.test(v) ? true : false
      } else {
        return false
      }
    }

    _isNumber(value) {
      return !!(!isNaN(parseFloat(value)) && isFinite(value))
    }

    extend(option, dayjsClass, dayjsFactory) {
      // const oldSame = dayjsClass.prototype.isSame
      // dayjsClass.prototype.isSame = function(date, unit = false) {
      //   const dateA = this
      //   const dateB = dayjsFactory(date)
      //   let format = false
      //   if (unit == "month") {
      //     format = "YYYYMM"
      //   } else if (unit == "date") {
      //     format = "YYYYMMDD"
      //   }
      //   if (format) {
      //     return dateA.format(format) == dateB.format(format) ? true : false
      //   } else {
      //     return oldSame.call(this, dateB)
      //   }
      // }
      // dayjsClass.prototype.isBetween = function(date1, date2, unit = false) {
      //   const dateA = this
      //   let dateB = dayjsFactory(date1)
      //   let dateC = dayjsFactory(date2)
      //   if (dateC.isBefore(dateB)) {
      //     const tmp = dateC
      //     dateC = dateB
      //     dateB = tmp
      //   }
      //   let format = false
      //   if (unit == "month") {
      //     format = "YYYYMM"
      //   } else if (unit == "day") {
      //     format = "YYYYMMDD"
      //   }
      //   if (format) {
      //     const AValue = parseInt(dateA.format(format))
      //     const BValue = parseInt(dateB.format(format))
      //     const CValue = parseInt(dateC.format(format))
      //     if (AValue >= BValue && AValue <= CValue) {
      //       return true
      //     } else {
      //       return false
      //     }
      //   } else {
      //     if (dateA.isAfter(dateB) && dateA.isBefore(dateC)) {
      //       return true
      //     } else {
      //       return false
      //     }
      //   }
      // }
    }
  }()
}
