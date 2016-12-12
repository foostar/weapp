const cms = require('xiaoyun-cmsapi')
const fetch = require('node-fetch')
const ENV = require('./env.js')

const cmsAPI = new cms.API(ENV.cmsUrl, '100002', '8F97093B9DE32CBA569EAD6456C32A', {
    cache: false,
    fetch
})

module.exports = cmsAPI
