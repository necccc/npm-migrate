const tar = require('tar'),
    fs = require('graceful-fs'),
    gunzip = require('gunzip-maybe')
    path = require('path')

module.exports = function (tarball) {
    return new Promise((resolve, reject) => {

        let extractor = tar.Extract({path: tarball.replace('.tgz', '')})
            .on('error', reject)
            .on('end', () => resolve(path.resolve(tarball.replace('.tgz', ''), 'package')))

        fs.createReadStream(tarball)
            .on('error', reject)
            .pipe(gunzip())
            .pipe(extractor)
    })
}

