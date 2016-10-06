var app = getApp()
Page({
  data: {
    tabs: [],
    module: null,
    resources: {}
  },
  onReady() {
    console.log(1)
    const module = app.getModule()
    wx.setNavigationBarTitle({
      title: module.title
    })
  },
  onLoad() {
    console.log(2)
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
  },
  changeModuleId(e) {
    app.to(e.currentTarget.dataset.moduleId, true)
  }
})
