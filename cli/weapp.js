#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const path = require('path')
const selectShell = require('select-shell')
const { getInfoByAppId } = require('../lib/app')
require('colors')

const genConfig = (appId) => {
    console.log(`正在获取 app: <${appId}> 数据...`)
    getInfoByAppId(appId, (err, config) => {
        if (err) {
            return console.error(err)
        }
        fs.writeFile(path.join(__dirname, '../src/config.js'), `/* eslint-disable */\nmodule.exports=${JSON.stringify(config)}`, (error) => {
            if (err) {
                return console.error(error)
            }
            console.log(`生成 <${config.NAME}> 配置完成`.green)
            process.exit(0)
        })
    })
}

program
    .version(require('../package.json').version)
    .command('init [appId]')
    .description('初始化小程序配置')
    .action((appId) => {
        if (appId) {
            return genConfig(appId)
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

        // const stream = process.stdin

        list.option('测试31G', 210380)
            .option('淋巴瘤之家', 18894)
            .option('新青年麻醉', 85576)
            .option('编织人生', 70909)
            .option('吴川脚爆爆', 98984)
            .option('蒙城汇', 127597)
            .option('丹东妈妈网', 127539)
            .option('穿针引线', 74583)
            .option('湖南妈妈网', 73529)
            .option('智慧登封', 124307)
            .option('小云社群', 229171)
            .list()

        list.on('select', options => {
            genConfig(options[0].value)
        })

        list.on('cancel', () => {
            console.log('取消选择，退出'.red)
            process.exit(0)
        })
        return
    })

program.parse(process.argv)
