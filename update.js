const fs = require('graceful-fs')
const npm = require('npm')

const updatePackageJson = function (folder, newRegistry) {

    const packjson = folder + '/package.json'

    return new Promise((resolve, reject) => {

        let packageJsonObject = require(packjson)
        packageJsonObject.publishConfig = { registry: newRegistry }

        fs.writeFile(packjson, JSON.stringify(packageJsonObject), (err) => {
            if (err) return reject(err);
            resolve(folder)
        })
    })
}

module.exports = function update (oldRegistry, newRegistry, folder) {
    const packjson = folder + '/package.json'
    return updatePackageJson(folder, newRegistry)
}