// const mobcent = require('mobcent')
const cms = require('xiaoyun-cmsapi')
const fetch = require('node-fetch')

const cmsAPI = new cms.API('http://cmsapi.app.xiaoyun.com/GpCmsApi', '100002', '8F97093B9DE32CBA569EAD6456C32A', {
    cache: false,
    fetch
})

const getInfoByAppId = (appId, callback) => {
    const config = {}
    cmsAPI.app(appId).then(data => {
        config.ID = data.appId
        config.NAME = data.appName
        config.KEY = data.forumKey
        config.THEME_TYPE = data.themeType
        config.THEME_COLOR = data.themeColor
        config.ICON = data.icon
        config.START_IMAGE = data.startImg
        config.URL = data.forumUrl
        callback(null, config)
    }, err => {
        callback(err)
    })
}

module.exports = {
    getInfoByAppId
}
