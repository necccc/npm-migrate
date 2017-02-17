const migrate = require('./npm-migrate')
const argv = require('minimist')(process.argv.slice(2));

const moduleName = argv._[0]

const from = 'http://sjc-npm-cache.ustream.tv:4873'
const to = 'http://sjc-npme.ustream-adm.in:8080'


const options = {
    debug: true
}
 
migrate(moduleName, from, to, options)
    .then((migrated) => console.log(migrated)) // list of migrated packages
    .catch((err) => console.error(err))
