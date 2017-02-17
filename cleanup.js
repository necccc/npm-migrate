const rimraf = require('rimraf')
const { packageFromPaths } = require('./npm_utils')

module.exports = function cleanup (results) {
    return new Promise((resolve, reject) => {
        rimraf(process.cwd() + '/npm-migrate_tmp', (err) => {
            if (err) reject(err)

            resolve(packageFromPaths(results))
        })
    })
}