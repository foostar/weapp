const express = require('express')
const path = require('path')
const fs = require('fs-extra')
const cms = require('xiaoyun-cmsapi')
const fetch = require('node-fetch')
const os = require('os')
const archiver = require('archiver')

const { generateConfigByAppId } = require('./app')

const app = express()

let cmsUrl = 'http://test-cmsapi.app.xiaoyun.com/GpCmsApi'
if (process.env.NODE_ENV == 'production') {
    cmsUrl = 'http://cmsapi.app.xiaoyun.com/GpCmsApi'
}
let cmsAPI = new cms.API(cmsUrl, '100002', '8F97093B9DE32CBA569EAD6456C32A', {
    cache: false,
    fetch
})

const isAuthed = (appId) => {
    return cmsAPI
        .auth(appId)
        .then(data => {
            return data && data.length && data.indexOf('WPP') !== -1
        }, (err) => {
            console.log(err)
        })
}

const isAuthedMiddleware = fn => (req, res, next) => {
    const appId = fn(req)
    isAuthed(appId)
        .then((authed) => {
            if (authed) return next()
            res.status(404).end()
        }, () => {
            res.status(404).end()
        })
}

app.get('/app/:appId/download.zip', isAuthedMiddleware(req => req.params.appId), (req, res) => {
    const distPath = path.join(os.tmpDir(), req.params.appId)
    fs.copy(path.join(__dirname, '../weapp'), distPath, (err) => {
        if (err) return res.status(400).send('复制失败')
        generateConfigByAppId(req.params.appId, {
            path: distPath
        }).then(() => {
            const zipArchive = archiver('zip')
            zipArchive.pipe(res)
            zipArchive.bulk([
                { cwd: distPath, src: [ '**/*' ], expand: true }
            ])
            zipArchive.finalize((error) => {
                if (error) {
                    res.status(400).send('打包出错，请重试')
                }
            })
        }, () => {
            res.status(400).send('打包出错，请重试')
        })
    })
})

app.listen(3000)
