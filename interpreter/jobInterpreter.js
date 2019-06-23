const cron = require('node-cron');
const requestConcurrent = require('./requestConcurrent');
const Queue = require('promise-queue');
const uuid = require('uuid/v4');
const db = require('../db');
const _ = require('lodash');

const jobScheduler = (job) => {
    job.interval.forEach(interval => {
        console.log(`scheduled job ${job.id} on interval ${interval}`);
        cron.schedule(interval, async () => {
            try {
                const result = await executeJob(job)
                db.insertResults(result);
            }
            catch (error) {
                console.log(error)
            }
        });
    })
}

const executeJob = async (job) => {
    const executionId = uuid();
    const q = new Queue(1, Infinity);
    const promises = job.concurrency.map(c => q.add(async () => {
        console.log("Request for All resources with concurrency " + c)
        const result = await requestForAllResources(job.resources, c, job.count, job.options);
        console.log('done');
        return result;
    }));
    const results = await Promise.all(promises);
    const flattened = _.flattenDeep(results);
    return flattened.map(x => ({ ...x, executionId, jobId: job.id, timestamp: +Date.now() }));
}

const requestForAllResources = async (resources, concurrency, count, options = {}) => {
    const q = new Queue(1, Infinity);
    const promises = resources.map(resource => q.add(async () => {
        console.log("Request concurrent for resource " + resource.id);
        return requestConcurrent(resource, count, concurrency, options);
    }));
    return Promise.all(promises);
}

module.exports = {
    jobScheduler
}