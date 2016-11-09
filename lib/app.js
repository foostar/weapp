// const mobcent = require('mobcent')
const cms = require('xiaoyun-cmsapi')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

const cmsAPI = new cms.API('http://cmsapi.app.xiaoyun.com/GpCmsApi', '100002', '8F97093B9DE32CBA569EAD6456C32A', {
    cache: false,
    fetch
})

const getInfoByAppId = (appId) => {
    const config = {}
    return cmsAPI.app(appId).then(data => {
        config.ID = data.appId
        config.NAME = data.appName
        config.KEY = data.forumKey
        config.THEME_TYPE = data.themeType
        config.THEME_COLOR = data.themeColor
        config.ICON = data.icon
        config.START_IMAGE = data.startImg
        config.URL = data.forumUrl
        return config
    })
}

const writeFile = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, err => {
            if (err) return reject(err)
            resolve()
        })
    })
}

const generateAPPJSON = (config) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../templates/app.json'), 'utf8', (err, data) => {
            if (err) return reject(err)
            resolve(ejs.render(data, config))
        })
    }).then(data => {
        return writeFile(path.join(__dirname, '../src/app.json'), data)
    })
}

const generateCSS = (config) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../templates/theme.wxss'), 'utf8', (err, data) => {
            if (err) return reject(err)
            resolve(ejs.render(data, config))
        })
    }).then(data => {
        return writeFile(path.join(__dirname, '../src/theme.wxss'), data)
    })
}

const generateConfigByAppId = (appId) => {
    return getInfoByAppId(appId)
        .then(config => {
            return Promise.all([
                generateAPPJSON(config),
                generateCSS(config),
                writeFile(path.join(__dirname, '../src/config.js'), `/* eslint-disable */\nmodule.exports=${JSON.stringify(config)}`)
            ])
        })
}

module.exports = {
    getInfoByAppId,
    generateConfigByAppId
}
