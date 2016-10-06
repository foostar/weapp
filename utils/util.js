function formatTime(date) {
  if (typeof date === 'string') {
    date = parseInt(date, 10)
  }
  date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  var now = new Date()
  var sub = now.getTime() - date.getTime()

  var result = ""
  var subSecond = sub/1000
  if (subSecond < 60) {
    result = Math.floor(subSecond) + '秒前'
  } else if (subSecond/60 < 60) {
    result = Math.floor(subSecond/60) + '分钟前'
  } else if (subSecond/3600 < 24) {
    result = Math.floor(subSecond/3600) + '小时前'
  } else if (subSecond/3600/24 <= 3) {
    result = Math.floor(subSecond/3600/24) + '天前'
  } else {
    result = [year, month, day].map(formatNumber).join('-')
  }

  return result
}

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

module.exports = {
  formatTime,
  formateText
}
