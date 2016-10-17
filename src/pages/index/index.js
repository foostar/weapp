var app = getApp()

Page({
  data: {
    tabs: [],
    module: null,
    resources: {},
    currentTab: 0,
    loadMoreWord: '加载更多',
    scrollTop: 0,
    isLoading:true,
    toView: '',
    goToTopHidden: true
  },
  onLoad() {
    console.log('取出缓存里的数据', app)
    const module = app.getModule()
    app.getResources(module).then(resources => {
      console.log("resources",resources,module)
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
    const module = app.getModule()
    wx.setNavigationBarTitle({
      title: module.title
    })
  },
  switchTab(e) {
    const { index, moduleId } = e.currentTarget.dataset
    app.getResources(moduleId).then(resources => {
      this.setData({
        resources
      })
    })
    this.setData({
      currentTab: index
    })
  },
  goToTop() {
    console.log('触发 scrolltoupper 事件')
    this.setData({
      // scrollTop:  0
      toView: 'top'
    })
  },
  scrolltoupper() {
    console.log(12222242345678)
    this.setData({
      goToTopHidden: false
    })
  },
  // 改变全局的moduleId
  changeModuleId(e) {
    console.log("moduleId",e.currentTarget.dataset.moduleId)
    app.to(e.currentTarget.dataset.moduleId, true)
  },
    clickItem(e) {
        app.showPost(e.currentTarget.id)
    }
})
