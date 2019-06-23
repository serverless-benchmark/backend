const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://'+ process.env.MONGODB_USERNAME +':' + process.env.MONGODB_PASSWORD + '@' + process.env.MONGODB_URL;
const dbName = 'benchmark';

let db = null;
let dbClient = null;

const connectDb = async () => {
    if (db) return db;
    while (true) {
        try {
            const client = await MongoClient.connect(url, {
                useNewUrlParser: true,
            });
            dbClient = client;
            dbCon = client.db(dbName);
            db = dbCon;
            console.log('Connection to DB successful');
            return dbCon;
        }
        catch (error) {
            console.log('Could not connect to DB. Retry in 5s');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

const findResults = async (query, projection) => {
    const col = db.collection('results');
    return col.find(query, projection).toArray();
}

const findOneResult = async (query, projection) => {
    const col = db.collection('results');
    return col.findOne(query, projection).toArray();
}


const insertResults = async (results) => {
    const col = db.collection('results');
    return col.insertMany(results);
}

const getAllConcurrencyIds = async () => {
    const col = db.collection('results');
    return col.distinct('concurrencyId');
}

const insertAggregations = async (aggregations) => {
    const col = db.collection('aggregations');
    return col.insertMany(aggregations);
}


function exitHandler() {
    if (dbClient) dbClient.close();
    process.exit()
}

//do something when app is closing
process.on('exit', exitHandler);

//catches ctrl+c event
process.on('SIGINT', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);

module.exports = {
    insertResults,
    findResults,
    findOneResult,
    connectDb,
    insertAggregations,
    getAllConcurrencyIds
}