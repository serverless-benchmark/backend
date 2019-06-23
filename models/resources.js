const providers = require('./providers');

module.exports = {
    aws512: {
        provider: providers.AWS,
        location: 'Frankfurt, DE',
        id: 'aws512',
        url: process.env.FUNCTION_AWS512,
        memory: 512
    },
    aws1024: {
        provider: providers.AWS,
        location: 'Frankfurt, DE',
        id: 'aws1024',
        url: process.env.FUNCTION_AWS1024,
        memory: 1024
    },
    aws1536: {
        provider: providers.AWS,
        location: 'Frankfurt, DE',
        id: 'aws1536',
        url: process.env.FUNCTION_AWS1536,
        memory: 1536
    },
    aws2048: {
        provider: providers.AWS,
        location: 'Frankfurt, DE',
        id: 'aws2048',
        url: process.env.FUNCTION_AWS2048,
        memory: 2048
    },
    awscs: {
        provider: providers.AWS,
        location: 'Frankfurt, DE',
        id: 'awscs',
        url: process.env.FUNCTION_AWSCS,
        memory: 512
    },
    azure: {
        provider: providers.AZURE,
        location: 'NL',
        id: 'azure',
        url: process.env.FUNCTION_AZURE,
        memory: 1
    },
    azurecs: {
        provider: providers.AZURE,
        location: 'NL',
        id: 'azurecs',
        url: process.env.FUNCTION_AZURECS,
        memory: 1
    },
    gcp512: {
        provider: providers.GCP,
        location: 'St. Ghislain, BE',
        id: 'gcp512',
        url: process.env.FUNCTION_GCP512,
        memory: 512
    },
    gcp1024: {
        provider: providers.GCP,
        location: 'St. Ghislain, BE',
        id: 'gcp1024',
        url: process.env.FUNCTION_GCP1024,
        memory: 1024
    },
    gcp2048: {
        provider: providers.GCP,
        location: 'St. Ghislain, BE',
        id: 'gcp2048',
        url: process.env.FUNCTION_GCP2048,
        memory: 2048
    },
    gcpcs: {
        provider: providers.GCP,
        location: 'St. Ghislain, BE',
        id: 'gcpcs',
        url: process.env.FUNCTION_GCPCS,
        memory: 512
    },
    ibm256: {
        provider: providers.IBM,
        location: 'Frankfurt, DE',
        id: 'ibm256',
        url: process.env.FUNCTION_IBM256,
        memory: 256
    },
    ibm512: {
        provider: providers.IBM,
        location: 'Frankfurt, DE',
        id: 'ibm512',
        url: process.env.FUNCTION_IBM512,
        memory: 512
    },
    ibm1024: {
        provider: providers.IBM,
        location: 'Frankfurt, DE',
        id: 'ibm1024',
        url: process.env.FUNCTION_IBM1024,
        memory: 1024
    },
    ibmcs: {
        provider: providers.IBM,
        location: 'Frankfurt, DE',
        id: 'ibmcs',
        url: process.env.FUNCTION_IBMCS,
        memory: 512
    },
    cf: {
        provider: providers.CF,
        location: 'Frankfurt, DE',
        id: 'cf',
        url: process.env.FUNCTION_CF,
        memory: 1
    },
    cfcs: {
        provider: providers.CF,
        location: 'Frankfurt, DE',
        id: 'cfcs',
        url: process.env.FUNCTION_CFCS,
        memory: 1
    },
}