const CONFIG = require('../../../config.js')
const app = getApp()
const accessToken = app.globalData.userInfo.token
const accessSecret = app.globalData.userInfo.secret


// 顺序处理任务
function sequenceTasks(tasks) {
    //  all
    Promise.all(tasks)
    // function recordValue(results, value) {
    //     console.log('complete')
    //     console.log(results, value)
    //     results.push(value)
    //     return results
    // }
    // var pushValue = recordValue.bind(null, [])
    // return tasks.reduce((promise, task) => {
    //     console.log(promise, task)
    //     return promise.then(task).then(pushValue)
    // })
}

// 图片上传
function uploadImage(tmpurl, selectType) {
    console.log(tmpurl)
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: CONFIG.FORUM_URL + '/mobcent/app/web/index.php?r=forum/sendattachmentex',
            // url: 'http://10.10.9.182/dev_gbk/mobcent/app/web/index.php?r=forum/sendattachmentex&accessToken=12345678&accessSecret=12345678',
            filePath: tmpurl,
            name: 'uploadFile[]',
            formData: {
                type: 'image',
                module: 'forum',
                fid: selectType,
                accessToken,
                accessSecret
            },
            success: response => {
                console.log('success', response)
                return resolve(response)
            },
            fail: err => {
                console.log('fail', err)
                reject(err)
            }
        })
    })
}


Page({
    data: {
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
        time: '12:01',
        fid: null,
        appColor: '#ccc',
        isfocus: false   // textarea 焦点
    },
    // 跳转到发表页面
    /*
     *  fid (版块ID  当传入fid时selectList 为空 )
     *  actType(new->发贴，reply->回贴，edit->编辑)
     *  isTopic(true -> 话题， false -> 帖子)
     *  ti_id (当话题是存在)
     */
    onLoad(opts) {
        let fid = opts.fid ? opts.fid : null
        let actType = opts.actType ? opts.actType : 'new'
        let isTopic = opts.isTopic ? opts.isTopic : false
        let tiId = opts.ti_id ? opts.ti_id : ''

        let data = {
            actType,
            isTopic,
            tiId,
            fid
        }

        if (app.globalData.userInfo) {
            // 判断用户是否登录
            Object.assign(data, {
                isLogin: true,
                userInfo: app.globalData.userInfo,
                appColor: app.globalData.info.appColor
            })
        } else {
            console.info('no auth')
        }
        // 当没有版块ID时 需要获取板块列表
        if (!fid) {
            app.api.forumList().then((res) => {
                const { list } = res
                const selectType = list[0].board_list[0].board_id
                const selectNameArray = [] // [...Array(10).keys()]
                const selectValueArray = []
                list.forEach(categoryList => categoryList.board_list.forEach((board) => {
                    selectNameArray.push(`${categoryList.board_category_name}/${board.board_name}`)
                    selectValueArray.push(board.board_id)
                }))
                Object.assign(data, { selectNameArray, selectValueArray, selectType })
                this.setData(data)
            })
        } else {
            Object.assign(data, { selectType: fid })
            this.setData(data)
        }
    },
    selectChange(e) {
        console.log(e)
        const { value: selectIndex } = e.detail
        const selectType = this.data.selectValueArray[selectIndex]
        this.setData({ selectIndex, selectType })
    },
    changeTitle(e) {
        const { value: title } = e.detail
        this.setData({ title })
    },
    // 当textarea获取焦点
    textareaFocus() {
        this.setData({
            isfocus: true
        })
    },
    // 当textarea失去焦点存储数据
    blurAndChangeContent(e) {
        console.log('content', e)
        const { value: content } = e.detail
        this.setData({
            content,
            isfocus: false
        })
    },
    changeContent(e) {
        console.log('content', e)
        const { value: content } = e.detail
        this.setData({ content })
    },
    chooseImg() {
        const selectType = this.data.selectType
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

                // 上传图片
                let tasks = []
                for (let i = 0, l = imagelist.length; i < l; i += 1) {
                    let promise = uploadImage(imagelist[i], selectType)
                    tasks.push(promise)
                }
                console.log(tasks)
                // sequenceTasks(tasks)
                Promise.all(tasks)
                .then(data => {
                    // 上传图片结果
                    console.log('上传图片结果', data)
                })
                .catch(err => {
                    // 上传失败
                    console.log('上传失败', err)
                })

                // console.log('-----------')
                // return wx.uploadFile({
                //     // url: `http://10.10.9.182/dev_gbk/mobcent/app/web/index.php?r=forum/sendattachmentex&accessToken=${app.api._token}&accessSecret=${app.api._secret}`,
                //     url: 'http://10.10.9.182/dev_gbk/mobcent/app/web/index.php?r=forum/sendattachmentex&accessToken=12345678&accessSecret=12345678',
                //     filePath: imagelist[0],
                //     name: 'uploadFile[]',
                //     success: response => {
                //         console.log('int', response)
                //     },
                //     fail: err => {
                //         console.log('int err', err)
                //     },
                //     complete: result => {
                //         console.log('int complete', result)
                //     }
                // })
            },
            fail: err => {
                console.log('err', err)
            },
            complete: result => {
                console.log('complete', result)
            }
        })
    },
    // 预览图片
    previewImage(event) {
        console.log(event, this.data.imagelist.length, this.data.imagelist)
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
        // 预览图片
        // wx.previewImage({
        //     current: currentUrl,
        //     urls: this.data.imagelist,
        //     success: res => {
        //         console.log('success', res)
        //     },
        //     fail: err => {
        //         console.log('err', err)
        //     },
        //     complete: res => {
        //         console.log('complete', res)
        //     }
        // })
    },
    // 删除上传图片
    deleteImage(event) {
        const { currentUrl } = event.currentTarget.dataset
        let { imagelist } = this.data
        imagelist.splice(imagelist.indexOf(currentUrl), 1)
        this.setData({
            imagelist,
            deleteUrl: null
        })
    },
    // 发表评论
    submit() {
        const { title, content, selectType, imagelist, isfocus } = this.data
        let topicContentTopic = []
        let aid = ''
        let aids = []
        // let self = this
        // 数据没有存储
        if (isfocus) {
            return
        }

        // 文本处理
        if (content !== '') {
            topicContentTopic.push({ type: '0', infor: content })
        }
        // 图片处理
        if (imagelist.length > 0) {
            for (let i = 0, l = imagelist.length; i < l; i += 1) {
                topicContentTopic.push({ type: '1', infor: imagelist[i].urlName })
                aids.push(imagelist[i].id)
            }
            // 附件 '3, 4, 5'
            aid = aids.join(',')
        }

        let contentToEncode = encodeURIComponent(JSON.stringify(topicContentTopic))
        console.log(contentToEncode)
        let postData = {
            isShowPostion: 0, // 是否显示地理位置
            content: contentToEncode,
            aid,
            fid: selectType,
            title: encodeURIComponent(title)
        }
        app.api.createTopic(postData).then((res) => {
            console.log(res)
        })
    }
})

