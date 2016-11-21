const CONFIG = require('../../config.js')

const app = getApp()

Page({
    data: {
        image: CONFIG.START_IMAGE[0]
    },
    onLoad: () => {
        Promise.all([
            new Promise((resolve) => {
                setTimeout(resolve, 1000)
            }),
            app.ready()
        ]).then(() => {
            if (CONFIG.USE_TABBAR) {
                return wx.redirectTo({
                    url: `/pages/blank/blank?moduleId=${app.globalData.tabs[0].moduleId}`
                })
            }
            wx.redirectTo({
                url: '/pages/index/index'
            })
        }, (err) => {
            console.log(err)
        })
    }
})
