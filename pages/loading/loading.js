var app = getApp()
Page({
  data: {
  },
  onLoad () {
    app.ready().then(() => {
      setTimeout(() => {
        wx.redirectTo({
          url: '../module/module'
        })
      }, 1000)
    })
  }
})
