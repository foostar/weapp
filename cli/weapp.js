#!/usr/bin/env node
const program = require('commander')
const selectShell = require('select-shell')
const { generateConfigByAppId } = require('../lib/app')
require('colors')

const genConfig = (appId, config) => {
    console.log(`正在获取 app: <${appId}> 数据...`)
    console.log(`cms地址： ${config.cmsUrl}`)
    console.log(`HOST地址： ${config.HOST}`)
    generateConfigByAppId(appId, {}, config).then(() => {
        console.log(`生成 <${appId}> 配置完成`.green)
        process.exit(0)
    }, (err) => {
        console.log('生成失败！'.red)
        console.error(err)
        process.exit(0)
    })
}


program
    .version(require('../package.json').version)
    .option('-e, --env', 'dev')
    .option('-m, --manage', 'wxadmin')
    .parse(process.argv)
    .command('init [appId]')
    .description('初始化小程序配置')
    .action((appId) => {
        /* eslint-disable */
        let env = require('../config/config.pro.js')
        if (program.env) {
            env = require('../config/config.dev.js')
        }
        /* eslint-enable */
        const { config, appList } = env
        if (program.manage) {
            config.HOST = 'https://weapp-admin.apps.xiaoyun.com'
        }
        if (appId) {
            genConfig(appId, config)
        }
        const list = selectShell({
            pointer: ' ▸ ',
            pointerColor: 'yellow',
            checked: ' ✓ ',
            unchecked: '   ',
            checkedColor: 'blue',
            msgCancel: 'No selected options!',
            msgCancelColor: 'orange',
            multiSelect: false,
            inverse: false,
            prepend: false
        })
        appList.forEach((v) => {
            list.option(v.name, v.id)
        })
        list.list()
        list.on('select', options => {
            if (options[0].value) {
                genConfig(options[0].value, config)
            } else {
                process.exit(0)
            }
        })

        list.on('cancel', () => {
            console.log('取消选择，退出'.red)
            process.exit(0)
        })
        return
    })

program.parse(process.argv)
