const Component = require('../../lib/component.js')
const Classifications = require('../classifications/classifications.js')
// const Promise = require('../../lib/promise.js')

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
        publishInfo: {},  // 分类信息内容
        contentText: [],  // 发帖内容上下问
        contentTextId: 0,  // 发帖内容上下文id
        selectItemId: null, // 选中二次编辑 id
        textInputInfo: null, // 输入文本的内容
        imageInputInfo: null, // 图片进行编辑
        recordTempFilePath: null, // 录音的
        classinfoid: null,
        title: '',
        imagelist: [],
        deleteUrl: '',
        actType: '',
        isTopic: false,
        tiId: null,
        fid: null,
        appColor: `#${app.config.COLOR}`,
        topicList: [],     // 主题列表
        titopicList: [],     // 话题列表
        selectTopicId: '',  // 选择主题id
        selectTiTopicId: '',  // 选择话题id
        topicIndex: 0, // 主题数组索引

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


    if (app.globalData.userInfo) {
        // 判断用户是否登录
        Object.assign(data, {
            isLogin: true,
            userInfo: app.globalData.userInfo
        })
    } else {
        console.info('no auth')
    }

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
        return app.api.search('', 'topic', { searchid: data.fid })
    }).then((res) => {
        console.log('话题列表', res)
        // 话题列表
        this.setData({
            titopicList: res.list
        })

        this.changePageTitle()
        this.getTopicList()
        this.getAtUserlist()
    })
    .catch(e => console.log('init createforum', e))
}

Createforum.prototype.onReady = function () {
    this.changePageTitle()
    const { contentText } = this.data
    contentText.forEach(item => {
        if (item.type === 3) {
            this[`audioCtx${item.contentTextId}`] = wx.createAudioContext(`myAudio${item.contentTextId}`)
        }
    })
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
    app.api.getSetting().then(res => {
        const { postInfo } = res.body
        const obj = postInfo.filter(item => {
            return item.fid === topicId
        })
        console.log(2222, obj[0].topic.classificationType_list)
        this.setData({
            topicList: obj[0].topic.classificationType_list,
            selectTopicId: obj[0].topic.classificationType_id
        })
        return app.api.forum(topicId)
    }).then(res => {
        this.setData({
            boardname: res.forum.name,
        })
    })

    // app.api.forum(topicId).then(res => {
    //     this.setData({
    //         topicList: res.typeInfo,
    //         boardname: res.forum.name,
    //         selectTopicId: res.typeInfo[0].id
    //     })
    // })
}

// @好友列表
Createforum.prototype.getAtUserlist = function () {
    app.api.atuserlist().then(res => {
        console.log('userlist', res)
    })
}

// 得到分类信息
Createforum.prototype.getTopicPanelList = function (fid) {
    return app.api.forum(fid).then(res => {
        let data = {
            isTopicPanel: true,
            topicPanelList: res.panel
        }
        if (res.panel.length === 1 && res.panel[0].type === 'normal') {
            data.isTopicPanel = false
        }
        this.setData(data)
        return res.panel
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
    this.setData({
        radioIndex: value
    })
}

// 改变主题id
Createforum.prototype.selectTopicId = function (e) {
    const { topicList } = this.data
    const { value } = e.detail
    this.setData({
        topicIndex: value,
        selectTopicId: topicList[value].classificationType_id
    })
}

// 改变话题id
Createforum.prototype.selectTiTopicId = function (e) {
    const { topicId: selectTiTopicId } = e.currentTarget.dataset
    this.setData({
        selectTiTopicId,
        tiId: selectTiTopicId
    })
}

// 改变输入方式
Createforum.prototype.changeInputType = function (e) {
    console.log('改变输入方式', e)
    let obj = {
        textInput: false,
        pictureSelected: false,
        recordSelected: false,
        videoSelected: false,
        topicListSelected: false,
        titopicListSelected: false,
        hidden: true,
    }
    const { type } = e.target.dataset
    obj[type] = true
    if (type === 'hidden') {
        this.showInputTools(true)
    }
    if (type === 'videoSelected') {
        this.chooseVideo()
    }
    if (type === 'pictureSelected') {
        this.chooseImg()
    }
    if (type == 'classificationInfo') {
        this.onSubmit()
    }

    this.setData(obj)
}

// 视频编辑
Createforum.prototype.chooseVideo = function () {
    wx.chooseVideo({
        success: res => {
            this.showContentText('video', res.tempFilePath)
        }
    })
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
    // 0=文本 1=图片附件  3=音频 4=视频 9=空白插入点
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
    this.setData({
        textInputInfo: content
    })
}

// 输入结束
Createforum.prototype.bindconfirm = function () {
    const { selectItemId, textInputInfo } = this.data
    if (selectItemId) {
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
// 开始录音
Createforum.prototype.startRecord = function () {
    wx.startRecord({
        success: res => {
            let tempFilePath = res.tempFilePath
            this.showContentText('audio', tempFilePath)
        },
        fail: err => {
            console.log(err)
        }
    })
    setTimeout(() => {
        // 结束录音
        wx.stopRecord()
    }, 10000)
}
//  停止录音
Createforum.prototype.stopRecord = function () {
    wx.stopRecord()
}
// 播放
Createforum.prototype.playAudio = function (e) {
    const { audioTemp } = e.currentTarget.dataset
    wx.playVoice({
        filePath: audioTemp,
        success: () => {
            console.log('success')
        },
        fail: (err) => {
            console.log('err', err)
        },
        complete: () => {
            wx.stopVoice()
        }
    })
}
// 暂停
Createforum.prototype.pauseAudio = function () {
    wx.pauseVoice()
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

// 获取分类信息
Createforum.prototype.getClassificationInfo = function () {
    let typeOption = {}
    if (this.children) {
        const children = this.children
        Object.keys(children).map(key => {
            const data = children[key].data
            if (data.template === 'classifications') {
                if (data.classifiedType == 3) {
                    const value = data.selectedChoices.map(item => {
                        if (item.selected) {
                            return item.value
                        }
                        return null
                    })

                    return typeOption[data.classifiedName] = value.filter(item => item).join(',')
                }
                return typeOption[data.classifiedName] = data.inputValue
            }
            return null
        })
    }
    this.setData({
        typeOption
    })
}

// 新版发帖
Createforum.prototype.onSubmit = function () {
    if (!app.isLogin()) {
        return
    }
    this.getClassificationInfo()
    let { title, contentText, actType, tiId, classinfoid, fid, selectTopicId, typeOption } = this.data
    let typeOptionUploadFile
    let aid = []   // 附件
    // 过滤contentText 所有的空的插入点
    contentText = contentText.filter(item => {
        return item.type !== 9
    })
    // 得到contentText需要上传的文件
    let contentUploadFile = contentText.filter(item => {
        return item.type !== 0
    })
    // 得到分类信息上传附件
    if (typeOption) {
        typeOptionUploadFile = Object.keys(typeOption).filter(key => {
            return typeOption[key] instanceof Array
        })
    }


    (contentUploadFile.length || typeOptionUploadFile.length) && wx.showToast({
        title: '上传中...',
        icon: 'loading',
        duration: 10000
    })

    let promise = new Promise(resolve => {
        // 上传图片附件信息
        return Promise.all(contentUploadFile.map(v => {
            const formdata = omitBy({
                type: 'image',
                module: 'forum',
                fid,
                ti_id: tiId
            }, isNil)
            console.log(11111, v, formdata)
            return app.api.sendattachmentex({
                filePath: v.value,
                formData: formdata
            }).then(data => data.body.attachment[0])
            .catch(e => console.log(e))
        })).then(uploadFileList => {
            console.log(2222, uploadFileList)
            // 修改
            uploadFileList.forEach((tempFile, index) => {
                aid.push(tempFile.id)
                var contentId = contentUploadFile[index].contentTextId
                contentText = contentText.map(item => {
                    if (item.contentTextId === contentId) {
                        item.value = tempFile.urlName
                        return item
                    }
                    return item
                })
            })
            aid = aid.join(',')
            return resolve(contentText)
        })
    })
    promise.then(() => {
        console.log(33333)
        // 上传分类附件
        return Promise.all(typeOptionUploadFile.map(key => {
            return app.api.sendattachmentex({
                filePath: typeOption[key][0],
                formData: omitBy({
                    type: 'image',
                    module: 'forum',
                    fid,
                    ti_id: tiId
                }, isNil)
            }).then(data => data.body.attachment[0])
        }))
    })
    .then(uploadFileList => {
        console.log(4444, uploadFileList, typeOptionUploadFile)
        typeOptionUploadFile.map((key, index) => {
            return typeOption[key] = uploadFileList[index].id
        })

        // uploadFileList.forEach((tempFile, index) => {
        //     typeOption.typeOptionUploadFile[index] = tempFile.id
        // })
        return
    })
    .then(() => {
        console.log(555)
        // 上传帖子内容
        contentText.map(item => {
            item.infor = item.value
            delete item.value
            delete item.contentTextId
            return item
        })
        return {
            aid,
            content: encodeURIComponent(JSON.stringify(contentText))
        }
    })
    .then(data => {
        console.log(666, data)
        data = Object.assign({
            isShowPostion: 0, // 是否显示地理位置
            act: actType,
            fid,
            typeOption,
            typeId: selectTopicId,
            sortId: classinfoid,
            ti_id: tiId,
            title: encodeURIComponent(title)
        }, data)

        return app.api.createTopic(data).then(() => {
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
