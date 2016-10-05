var app = getApp()
Page({
  data: {
    tabs: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    this.setData({
      tabs: app.globalData.tabs
    })
  }
})
