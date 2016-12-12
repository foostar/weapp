const mobcent = require('mobcent')
const request = require('request')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const fetch = require('node-fetch')
const appJSONTemplate = require('../templates/app.json')
const cms = require('xiaoyun-cmsapi')

let cmsApi = new cms.API('', '100002', '8F97093B9DE32CBA569EAD6456C32A', {
    cache: false,
    fetch
})

const getCmsAPI = (config) => {
    cmsApi._path = config.cmsUrl
    return cmsApi
}

const getInfoByAppId = (appId, host, env) => {
    const config = {}
    return getCmsAPI(env).app(appId).then(data => {
        config.ID = data.appId
        config.NAME = data.appName
        config.KEY = data.forumKey
        config.THEME_TYPE = data.themeType
        config.THEME_COLOR = data.themeColor || '#FF0000'
        config.COLOR = config.THEME_COLOR.slice(1).toLowerCase()
        config.ICON = data.icon
        config.START_IMAGE = data.startImg
        config.URL = data.forumUrl
        config.HOST = host || config.HOST
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

const loadFile = (url, filePath) => {
    return new Promise((resolve, reject) => {
        const rs = request(url)
        const ws = fs.createWriteStream(filePath)
        rs.pipe(ws)
        rs.on('end', (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

const loadIcons = (list, color, options) => {
    return Promise.all([].concat.apply([], list.map(x => {
        return [
            `http://icons.apps.xiaoyun.com/main/${x.icon}_n/555?tabbar=true`,
            `http://icons.apps.xiaoyun.com/main/${x.icon}_h/${color}?tabbar=true`,
        ]
    })).map((x, i) => {
        return loadFile(x, path.join(options.path, `images/tabicons/icon_${parseInt(i / 2, 10)}_${i % 2 === 0 ? 'n' : 'h'}.png`))
    }))
}

const generateTabPages = (list, options) => {
    return new Promise((resolve, reject) => {
        const jsFilePath = path.join(__dirname, '../templates/tab.js')
        const wxssFilePath = path.join(__dirname, '../templates/tab.wxss')
        const wxmlFilePath = path.join(__dirname, '../templates/tab.wxml')
        fs.readFile(jsFilePath, 'utf8', (e1, jsStr) => {
            if (e1) return reject(e1)
            fs.readFile(wxmlFilePath, 'utf8', (e2, wxmlStr) => {
                if (e2) return reject(e2)
                fs.readFile(wxssFilePath, 'utf8', (e3, wxssStr) => {
                    if (e3) return reject(e3)
                    resolve({ jsStr, wxmlStr, wxssStr })
                })
            })
        })
    }).then((result) => {
        return Promise.all(list.map(x => x.moduleId).map((id, i) => {
            return Promise.all([
                writeFile(path.join(options.path, `pages/tabs/tab${i}.js`), ejs.render(result.jsStr, { moduleId: id })),
                writeFile(path.join(options.path, `pages/tabs/tab${i}.wxss`), ejs.render(result.wxssStr, { moduleId: id })),
                writeFile(path.join(options.path, `pages/tabs/tab${i}.wxml`), ejs.render(result.wxmlStr, { moduleId: id }))
            ])
        }))
    })
}

const generateAPPJSON = (config, options) => {
    const appJSON = JSON.parse(JSON.stringify(appJSONTemplate))
    const mobAPI = new mobcent.API(config.URL, {
        fetch
    })
    return mobAPI.ui()
        .then(data => {
            const list = data.body.navigation.navItemList
            return Promise
                .resolve()
                .then(() => {
                    if (options.useTabbar) {
                        list.forEach((x, i) => {
                            appJSON.pages[i ? 'push' : 'unshift'](`pages/tabs/tab${i}`)
                        })
                        return generateTabPages(list, options)
                            .then(() => loadIcons(list, config.COLOR, options))
                            .then(() => {
                                return list.map((x, i) => {
                                    return {
                                        text: x.title,
                                        pagePath: `pages/tabs/tab${i}`,
                                        iconPath: `images/tabicons/icon_${i}_n.png`,
                                        selectedIconPath: `images/tabicons/icon_${i}_h.png`,
                                    }
                                })
                            })
                    }
                    return Promise.resolve([])
                })
        })
        .then(tabbar => {
            return new Promise(resolve => {
                appJSON.window = {
                    backgroundTextStyle: 'light',
                    navigationBarBackgroundColor: config.THEME_COLOR,
                    navigationBarTitleText: config.NAME,
                    navigationBarTextStyle: 'white',
                    backgroundColor: '#F0F0F0',
                    enablePullDownRefresh: false
                }
                appJSON.tabBar = {
                    color: '#555',
                    selectedColor: config.THEME_COLOR,
                    backgroundColor: '#FFF',
                    borderStyle: 'black',
                    position: 'bottom',
                    list: tabbar
                }
                resolve(JSON.stringify(appJSON))
            })
        })
        .then(data => {
            return writeFile(path.join(options.path, 'app.json'), data)
        })
}

const generateCSS = (config, options) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '../templates/theme.wxss')
        ejs.renderFile(filePath, config, (err, str) => {
            if (err) return reject(err)
            return resolve(str)
        })
    }).then(data => {
        return writeFile(path.join(options.path, 'theme.wxss'), data)
    })
}

const generateConfigByAppId = (appId, options = {}, env = {}) => {
    options.useTabbar = true
    const rootPath = options.path || path.join(__dirname, '../src')
    return getInfoByAppId(appId, options.host, env)
        .then(config => {
            config.USE_TABBAR = !!options.useTabbar
            return Promise.all([
                generateAPPJSON(config, {
                    useTabbar: options.useTabbar,
                    path: rootPath
                }),
                generateCSS(config, {
                    path: rootPath
                }),
                writeFile(path.join(rootPath, 'config.js'), `/* eslint-disable */\nmodule.exports=${JSON.stringify(config)}`)
            ])
        })
}

module.exports = {
    getInfoByAppId,
    generateConfigByAppId,
    writeFile
}
