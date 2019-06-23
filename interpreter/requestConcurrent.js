const request = require('request');
const Queue = require('promise-queue');
const _ = require('lodash');
const uuid = require('uuid/v4');


const singleRequest = (resource, options = {}) => new Promise((resolve, reject) => {
    request.post({ url: resource.url, time: true, json: options }, (err, res) => {
        if (err) reject(err);
        resolve(res);
    })

})

module.exports = async (resource, n, c, options = {}) => {
    const q = new Queue(c, Infinity);
    let counter = 0;
    const concurrencyId = uuid();
    const promises = _.range(n * c).map(() => {
        return q.add(async () => {
            const start = +Date.now()
            const isInitial = (counter < c);
            counter++;
            const result = await singleRequest(resource, options);
            const queueRoundtrip = +Date.now() - start;
            return {
                response: result.body,
                timings: { ...result.timings, legacy: queueRoundtrip, start: result.timingStart },
                isInitial,
                resourceId: resource.id,
                provider: resource.provider,
                concurrencyId,
                concurrency: c,
            }
        })
    })
    return Promise.all(promises);
}