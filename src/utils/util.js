function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formateText(str = '', length = 40) {
    length = parseInt(length, 10)
    if (str.length > length) {
        str = str.substr(0, length)
        if (length !== 0) {
            str += '...'
        }
    }
    return str
}

const dateFormat = (date, format = 'yyyy-MM-dd hh:mm-ss', readability = true) => {
    if (typeof date === 'string' && /^\d+$/.test(date)) {
        date = new Date(+date)
    }

    if (!(date instanceof Date)) {
        date = new Date(date)
    }

    const duration = Date.now() - date
    const level1 = 60 * 1000                // 1 分钟
    const level2 = 60 * 60 * 1000           // 1 小时
    const level3 = 24 * 60 * 60 * 1000      // 1 天
    const level4 = 3 * 24 * 60 * 60 * 1000  // 3 天
    if (readability && duration < level4) {
        let str = ''
        if (duration < level1) str = '刚刚'
        if (duration > level1 && duration < level2) str = `${Math.round(duration / level1)}分钟前`
        if (duration > level2 && duration < level3) str = `${Math.round(duration / level2)}小时前`
        if (duration > level3 && duration < level4) str = `${Math.round(duration / level3)}天前`
        return str
    }

    const o = {
        'M+': date.getMonth() + 1,  // 月份
        'd+': date.getDate(),       // 日
        'h+': date.getHours(),      // 小时
        'm+': date.getMinutes(),    // 分
        's+': date.getSeconds(),    // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length))
    }
    Object.keys(o).forEach((k) => {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((String(o[k])).length)))
        }
    })
    return format
}

module.exports = {
    dateFormat,
    formatTime(date) {
        return dateFormat(date)
    },
    formateText
}