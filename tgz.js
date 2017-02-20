const compressing = require('compressing')
const path = require('path')
const async = require('async')
const curry = require('lodash.curry')

const unpackTarball = function (tarball, callback) {
    let to = tarball.replace('.tgz', '')

    return compressing.tgz.uncompress(tarball, to)
        .then(() => callback(null, path.resolve(to, 'package')))
        .catch((err) => callback(err))
}

const packTarball = function (folder, callback) {

    return compressing.tgz.compressDir(folder, path.resolve(folder, '..') + '/package.tgz')
        .then(() => callback(null, folder))
        .catch((err) => callback(err))
}

module.exports.unpack = function (tarballs) {

    let curried_unpackTarball = curry(unpackTarball)
    let series = tarballs.map((tarball) => curried_unpackTarball(tarball))

    return new Promise((resolve, reject) => {
        async.series(
            series,
            (err, results) => {
                if (err) return reject(err);
                resolve(results)
            })
    })
}

module.exports.pack = function (folders) {

    let curried_packTarball = curry(packTarball)
    let series = folders.map((folder) => curried_packTarball(folder))

    return new Promise((resolve, reject) => {
        async.series(
            series,
            (err, results) => {
                if (err) return reject(err);
                resolve(results)
            })
    })
}