const rimraf = require('rimraf')

const getReleasedNames = function (paths) {
    return paths.map((path) => {
        return path
                .replace(process.cwd() + '/npm-migrate_tmp/', '')
                .replace('/package', '')
    })
}

module.exports = function cleanup (results) {
    return new Promise((resolve, reject) => {
        rimraf(process.cwd() + '/npm-migrate_tmp', (err) => {
            if (err) reject(err)

            resolve(getReleasedNames(results))
        })
    })
}