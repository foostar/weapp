var app = getApp()

Page({
  data: {
    isLogin: false
  },
  onLoad () {
    var self = this,
      title = app.globalData.modules[app.globalData.moduleId].componentList[0].title
    // 修改导航条
    // wx.setNavigationBarTitle({
    //   title: '话题'
    // })
  }
})
