var app = getApp()
Page({
    data: {
        isLogin: false,
        userInfo: {},
        tabs: [],
        appColor: '#000',
        module: {},
        activeModule: {},
        isLoading: false,
        nestModule: {},
        resources: {},
        templateResources: {},
        windowHeight: 300,
        windowWidth: 320,
        currentTab: 0,
        currentBoard: 10000,
        currentBoardList: []
    },
    onLoad() {
        console.log('onload')
        // 判断用户是否登录
        if (app.globalData.userInfo) {
            this.setData({
                isLogin: true,
                userInfo: app.globalData.userInfo
            })
        }
        app.event.on('login', (userInfo) => {
            this.setData({
                isLogin: !!userInfo,
                userInfo
            })
            this.fetchData()
        })
        const module = app.getModule()
        // 设置tabs
        this.setData({
            currentTab: module.id,
            appColor: app.globalData.info.appColor.substr(1),
            tabs: app.globalData.tabs
        })
        this.fetchData()
    },
    /*
     * @设置module和resources
     */
    fetchData() {
        const module = app.getModule()
        // 设置module和resources
        if (module.type !== 'moduleRef') {
            return app.getResources(module).then((resources) => {
                this.setData({
                    resources,
                    templateResources: resources,
                    activeModule: module.componentList[0],
                    isLoading: true,
                    nestModule: {},
                    module
                })
            })
        }
        const nestModule = app.getModule(module.extParams.moduleId)
        app.getResources(module.extParams.moduleId).then((resources) => {
            this.setData({
                resources,
                templateResources: resources,
                activeModule: module.componentList[0],
                nestModule,
                isLoading: true,
                module
            })
        })
    },
    changeTap(event) {
        var self = this
        this.setData({
            activeModule: self.data.module.componentList[event.target.dataset.id],
            isLoading: false
        })
        if (event.target.dataset.type !== 'moduleRef') {
            return app.getResources(event.target.dataset.id).then((resources) => {
                this.setData({
                    resources,
                    templateResources: resources,
                    nestModule: {},
                    isLoading: true
                })
            })
        }
        const getResources = app.getResources(event.target.dataset.moduleId)
        const nestModule = app.getModule(event.target.dataset.moduleId)
        getResources.then((resources) => {
            return this.setData({
                resources,
                templateResources: resources,
                nestModule,
                isLoading: true
            })
        })
    },
    onShow() {
        wx.setNavigationBarTitle({
            title: '社区'
        })
    },
    onReady() {
        console.log('onReady')
        wx.setNavigationBarTitle({
            title: '社区'
        })
        app.event.on('logout', (userInfo) => {
            this.setData({
                isLogin: !!userInfo,
                userInfo
            })
            this.fetchData()
        })
        // 设置屏幕宽高
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            }
        })
    },
    /*
     *  @切换版块关注列表
     */
    changeBoard(e) {
        var self = this
        self.setData({
            currentBoard: e.target.dataset.id,
        })
        if (e.target.dataset.id == 10000) {
            return self.setData({
                currentBoardList: this.data.resources[this.data.activeModule.id].rec.recommendedBoard
            })
        }
        this.data.resources[this.data.activeModule.id].list.forEach((v) => {
            if (v.board_category_id == e.target.dataset.id) {
                self.setData({
                    currentBoardList: v.board_list
                })
            }
        })
    },
    /*
     *   @ 关注和取消关注话题
     */
    focusBoard(event) {
        var self = this
        var boardId = event.target.dataset.id
        if (event.target.dataset.role) {
            if (!app.isLogin()) return
            self.setData({
                isLoading: false
            })
            if (event.target.dataset.role == 'focus') {
                app.api.userfavorite(boardId, { action: 'favorite', idType: 'fid' }).then(() => {
                    var recommendedBoard
                    var addedfocusBoard
                    if (self.data.currentBoard == 10000) {
                        // 增加关注列表
                        addedfocusBoard = self.data.resources[self.data.activeModule.id].rec.recommendedBoard.filter(item => item.board_id == boardId)[0]
                        // 减去推荐列表
                        recommendedBoard = self.data.resources[self.data.activeModule.id].rec.recommendedBoard.filter(item => item.board_id != boardId)
                        self.data.resources[self.data.activeModule.id].rec.recommendedBoard = recommendedBoard
                        // 重新拉取数据
                        // self.fetchData()
                    } else {
                        // 改变列表中关注的状态值
                        self.data.resources[self.data.activeModule.id].list.forEach(item => {
                            if (item.board_category_id == self.data.currentBoard) {
                                addedfocusBoard = item.board_list.filter(board => board.board_id == boardId)[0]
                                item.board_list.forEach(board => {
                                    if (board.board_id == boardId) {
                                        board.is_focus = 1
                                    }
                                })
                            }
                        })
                    }
                    self.data.resources[self.data.activeModule.id].rec.focusBoard.push(addedfocusBoard)
                    // 更改当前页面列表里的状态值
                    self.data.currentBoardList.forEach(item => {
                        if (item.board_id == boardId) {
                            item.is_focus = 1
                        }
                    })
                    self.setData({
                        resources: self.data.resources,
                        currentBoardList: self.data.currentBoardList,
                        isLoading: true
                    })
                })
            }
            if (event.target.dataset.role == 'unfocus') {
                app.api.userfavorite(boardId, { action: 'delfavorite', idType: 'fid' }).then(() => {
                    // 减去关注列表
                    var focusBoard = self.data.resources[self.data.activeModule.id].rec.focusBoard.filter(item => item.board_id != boardId)
                    self.data.resources[self.data.activeModule.id].rec.focusBoard = focusBoard
                    // 改变列表中关注的状态值
                    self.data.resources[self.data.activeModule.id].list.forEach(item => {
                        item.board_list.forEach(board => {
                            if (board.board_id == boardId) {
                                board.is_focus = 0
                            }
                        })
                    })
                    self.setData({
                        resources: self.data.resources,
                        isLoading: true
                    })
                })
            }
        }
    },
    // 改变全局的moduleId
    changeModuleId(e) {
        app.to(e.currentTarget.dataset.moduleId, true)
    },
})
