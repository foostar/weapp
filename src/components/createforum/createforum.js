const Component = require('../../lib/component')

const app = getApp()


function Createforum(key, module) {
    this.pageData = module.data ? module.data : ''
    Component.call(this, key)
    this.data = {
        isLogin: false,
        userInfo: {},
        tempFilePaths: '',
        selectList: [],
        selectIndex: 0,
        selectType: null,
        title: '',
        content: '',
        imagelist: [],
        deleteUrl: '',
        actType: '',
        isTopic: false,
        tiId: '',
        fid: null,
        appColor: `#${app.config.COLOR}`,
        topicList: [],
        selectTopicId: '',
        isfocus: false   // textarea 焦点
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
        tiId: ''
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
    // 当没有版块ID时 需要获取板块列表
    if (!data.fid) {
        app.api.forumList().then((res) => {
            const { list } = res
            const selectType = list[0].board_list[0].board_id
            const selectNameArray = [] // [...Array(10).keys()]
            const selectValueArray = []
            list.forEach(categoryList => categoryList.board_list.forEach((board) => {
                selectNameArray.push(`${categoryList.board_category_name}/${board.board_name}`)
                selectValueArray.push(board.board_id)
            }))
            Object.assign(data, { selectNameArray, selectValueArray, selectType, selectTopicId: '' })
            this.setData(data)
            this.getTopicList()
        })
    } else {
        Object.assign(data, { selectType: data.fid })
        this.setData(data)
        this.getTopicList()
    }
}

// 主题列表
Createforum.prototype.getTopicList = function () {
    const { selectType: topicId } = this.data
    app.api.forum(topicId).then(res => {
        this.setData({
            topicList: res.classificationType_list
        })
    })
}

// 选择板块
Createforum.prototype.selectChange = function (e) {
    const { value: selectIndex } = e.detail
    const selectType = this.data.selectValueArray[selectIndex]
    this.setData({ selectIndex, selectType })
    this.getTopicList()
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
    const { title, content, actType, selectType, imagelist, selectTopicId } = this.data
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
            formData: {
                type: 'image',
                module: 'forum',
                fid: selectType
            }
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
