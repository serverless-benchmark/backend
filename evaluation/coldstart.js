const db = require('../db');
const _ = require('lodash');

const isNumber = x => !isNaN(x);

const evaluateColdstart = async (job, from = 0, to = Infinity) => {
    const metrics = [];
    const promises = job.resources.map(async resource => {
        const promises = job.concurrency.map(async concurrency => {
            const results = await db.findResults({
                resourceId: resource.id, isInitial: true,
                concurrency, jobId: job.id, timestamp: {
                    '$gte': from, '$lte': to,
                }
            });
            if (!results.length) return;
            const filtered = results.filter(x => x.hasOwnProperty('response') && x.response && x.response.hasOwnProperty('time'))
            const actualColdstart = filtered.filter(x => x.response.cold === true);
            const noColdstart = filtered.filter(x => x.response.cold === false);
            const overheads = filtered.map(x => x.timings.response - x.response.time).filter(isNumber);
            const overheadMetrics = calcMetrics(overheads);
            metrics.push({
                count: {
                    coldstart: actualColdstart.length,
                    warm: noColdstart.length,
                },
                overheadMetrics,
                amountValues: filtered.length,
                job: { id: job.id, concurrency, count: job.count, options: job.options },
                resource: { ...resource, url: undefined },
            })
            return true;
        })
        return Promise.all(promises);
    })
    await Promise.all(promises);
    return metrics;
}

const percentile = values => {
    const sorted = values.sort((a, b) => a - b);
    const l = sorted.length;
    const r = 100 / l;
    return k => {
        if (k < 0 || k > 100) throw "k out of bounds";
        const idx = Math.max(Math.round(k / r) - 1, 0);
        return sorted[idx];
    }
}

const calcMetrics = (values) => {
    const p = percentile(values);
    const l = values.length;
    return {
        percentiles: _.range(0, 101).map(p),
        average: values.reduce((a, x) => a + x) / l,
    }
}

module.exports = { evaluateColdstart };