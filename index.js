const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { fromRoot, expand } = require('./src/companyQueries');

const { mode, _ } = yargs(hideBin(process.argv))
  .command('<companyId>')
  .alias('m', 'mode')
  .describe('m', 'Mode')
  .demandOption(['m']).argv;
const companyId = _[0];

switch (mode) {
  case 'fromRoot':
    fromRoot(companyId);
    break;
  case 'expand':
    expand(companyId);
    break;
  default:
    console.log('Not a valid mode');
}
