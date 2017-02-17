const npm = require('npm')
const mv = require('mv')
const curry = require('lodash.curry')
const async = require('async')

const publishAsync = function (registry, path, callback) {

    npm.load({
        registry: registry
    }, () => {

        let tgz = path + '.tgz'

        npm.commands.publish([tgz], (err, data) => {

            if (err) return callback(err);

            callback(null, path)
        })
    })
}

module.exports.getVersionList = function (moduleName, registry) {

    return new Promise((resolve, reject) => {

        npm.load({
            registry: registry
        }, () => {

            npm.commands.info([moduleName], function (err, data) {

                if (err) return reject(err);

                let latest = Object.keys(data)[0];
                resolve(data[latest].versions)
            })
        })
    })
}

module.exports.getTarball = function (moduleName, registry, version) {

    const versionedModule = [moduleName, version].join('@')

    return new Promise((resolve, reject) => {

        npm.load({
            registry: registry
        }, () => {

            npm.commands.pack([versionedModule], (err, data) => {

                if (err) return reject(err);

                let tarball = versionedModule.replace('@','-') + '.tgz'
                let tarballFrom = process.cwd() + '/' + tarball
                let tarballTo = process.cwd() + '/npm-migrate_tmp/' + tarball

                mv(tarballFrom, tarballTo, { mkdirp: true }, (err) => {

                    if (err) return reject(err);
                    resolve(tarballTo)
                })
            })
        })
    })
}

module.exports.publishSeries = function (registry, packageFolders) {

    let curried_publishAsync = curry(publishAsync),
        series = packageFolders.map((folder) => curried_publishAsync(registry, folder))

    return new Promise((resolve, reject) => {
        async.series(
            series,
            (err, results) => {
                if (err) return reject(err);
                resolve(results)
            })
    })
}

const packageFromPath = function (path) {
    return path
            .replace(process.cwd() + '/npm-migrate_tmp/', '')
            .replace('/package', '')
}

module.exports.packageFromPaths = function (paths) {
    return paths.map(packageFromPath)
}

module.exports.packageFromPath = packageFromPath;