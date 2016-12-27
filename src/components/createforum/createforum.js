const Component = require('../../lib/component.js')
const Classifications = require('../classifications/classifications.js')

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
        isPublish: false,      // 是否发帖
        showInputTools: false,  // 是否显示发帖工具栏
        userInfo: {},
        tempFilePaths: '',
        selectType: null,
        publishInfo: {},  // 分类信息内容
        contentText: [],  // 发帖内容上下问
        contentTextId: 0,  // 发帖内容上下文id
        selectItemId: null, // 选中二次编辑 id
        textInputInfo: null, // 输入文本的内容
        imageInputInfo: null, // 图片进行编辑
        title: '',
        imagelist: [],
        deleteUrl: '',
        actType: '',
        isTopic: false,
        tiId: null,
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
    return promise.then(fid => {
        return this.getTopicPanelList(fid)
    }).then(topicPanelList => {
        if (topicPanelList && topicPanelList.length > 0) {
            this.setData({
                isTopicPanel: true
            })
        }
        return
    }).then(() => {
        this.changePageTitle()
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
    console.log('onReady', this.data)
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
Createforum.prototype.getTopicPanelList = function (fid) {
    return app.api.topiclist({ boardId: fid }).then(res => {
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
    let self = this

    if (classinfoid) {
        // 发帖样式
        return app.api.classify(classinfoid).then(res => {
            this.setData({
                classinfoid,
                classinfoname,
                classinfotype,
                isTopicPanel: false,
                isPublish: true,
                publishInfo: res.body.classified,
            })
            // 创建添加自组建
            res.body.classified.map((item, index) => {
                return self.add(new Classifications(`classificaid${index}`, item))
            })
        })
    }
    return this.setData({
        classinfoid,
        classinfoname,
        classinfotype,
        isTopicPanel: false,
        isPublish: true
    })
}


// 单选选择器
Createforum.prototype.bindPickerChange = function (event) {
    let { value } = event.detail
    console.log('value', value, event.detail)
    this.setData({
        radioIndex: value
    })
}

// 改变主题id
Createforum.prototype.selectTopicId = function (e) {
    const { topicId: selectTopicId } = e.currentTarget.dataset
    this.setData({
        selectTopicId
    })
}

// 改变输入方式
Createforum.prototype.changeInputType = function (e) {
    console.log('改变输入方式', e)
    let obj = {
        textInput: false,
        pictureSelected: false,
        hidden: true
    }
    const { type } = e.target.dataset
    obj[type] = true
    if (type === 'hidden') {
        return this.showInputTools(true)
    }
    this.setData(obj)
}

// 展示编辑
Createforum.prototype.showTools = function (e) {
    const { viewId } = e.target.dataset
    const { contentText } = this.data
    let updateInfo = {}
    if (viewId) {
        contentText.forEach(item => {
            if (item.contentTextId == viewId) {
                updateInfo = item
            }
        })
        if (updateInfo.type === 0) {
            this.setData({
                selectItemId: viewId,
                textInputInfo: updateInfo.value
            })
        }
        if (updateInfo.type === 1) {
            let imagelist = []
            imagelist.push(updateInfo.value)
            this.setData({
                selectItemId: viewId,
                // imageInputInfo: updateInfo.value
                imagelist
            })
        }
        if (updateInfo.type === 9) {
            this.setData({
                selectItemId: viewId
            })
        }
    }
    this.showInputTools()
}

// 展示输入控件
Createforum.prototype.showInputTools = function (opt) {
    let showInputTools = true
    if (opt) {
        showInputTools = false
    }
    this.setData({
        showInputTools
    })
}

// 发帖展示信息
Createforum.prototype.showContentText = function (type, value) {
    /* eslint-disable */
    let update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null
    /* eslint-enable */
    let { contentTextId, contentText } = this.data
    // 0=文本 1=图片附件 3=音频 4=视频 9=空白插入点
    const typeObj = {
        text: 0,
        pictrue: 1,
        audio: 3,
        video: 4,
        insert: 9
    }
    let contentItem = { type: 10 }
    let contentIndex = 0

    if (update) {
        contentText.forEach((item, index) => {
            if (item.contentTextId == update.selectItemId) {
                contentItem = item
                contentIndex = index
            }
        })
    }
    // 制定几点插入
    if (contentItem.type === 9 && update && value) {
        contentIndex += 1
        contentTextId += 1
        contentText.splice(contentIndex, 0, { value, type: typeObj[type], contentTextId })
        contentIndex += 1
        contentTextId += 1
        contentText.splice(contentIndex, 0, { value: null, type: 9, contentTextId })
        this.setData({
            contentText,
            contentTextId,
            selectItemId: null,
            textInputInfo: null
        })
    } else if (update && value) {
        // 修改编辑
        contentText[contentIndex].value = value
        this.setData({
            contentText,
            selectItemId: null,
            textInputInfo: null
        })
    } else if (update && !value) {
        // 删除元素
        contentText.splice(contentIndex, 1)
        contentText.splice(contentIndex, 1)
        this.setData({
            contentText,
            selectItemId: null,
            textInputInfo: null
        })
    } else {
        contentTextId += 1
        contentText.push({ value, type: typeObj[type], contentTextId })
        contentTextId += 1
        contentText.push({ value: null, type: 9, contentTextId })
        this.setData({
            contentText,
            contentTextId,
            textInputInfo: null
        })
    }
}

// 选择图展示
Createforum.prototype.chooseImageOver = function () {
    const { selectItemId, imagelist = [] } = this.data
    console.log(111, selectItemId, imagelist)
    if (imagelist.length === 0 && selectItemId) {
        return this.showContentText('pictrue', null, { selectItemId })
    }
    imagelist.map(url => {
        if (selectItemId) {
            return this.showContentText('pictrue', url, { selectItemId })
        }
        return this.showContentText('pictrue', url)
    })

    this.setData({
        imagelist: [],
    })
}


// 输入内容
Createforum.prototype.bindInput = function (e) {
    const { value: content } = e.detail
    console.log(111, content)
    this.setData({
        textInputInfo: content
    })
}

// 输入结束
Createforum.prototype.bindconfirm = function () {
    const { selectItemId, textInputInfo } = this.data
    if (selectItemId) {
        console.log('updata1111', selectItemId)
        return this.showContentText('text', textInputInfo, { selectItemId })
    }
    return this.showContentText('text', textInputInfo)
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
