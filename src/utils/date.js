const now = new Date() // 当前日期
const nowDayOfWeek = now.getDay() // 今天本周的第几天
const nowDay = now.getDate() // 当前日
const nowMonth = now.getMonth() // 当前月
let nowYear = now.getYear() // 当前年
nowYear += nowYear < 2000 ? 1900 : 0

const DateUtil = {
  /**
   * 获得当前日期
   *
   * @returns
   */
  getNowDay() {
    return this.formatDate(new Date())
  },
  /**
   * 获得本周的开始时间
   *
   * @returns
   */
  getStartDayOfWeek() {
    const day = nowDayOfWeek || 7
    return this.formatDate(new Date(now.getFullYear(), nowMonth, nowDay + 1 - day))
  },
  /**
   * 获得本周的结束时间
   *
   * @returns
   */
  getEndDayOfWeek() {
    const day = nowDayOfWeek || 7
    return this.formatDate(new Date(now.getFullYear(), nowMonth, nowDay + 7 - day))
  },
  /**
   * 获得本月的开始时间
   *
   * @returns
   */
  getStartDayOfMonth() {
    const monthStartDate = new Date(nowYear, nowMonth, 1)
    return this.formatDate(monthStartDate)
  },
  /**
   * 获得本月的结束时间
   *
   * @returns
   */
  getEndDayOfMonth() {
    const monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays())
    return this.formatDate(monthEndDate)
  },
  /**
   * 获得本月天数
   *
   * @returns
   */
  getMonthDays() {
    const monthStartDate = new Date(nowYear, nowMonth, 1)
    const monthEndDate = new Date(nowYear, nowMonth + 1, 1)
    const days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
    return days
  },
  /**
   * @param 日期格式化
   * @returns {String}
   */
  formatDate(date) {
    const myyear = date.getFullYear()
    let mymonth = date.getMonth() + 1
    let myweekday = date.getDate()

    if (mymonth < 10) {
      mymonth = '0' + mymonth
    }
    if (myweekday < 10) {
      myweekday = '0' + myweekday
    }
    return myyear + '-' + mymonth + '-' + myweekday
  },
  /**
   * 得到本季度开始的月份
   * @param month 需要计算的月份
   */
  getQuarterSeasonStartMonth(month) {
    // const quarterMonthStart = 0;
    const spring = 0 // 春
    const summer = 3 // 夏
    const fall = 6 // 秋
    const winter = 9 // 冬
    // 月份从0-11
    if (month < 3) {
      return spring
    }
    if (month < 6) {
      return summer
    }
    if (month < 9) {
      return fall
    }
    return winter
  },
  /**
   * 获得本季度的起止日期
   *
   * @returns
   */
  getCurrentSeason() {
    // 起止日期数组
    const startStop = []
    // 获取当前时间
    const currentDate = new Date()
    // 获得当前月份0-11
    const currentMonth = currentDate.getMonth()
    // 获得当前年份4位年
    const currentYear = currentDate.getFullYear()
    // 获得本季度开始月份
    const quarterSeasonStartMonth = this.getQuarterSeasonStartMonth(currentMonth)
    // 获得本季度结束月份
    const quarterSeasonEndMonth = quarterSeasonStartMonth + 2

    // 获得本季度开始的日期
    const quarterSeasonStartDate = this.formatDate(
      new Date(currentYear, quarterSeasonStartMonth, 1)
    )
    // 获得本季度结束的日期
    const quarterSeasonEndDate = this.formatDate(
      new Date(
        currentYear,
        quarterSeasonEndMonth,
        this.getMonthDays(currentYear, quarterSeasonEndMonth)
      )
    )
    // 加入数组返回
    startStop.push(quarterSeasonStartDate)
    startStop.push(quarterSeasonEndDate)
    // 返回
    return startStop
  },
  /**
   * 得到上季度的起始日期
   * year 这个年应该是运算后得到的当前本季度的年份
   * month 这个应该是运算后得到的当前季度的开始月份
   */
  getPriorSeasonFirstDay(year, month) {
    let current = 0
    if (month < 3) {
      current = 0
    } else if (month < 6 && month >= 3) {
      current = 3
    } else if (month < 9 && month >= 6) {
      current = 6
    } else {
      current = 9
    }
    // const quarterMonthStart = 0;
    const spring = 0 // 春
    const summer = 3 // 夏
    const fall = 6 // 秋
    const winter = 9 // 冬
    // 月份从0-11
    switch (current) {
      // 季度的其实月份
      case spring:
        // 如果是第一季度则应该到去年的冬季
        year--
        month = winter
        break
      case summer:
        month = spring
        break
      case fall:
        month = summer
        break
      case winter:
        month = fall
        break
    }

    return new Date(year, month, 1)
  },
  /** 获取该年月的天数 */
  getYearMonthDays(year, month) {
    // 本月第一天 1-31
    const relativeDate = new Date(year, month, 1)
    // 获得当前月份0-11
    let relativeMonth = relativeDate.getMonth()
    // 获得当前年份4位年
    let relativeYear = relativeDate.getFullYear()

    // 当为12月的时候年份需要加1
    // 月份需要更新为0 也就是下一年的第一个月
    if (relativeMonth == 11) {
      relativeYear++
      relativeMonth = 0
    } else {
      // 否则只是月份增加,以便求的下一月的第一天
      relativeMonth++
    }
    // 一天的毫秒数
    const millisecond = 1000 * 60 * 60 * 24
    // 下月的第一天
    const nextMonthDayOne = new Date(relativeYear, relativeMonth, 1)
    // 返回得到上月的最后一天,也就是本月总天数
    return new Date(nextMonthDayOne.getTime() - millisecond).getDate()
  },
  /**
   * 得到上季度的起止日期
   */
  getPreviousSeason() {
    // 起止日期数组
    const startStop = []
    // 获取当前时间
    const currentDate = new Date()
    // 获得当前月份0-11
    const currentMonth = currentDate.getMonth()
    // 获得当前年份4位年
    const currentYear = currentDate.getFullYear()
    // 上季度的第一天
    const priorSeasonFirstDay = this.getPriorSeasonFirstDay(currentYear, currentMonth)
    // 上季度的最后一天
    const priorSeasonLastDay = this.formatDate(
      new Date(
        priorSeasonFirstDay.getFullYear(),
        priorSeasonFirstDay.getMonth() + 2,
        this.getYearMonthDays(priorSeasonFirstDay.getFullYear(), priorSeasonFirstDay.getMonth() + 2)
      )
    )
    // 添加至数组
    startStop.push(this.formatDate(priorSeasonFirstDay))
    startStop.push(priorSeasonLastDay)
    return startStop
  }
}

export default DateUtil
