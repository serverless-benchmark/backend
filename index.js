const jobs = require('./models/jobs');
const { jobScheduler } = require('./interpreter/jobInterpreter');
const { evaluateJob } = require('./evaluation/evaluateJob')
const { evaluateColdstart } = require('./evaluation/coldstart')
const { connectDb } = require('./db');
const cache = require('micro-cacheable')
const { router, get } = require('microrouter')
require('dnscache')({
    "enable": true,
    "ttl": 300,
    "cachesize": 1000
})

const main = async () => {
    await connectDb();
    jobs.forEach(jobScheduler)
}

main();

const threeDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 3;

const server = async (req, res) => {
    const obj = {
        'job-overhead-01': await evaluateJob(jobs.find(x => x.id === 'job-overhead-01'), threeDaysAgo),
        'job-coldstart-01': await evaluateColdstart(jobs.find(x => x.id === 'job-coldstart-01'))
    }
    return obj;
}

const cached = cache(60 * 60 * 1000, server);

const health = async (req, res) => {
    return 'alive';
}

module.exports = router(get('/health', health), get('/', cached));