const Component = require('../../lib/component.js')

const app = getApp()

const { fns: { omitBy, isNil } } = require('../../lib/mobcent.js')

function Createforum(key, module) {
    this.pageData = module.data ? module.data : ''
    Component.call(this, key)
    this.data = {
        isLogin: false,
        isForumlist: true,     // 是否展示版块列表
        forumList: [],       // 版块列表
        iconSrc: app.globalData.iconSrc,
        isTopicPanel: false,  // 是否展示分类信息
        topicPanelList: [],
        // userInfo: {},
        // tempFilePaths: '',
        selectType: null,
        // title: '',
        // content: '',
        // imagelist: [],
        // deleteUrl: '',
        // actType: '',
        // isTopic: false,
        // tiId: null,
        fid: null,
        appColor: `#${app.config.COLOR}`,
        topicList: [],
        // selectTopicId: '',
        // isfocus: false   // textarea 焦点
    }
}

Createforum.prototype = Object.create(Component.prototype)
Createforum.prototype.name = 'createforum'
Createforum.prototype.constructor = Createforum

Createforum.prototype.onLoad = function () {
    let opts = this.pageData
    let data = Object.assign({
        fid: null,
        actType: 'new',
        isTopic: false,
        tiId: null
    }, opts)
    // 判断是否有版块 fid 有值
    if (data.fid) {
        data.isForumlist = false
        this.setData(Object.assign(data))
    }
    let promise = new Promise((resolve) => {
        if (data.fid) {
            return resolve(data.fid)
        }
        // 查找
        return app.api.forumList().then(res => {
            this.setData({
                forumList: res.list
            })
            return resolve()
        })
    })
    promise.then(fid => {
        // return this.getTopicPanelList().then()
        if (fid) {
            return this.getTopicPanelList()
        }
        return null
    }).then(topicPanelList => {
        if (topicPanelList && topicPanelList.length > 0) {
            return this.setData({
                isTopicPanel: true
            })
        }
        return null
    }).then(() => {
        this.getTopicList()
    })


    // if (app.globalData.userInfo) {
    //     // 判断用户是否登录
    //     Object.assign(data, {
    //         isLogin: true,
    //         userInfo: app.globalData.userInfo
    //     })
    // } else {
    //     console.info('no auth')
    // }

    // 当没有版块ID时 需要获取板块列表
    // if (!data.fid && !data.isTopic) {
    //     app.api.forumList().then((res) => {
    //         const { list } = res
    //         const selectType = list[0].board_list[0].board_id
    //         const selectNameArray = [] // [...Array(10).keys()]
    //         const selectValueArray = []
    //         list.forEach(categoryList => categoryList.board_list.forEach((board) => {
    //             selectNameArray.push(`${categoryList.board_category_name}/${board.board_name}`)
    //             selectValueArray.push(board.board_id)
    //         }))
    //         Object.assign(data, { selectNameArray, selectValueArray, selectType, selectTopicId: '' })
    //         this.setData(data)
    //         this.getTopicList()
    //     })
    // } else if (data.isTopic) {
    //     this.setData(Object.assign(data, { selectType: data.fid }))
    // } else {
    //     Object.assign(data, { selectType: data.fid })
    //     this.setData(data)
    //     this.getTopicList()
    // }
}

Createforum.prototype.onReady = function () {
    this.changePageTitle()
}
// 选择板块
Createforum.prototype.selectedChange = function (e) {
    const { fid, boardname } = e.currentTarget.dataset
    app.createForum({ fid, boardname })
}

// 改变页面的头部信息
Createforum.prototype.changePageTitle = function () {
    const { isForumlist, isTopicPanel } = this.data
    if (isForumlist) {
        wx.setNavigationBarTitle({
            title: '选择发布板块'
        })
    } else if (isTopicPanel) {
        wx.setNavigationBarTitle({
            title: '分类信息'
        })
    } else {
        wx.setNavigationBarTitle({
            title: '发帖'
        })
    }
}

// 主题列表
Createforum.prototype.getTopicList = function () {
    const { fid: topicId } = this.data
    app.api.forum(topicId).then(res => {
        this.setData({
            topicList: res.classificationType_list
        })
    })
}


// 得到分类信息
Createforum.prototype.getTopicPanelList = function () {
    const { fid } = this.data
    console.log('getTopicPanelList', fid)
    return app.api.topiclist({ boardId: fid }).then(res => {
        console.log(444444, res)
        let data = {
            isTopicPanel: true,
            topicPanelList: res.newTopicPanel
        }
        if (res.newTopicPanel.length === 1 && res.newTopicPanel[0].type === 'normal') {
            data.isTopicPanel = false
        }
        this.setData(data)
        return res.newTopicPanel
    })
}
// 选择分类信息
Createforum.prototype.selectClassInfo = function (e) {
    const { classinfoid, classinfoname, classinfotype } = e.currentTarget.dataset
    this.setData({
        classinfoid,
        classinfoname,
        classinfotype,
        isTopicPanel: false,
    })
}
// 改变主题id
Createforum.prototype.selectTopicId = function (e) {
    const { topicId: selectTopicId } = e.currentTarget.dataset
    this.setData({
        selectTopicId
    })
}


// 当textarea失去焦点存储数据
Createforum.prototype.blurAndChangeContent = function (e) {
    const { value: content } = e.detail
    this.setData({
        content,
        isfocus: false
    })
}

// 保存头部
Createforum.prototype.changeTitle = function (e) {
    const { value: title } = e.detail
    this.setData({ title })
}

// 选择图片
Createforum.prototype.chooseImg = function () {
    wx.chooseImage({
        count: 9, // 默认9
        sizeType: [ 'original', 'compressed' ], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: [ 'album', 'camera' ], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            let { tempFilePaths } = res
            let imagelist = this.data.imagelist.concat(tempFilePaths)
            if (imagelist.length > 10) {
                imagelist = imagelist.splice(0, 9)
            }
            this.setData({
                imagelist
            })
        },
        fail: err => {
            console.log('err', err)
        },
        complete: result => {
            console.log('complete', result)
        }
    })
}
// 预览图片
Createforum.prototype.previewImage = function (event) {
    const { currentUrl } = event.currentTarget.dataset
    // 如果是已经选中取消
    if (currentUrl == this.data.deleteUrl) {
        this.setData({
            deleteUrl: ''
        })
    } else {
        this.setData({
            deleteUrl: currentUrl
        })
    }
}

 // 删除上传图片
Createforum.prototype.deleteImage = function (event) {
    const { currentUrl } = event.currentTarget.dataset
    let { imagelist } = this.data
    imagelist.splice(imagelist.indexOf(currentUrl), 1)
    this.setData({
        imagelist,
        deleteUrl: null
    })
}
    // 发表评论
Createforum.prototype.submit = function () {
    if (!app.isLogin()) {
        return
    }

    const { title, content, actType, tiId, selectType, isTopic, imagelist, selectTopicId } = this.data
    let topicContent = []

    // 文本处理
    if (content !== '') {
        topicContent.push({ type: '0', infor: content })
    }
    imagelist.length && wx.showToast({
        title: '上传中...',
        icon: 'loading',
        duration: 10000
    })
    Promise.all(imagelist.map(v => {
        return app.api.sendattachmentex({
            filePath: v,
            formData: omitBy({
                type: 'image',
                module: isTopic ? 'topic' : 'forum',
                fid: selectType,
                ti_id: tiId
            }, isNil)
        }).then(data => data.body.attachment[0])
    }))
    .then(list => {
        list.length && wx.hideToast()
        topicContent = topicContent.concat(list.map(x => ({ type: '1', infor: x.urlName })))
        return {
            aid: list.map(x => x.id).join(','),
            content: encodeURIComponent(JSON.stringify(topicContent))
        }
    })
    .then(data => {
        return app.api.createTopic(Object.assign({
            isShowPostion: 0, // 是否显示地理位置
            act: actType,
            fid: selectType,
            typeId: selectTopicId,
            ti_id: tiId,
            title: encodeURIComponent(title)
        }, data)).then(() => {
            wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 1500,
                success: () => {
                    wx.navigateBack()
                }
            })
        })
    })
    .catch(err => {
        console.error('发表失败', err)
    })
}


module.exports = Createforum
