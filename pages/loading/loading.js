var app = getApp()
Page({
  data: {
  },
  onLoad () {
    app.ready().then(() => {
      setTimeout(() => {
        wx.redirectTo({
          url: '../index/index'
        })
      }, 1000)
    })
  }
})
