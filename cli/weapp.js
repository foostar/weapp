#!/usr/bin/env node
const program = require('commander')
const selectShell = require('select-shell')
const { generateConfigByAppId } = require('../lib/app')
require('colors')

const genConfig = (appId) => {
    console.log(`正在获取 app: <${appId}> 数据...`)
    generateConfigByAppId(appId).then(() => {
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

        list
            .option('蒙城汇', 127597)
            .option('好友驿站', 231345)
            .option('爱钓鱼', 177432)
            .option('龟友天下', 55911)
            .option('郑州在线', 176489)
            .option('淋巴瘤之家', 18894)
            .option('乐清上班族网', 113825)
            .option('重钓网', 47269)
            .option('龙岩KK网', 73245)
            .option('四平英城网', 118151)
            .option('----- 以上为预售购买用户，需要特殊照顾 -----', null)
            .option('测试31G', 210380)
            .option('新青年麻醉', 85576)
            .option('编织人生', 70909)
            .option('吴川脚爆爆', 98984)
            .option('丹东妈妈网', 127539)
            .option('穿针引线', 73551)
            .option('湖南妈妈网', 73529)
            .option('智慧登封', 124307)
            .option('小云社群', 229171)
            .list()

        list.on('select', options => {
            if (options[0].value) {
                genConfig(options[0].value)
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
