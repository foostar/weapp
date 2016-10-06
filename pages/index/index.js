var app = getApp()

Page({
  data: {
    tabs: [],
    module: null,
    resources: {},
    currentTab: 0,
    loadMoreWord: '加载更多',
    scrollTop: 0,
    toView: '',
    goToTopHidden: true
  },
  onLoad() {
    console.log(app.globalData.info)
    const module = app.getModule()
    console.log('--->', module)
    app.getResources(module).then(resources => {
      // console.log('resources --> ', resources)
      this.setData({
        resources
      })
    })
    this.setData({
      tabs: app.globalData.tabs,
      module
    })
  },
  onReady() {
    // console.log('===>', app.globalData.modules)
    const module = app.getModule()
    wx.setNavigationBarTitle({
      title: module.title
    })
  },
  switchTab(e) {
    console.log('e --> ', e)
    const { index, moduleId } = e.currentTarget.dataset
    // const module = app.getModule(moduleId)
    app.getResources(moduleId).then(resources => {
      console.log('resources --> ', resources)
      this.setData({
        resources
      })
    })
    this.setData({
      currentTab: index
    })
  },
  goToTop() {
    this.setData({
      // scrollTop: 0
      toView: 'top'
    })
  },
  scrolltoupper() {
    console.log(12222242345678)
    this.setData({
      goToTopHidden: false
    })
  }
})
