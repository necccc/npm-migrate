const mute = require('mute')
const npm = require('npm')
const curry = require('lodash.curry')

const { unpack, pack } = require('./tgz')
const cleanup = require('./cleanup')
const { getVersionList, getTarballs, publishSeries } = require('./npm_utils')
const updatePackage = require('./update')

module.exports = function (moduleName, oldRegistry, newRegistry, options = { debug: false }) {

    if (!options.debug) {
        var unmute = mute()
    }

    let curried_updatePackage = curry(updatePackage)
    curried_updatePackage = curried_updatePackage(newRegistry)

    let curried_getTarballs = curry(getTarballs)
    curried_getTarballs = curried_getTarballs(moduleName, oldRegistry)

    let curried_publishSeries = curry(publishSeries)
    curried_publishSeries = curried_publishSeries(newRegistry)

    return getVersionList(moduleName, oldRegistry)
        .then(curried_getTarballs)
        .then(unpack)
        .then(curried_updatePackage)
        .then(pack)
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