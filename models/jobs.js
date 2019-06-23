const R = require('./resources');
const C = require('./crons');

module.exports = [
    {
        id: 'job-overhead-01',
        interval: [C.EVERY_HOUR],
        resources: [R.aws1024, R.gcp1024, R.ibm1024, R.ibm256, R.azure, R.cf],
        count: 10,
        concurrency: [1, 25, 50],
        options: { type: 'hash', rounds: 8 }
    },
    {
        id: 'job-coldstart-01',
        interval: [C.EVERY_3HOURS],
        resources: [R.awscs, R.gcpcs, R.ibmcs, R.azurecs, R.cfcs],
        count: 1,
        concurrency: [10],
        options: { type: 'hash', rounds: 1 }
    },
]
