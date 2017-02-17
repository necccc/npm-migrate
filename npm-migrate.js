const mute = require('mute')
const npm = require('npm')
const curry = require('lodash.curry')

const { unpack, pack } = require('./tgz')
const cleanup = require('./cleanup')
const { getVersionList, getTarball, publishSeries } = require('./npm_utils')
const updatePackage = require('./update')

module.exports = function (moduleName, oldRegistry, newRegistry, options = { debug: false }) {

    if (!options.debug) {
        var unmute = mute()
    }

    let curried_updatePackage = curry(updatePackage)
    curried_updatePackage = curried_updatePackage(oldRegistry, newRegistry)

    let curried_getTarball = curry(getTarball)
    curried_getTarball = curried_getTarball(moduleName, oldRegistry)

    let curried_publishSeries = curry(publishSeries)
    curried_publishSeries = curried_publishSeries(newRegistry)

    return getVersionList(moduleName, oldRegistry)
        .then(versions => Promise.all(versions.map(curried_getTarball)))
        .then(tarballs => Promise.all(tarballs.map(unpack)))
        .then(packageFolders => Promise.all(packageFolders.map(curried_updatePackage)))
        .then(packageFolders => Promise.all(packageFolders.map(pack)))
        .then(curried_publishSeries)
        .then(cleanup)
        .then((results) => {
            if (unmute) unmute();

            return results
        })
        .catch((err) => {
            console.error(err)
        })
}