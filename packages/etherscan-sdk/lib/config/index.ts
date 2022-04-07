require('dotenv').config()

interface APIDetails {
    baseUrl: string;
    apiKey: string;
}

interface APIs {
    etherscan: APIDetails;
    bsc: APIDetails;
    polygon: APIDetails;
}


// TODO: Add testnet?
const API_CONFIGS: APIs = {
    etherscan: {
        baseUrl: 'https://api.etherscan.io/api',
        apiKey: process.env.ETHERSCAN_API_KEY || '',
    },
    bsc: {
        baseUrl: 'https://api.bscscan.com/api',
        apiKey: process.env.BSCSCAN_API_KEY || '',
    },
    polygon: {
        baseUrl: 'https://api.polygonscan.com/api',
        apiKey: process.env.POLYGONSCAN_API_KEY || '',
    },
}


interface AppConfig {
    apiKey: string;
    baseUrl: string;
}

export function getConfig(api: keyof APIs = 'etherscan'): AppConfig {
    const config = API_CONFIGS[api];
    if(!config) {
        throw new Error(`No configuration found for api ${api}`);
    }
    return config;
}