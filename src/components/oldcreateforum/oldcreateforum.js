const Component = require('../../lib/component.js')

const app = getApp()

function OldCreateforum(key, module) {
    this.module = module
    this.pageData = module.data ? module.data : ''
    Component.call(this, key)
    this.data = {
        isLogin: false,
        isForumlist: true,
        userInfo: {},
        tempFilePaths: '',
        selectList: [],
        fastforumList: [],
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
        iconSrc: app.globalData.iconSrc,
        topicList: [],
        selectTopicId: '',
        isfocus: false   // textarea 焦点
    }
}
OldCreateforum.prototype = Object.create(Component.prototype)
OldCreateforum.prototype.name = 'oldcreateforum'
OldCreateforum.prototype.constructor = OldCreateforum
OldCreateforum.prototype.onLoad = function () {
    console.log(1111, this.pageData)
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

    let promise = new Promise((resolve) => {
        if (data.fid) {
            this.setData({
                selectType: data.fid,
                isForumlist: false
            })
            return resolve(data.fid)
        }
        if (this.module.componentList && this.module.componentList.length > 0) {
            const list = this.module.componentList[0].extParams.fastpostForumIds
            this.setData({
                fastforumList: list
            })
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
        return app.api.search('', 'topic', { searchid: fid })
    }).then((res) => {
        // 话题列表
        this.setData({
            titopicList: res.list
        })
        this.changePageTitle()
        this.getTopicList()
    })
    .catch(e => {
        console.log('init createforum', e)
        // app.event.trigger('errormessage', e.errcode)
    })
}
// 主题列表
OldCreateforum.prototype.getTopicList = function () {
    const { selectType: topicId } = this.data
    app.api.getSetting().then(res => {
        const { postInfo } = res.body
        const obj = postInfo.filter(item => {
            return item.fid == topicId
        })
        if (obj.length > 0 && obj[0] && obj[0].topic.classificationType_list.length > 0) {
            this.setData({
                topicList: obj[0].topic.classificationType_list,
            })
        }
        return app.api.forum(topicId)
    })
}


// 选择板块
OldCreateforum.prototype.selectedChange = function (e) {
    const { fid, boardname } = e.currentTarget.dataset
    app.createForum({ fid, boardname })
}

// 改变页面的头部信息
OldCreateforum.prototype.changePageTitle = function () {
    const { isForumlist } = this.data
    if (isForumlist) {
        wx.setNavigationBarTitle({
            title: '选择发布板块'
        })
    } else {
        wx.setNavigationBarTitle({
            title: '发帖'
        })
    }
}

// 改变主题id
OldCreateforum.prototype.selectTopicId = function (e) {
    const { topicId: selectTopicId } = e.currentTarget.dataset
    this.setData({
        selectTopicId
    })
}
// 当textarea失去焦点存储数据
OldCreateforum.prototype.blurAndChangeContent = function (e) {
    const { value: content } = e.detail
    this.setData({
        content,
        isfocus: false
    })
}
// 保存头部
OldCreateforum.prototype.changeTitle = function (e) {
    const { value: title } = e.detail
    this.setData({ title })
}
// 选择图片
OldCreateforum.prototype.chooseImg = function () {
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
OldCreateforum.prototype.previewImage = function (event) {
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
OldCreateforum.prototype.deleteImage = function (event) {
    const { currentUrl } = event.currentTarget.dataset
    let { imagelist } = this.data
    imagelist.splice(imagelist.indexOf(currentUrl), 1)
    this.setData({
        imagelist,
        deleteUrl: null
    })
}
    // 发表评论
OldCreateforum.prototype.submit = function () {
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
        console.log('发表失败', err)
        if (err.errcode == 50000000) {
            app.event.trigger('errormessage', err.message)
        } else if (err.data.err.errcode == 50000000) {
            return app.event.trigger('errormessage', '用户没有登陆')
        } else if (err.data.err.errcode) {
            app.event.trigger('errormessage', err.data.err.errcode)
        } else if (err.errMsg) {
            app.event.trigger('errormessage', err.errMsg)
        } else {
            app.event.trigger('errormessage', err)
        }
    })
}
module.exports = OldCreateforum
