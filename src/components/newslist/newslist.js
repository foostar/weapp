const Component = require('../../lib/component')
const util = require('../../utils/util')

const app = getApp()
let IMGWIDTH

function NewsList(key, module) {
    const { windowWidth } = app.globalData.systemInfo
    IMGWIDTH = Math.floor((windowWidth / 2) - 10)
    Component.call(this, key)
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
        endPage: 0,
        over: false,
        isImage: module.style === 'image'
    }
}

NewsList.prototype = Object.create(Component.prototype)
NewsList.prototype.name = 'newslist'
NewsList.prototype.constructor = NewsList
NewsList.prototype.clickItem = function (e) {
    app.showPost(e.currentTarget.id)
}

NewsList.prototype.onLoad = function () {
    this.fetchData(this.module, this.data.page)
    let that = this
    // 加载下一页的数据
    app.event.on('nextPage', () => {
        let { page, endPage } = that.data
        if (page < endPage) {
            that.setData({
                isLoading: true
            })
            that.fetchData(that.module, page + 1)
        } else {
            that.setData({
                isLoading: false,
                over: true
            })
        }
    })
}
// 请求数据
NewsList.prototype.fetchData = function (module, page) {
    let list = this.data.resources.list ? this.data.resources.list : []
    app.api.news(module.extParams.newsModuleId, {
        page,
        sortby: module.extParams.orderby || 'all'
    }).then((data) => {
        data.list = data.list.map((v) => {
            v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
            v.last_reply_date = util.dateFormat(v.last_reply_date, 'yyyy-MM-dd')
            v.subject = util.formateText(v.subject)
            return v
        })
        data.list = list.concat(data.list)
        // 获取数据判断是否为图片1
        if (module.style === 'image') {
            this.setData({
                endPage: parseInt((data.total_num / 20) + 1, 10)
            })
            return Promise.resolve(data)
        }
        this.setData({
            module,
            page,
            resources: data,
            isLoading: true,
            endPage: parseInt((data.total_num / 20) + 1, 10)
        })
        return Promise.reject({ errCode: 10001, errInfo: '不执行计算高度' })
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
        let leftLayout = {
            data: [],
            height: 0
        }
        let rightLayout = {
            data: [],
            height: 0
        }
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
            module,
            page,
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
