var app = getApp()
Page({
  data: {
    tabs: [],
    module: null,
    resources: {}
  },
  onReady() {
    const module = app.getModule()
    wx.setNavigationBarTitle({
      title: module.title
    })
  },
  onLoad() {
    const module = app.getModule()
    app.getResources(module).then(resources => {
      console.log(resources)
      this.setData({
        resources
      })
    })
    this.setData({
      tabs: app.globalData.tabs,
      module
    })
  }
})
