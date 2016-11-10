const ListComponent = require('../../lib/listcomponent')
const util = require('../../utils/util')

const app = getApp()
let IMGWIDTH

function NewsList(key, module) {
    const { windowWidth } = app.globalData.systemInfo
    IMGWIDTH = Math.floor((windowWidth / 2) - 10)
    ListComponent.call(this, key)
    this.module = module
    // 添加分页
    this.module = module
    this.data = {
        page: 1,
        image2Size: IMGWIDTH,
        indicatorDots: false,
        autoplay: true,
        interval: 3000,
        duration: 800,
        resources: {},
        isLoading: false,
        appIcon: app.globalData.info.appIcon,
        over: false,
        isImage: module.style === 'image',
        leftLayout: {
            data: [],
            height: 0
        },
        rightLayout: {
            data: [],
            height: 0
        }
    }
}

NewsList.prototype = Object.create(ListComponent.prototype)
NewsList.prototype.name = 'newslist'
NewsList.prototype.constructor = NewsList

NewsList.prototype.clickItem = function (e) {
    app.showPost(e.currentTarget.id)
}

// 请求数据
NewsList.prototype.fetchData = function (param, number) {
    const module = this.module
    let list = param.list || this.data.resources.list || []
    if (this.data.over) return Promise.reject()
    this.setData({
        isLoading: true
    })
    return app.api.news(module.extParams.newsModuleId, {
        page: param.page,
        sortby: param.orderby || 'all'
    }).then((data) => {
        data.list = data.list.map((v) => {
            v.subject = v.summary
            v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
            v.last_reply_date = util.dateFormat(v.last_reply_date, 'yyyy-MM-dd')
            let faceResult = util.infoToFace(v.subject)
            v.hasFace = faceResult.hasFace
            v.subject = util.formateText(v.subject)
            return v
        })
        data.list = list.concat(data.list)
        // 获取数据判断是否为图片1
        if (module.style === 'image') {
            this.setData({
                module,
                over: param.page >= parseInt((data.total_num / number) + 1, 10)
            })
            return Promise.resolve(data)
        }
        this.setData({
            module,
            resources: data,
            isLoading: true,
            over: param.page >= parseInt((data.total_num / number) + 1, 10)
        })
        return Promise.reject({ errCode: 10001, errInfo: '不执行计算高度' })
    }, (err) => {
        return Promise.reject(err)
    }).then(arrList => {
        arrList.list = arrList.list.map(item => {
            return new Promise((resolve, reject) => {
                return wx.getImageInfo({
                    src: item.pic_path.replace('xgsize_', 'mobcentSmallPreview_'),
                    success: ({ width, height }) => {
                        item.pic_path = item.pic_path.replace('xgsize_', 'mobcentSmallPreview_')
                        item.width = width
                        item.height = height
                        item.scale_width = IMGWIDTH
                        item.scale_height = Math.floor((height / width) * IMGWIDTH)
                        return resolve(item)
                    },
                    fail: (err) => {
                        return reject(err)
                    }
                })
            })
        })
        return Promise.all(arrList.list)
    }).then(result => {
        let { leftLayout, rightLayout } = this.data
        for (let i = 0; i < result.length; i += 1) {
            if (leftLayout.height <= rightLayout.height) {
                leftLayout.data.push(result[i])
                leftLayout.height += result[i].scale_height
            } else {
                rightLayout.data.push(result[i])
                rightLayout.height += result[i].scale_height
            }
        }
        this.setData({
            leftLayout,
            rightLayout,
            isLoading: true
        })
    })
    .catch((err) => {
        console.log(err)
    })
}

module.exports = NewsList
