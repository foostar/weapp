const CONFIG = require('../../config')

const app = getApp()

Page({
    data: {
        image: CONFIG.START_IMAGE
    },
    onLoad: () => {
        Promise.all([
            new Promise((resolve) => {
                setTimeout(resolve, 800)
            }),
            app.ready()
        ]).then(() => {
            console.log('ready')
            wx.redirectTo({
                url: '../index/index'
            })
        })
    }
})
