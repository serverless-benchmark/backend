const db = require('../db');
const _ = require('lodash');
const Queue = require('promise-queue');
const isNumber = x => !isNaN(x);


const main = async () => {
    await db.connectDb();
    const q = new Queue(1, Infinity);
    const ids = await db.getAllConcurrencyIds();
    const promises = ids.reverse().map(async (id, index) => q.add(async () => {
        console.log(index, id);
        const results = await db.findResults({ concurrencyId: id, 'response.cold': false });
        if (!results.length) { console.log('no results'); return; }
        const { response, resourceId, provider, concurrencyId, concurrency, executionId, jobId, timestamp } = results[0]
        const filter = { response, resourceId, provider, concurrencyId, concurrency, executionId, jobId, timestamp };
        return doAggregation(results, filter);
    }));
    Promise.all(promises).then(() => console.log('done'));
}

main();

const doAggregation = async (results, filter) => {
    const filtered = results.filter(x => x.hasOwnProperty('response') && x.response && x.response.hasOwnProperty('time'))
    const overheads = filtered.map(x => x.timings.response - x.response.time).filter(isNumber);
    const calculationTimes = filtered.map(x => x.response.time).filter(isNumber);
    const overheadMetrics = calcMetrics(overheads);
    const calculationTimeMetrics = calcMetrics(calculationTimes);
    const metrics = {
        overhead: overheadMetrics,
        calculationTime: calculationTimeMetrics,
        amountValues: filtered.length,
        filter
    };
    return db.insertAggregations([metrics]);
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
