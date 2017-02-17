const compressing = require('compressing'),
    path = require('path')

module.exports.unpack = function (tarball) {

    let to = tarball.replace('.tgz', '')

    return compressing.tgz.uncompress(tarball, to)
        .then(() => path.resolve(to, 'package'))
}

module.exports.pack = function (folder) {
    return compressing.tgz.compressDir(folder, path.resolve(folder, '..') + '/package.tgz')
        .then(() => folder)
}