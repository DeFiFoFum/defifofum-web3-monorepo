import 'dotenv/config'


export const API_TYPE_ARRAY = <const>['etherscan', 'bsc', 'polygon'];
export type API_TYPE = typeof API_TYPE_ARRAY[number];

interface APIDetails {
    baseUrl: string;
    apiKey: string;
}

type APIConfig = Record<API_TYPE, APIDetails>;


const API_CONFIGS: APIConfig = {
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

export function getConfig(api: API_TYPE = 'etherscan'): AppConfig {
    const config = API_CONFIGS[api];
    if (!config) {
        throw new Error(`No configuration found for api ${api}`);
    }
    return config;
}
