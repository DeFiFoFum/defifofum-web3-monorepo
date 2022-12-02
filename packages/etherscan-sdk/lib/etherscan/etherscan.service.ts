import axios from 'axios';
import { parseABI, ParsedABI } from '../utils/abi'
import { utils } from 'ethers';
const { formatUnits } = utils;

export interface FullContractDetails {
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;
    parsedAbi: ParsedABI | undefined;
}

export interface AccountBalance {
    account: string;
    balance: string;
    decimalBalance: string;
}

export interface BaseConfig {
    startBlock?: number | string;
    endBlock?: number | string;
    sort?: 'asc' | 'dsc';
    page?: number;
    offset?: number;
}

/**
 *
 * ERC20 Transfers
 *
 */
export interface AccountTokenTransferConfig extends BaseConfig {
    action?: 'tokentx' | 'tokennfttx';

}

export interface AccountTokenTransfer {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    value: string;
    tokenID: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    input: string;
    confirmations: string;
}

/**
 *
 * Account Transactions
 *
 */
export interface AccountTXConfig extends BaseConfig {
    // TODO: txlistinternal has a different return shape
    action?: 'txlist' | 'txlistinternal';
}

export interface AccountTX {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
}

/**
 * 
 * Logs
 * 
 */
 export interface LogsConfig extends BaseConfig {
    // Currently only one action type
    // action?: 'getLogs';
}

type AND_OR = 'and' | 'or';

export interface FilterParameters {
    topic0?: string;
    topic1?: string;
    topic2?: string;
    topic3?: string;
    topic0_1_opr?: AND_OR;
    topic1_2_opr?: AND_OR;
    topic2_3_opr?: AND_OR;
    topic0_2_opr?: AND_OR;
    topic0_3_opr?: AND_OR;
    topic1_3_opr?: AND_OR;
}

export default class EtherscanService {
    baseUrl: string;
    apiKey: string;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    /**
     *
     * Get verified contract ABI
     * 
     * @param address contract address
     * @returns ABI of contract
     */
    async getContractABI(
        address: string,
    ): Promise<ParsedABI | undefined> {
        try {
            const response = await axios.get(`${this.baseUrl}`, {
                params: {
                    module: 'contract',
                    action: 'getabi',
                    address: address.toString(), // Turn array into comma separated string
                    apikey: this.apiKey,
                },
            });

            const abiObject = JSON.parse(response.data.result);
            return parseABI(abiObject);
        } catch (error) {
            console.error(error);
            throw new Error(error as any);
        }
    }

    /**
     *
     * Get full contract details based on a contract address. View the contract name, source code, abi and other 
     *  useful details. Provides a parsedAbi in the return value which separates out abi entities for different uses.
     * 
     * @param address contract address
     * @returns Source code object
     */
    async getFullContractDetails(
        address: string,
    ): Promise<FullContractDetails> {
        try {
            const response = await axios.get(`${this.baseUrl}`, {
                params: {
                    module: 'contract',
                    action: 'getsourcecode',
                    address: address.toString(), // Turn array into comma separated string
                    apikey: this.apiKey,
                },
            });
            // TODO: Can pull multiple source codes
            const contractSourceCode = response.data.result[0] as FullContractDetails;
            return { ...contractSourceCode, parsedAbi: parseABI(contractSourceCode.ABI) };
        } catch (error) {
            console.error(error);
            throw new Error(error as any);
        }
    }


    async getBalance(
        address: string | string[],
        block: number | string = 'latest',
    ): Promise<AccountBalance[]> {
        try {
            const response = await axios.get(`${this.baseUrl}`, {
                params: {
                    module: 'account',
                    action: 'balancemulti',
                    address: address.toString(), // Turn array into comma separated string
                    tag: block,
                    apikey: this.apiKey,
                },
            });

            const result = [];

            for (const balance of response.data.result) {
                const currentBalance: string = formatUnits(balance.balance);
                result.push({ ...balance, decimalBalance: currentBalance });
            }

            console.dir(result);
            return result as AccountBalance[];
        } catch (error) {
            console.error(error);
            throw new Error(error as any);
        }
    }

    /**
     * Pass config.action: 'txlist' or 'txlistinternal' for standard/internal txs
     * respectively.
     *
     * @param address
     * @returns Array of tx objects
     */
    async getAccountTxs(
        address: string,
        {
            startBlock = '0',
            endBlock = 'latest',
            action = 'txlist',
            sort = 'asc',
            page,
            offset,
        }: AccountTXConfig,
    ): Promise<AccountTX[]> {
        try {
            const response = await axios.get(`${this.baseUrl}`, {
                params: {
                    module: 'account',
                    action,
                    address: address.toString(), // Turn array into comma separated string
                    startBlock,
                    endBlock,
                    sort,
                    ...(page && { page }),
                    ...(offset && { offset }),
                    apikey: this.apiKey,
                },
            });

            return response.data.result as AccountTX[];
        } catch (error) {
            console.error(error);
            throw new Error(error as any);
        }
    }

    /**
     * Pass config.action: 'txlist' or 'txlistinternal' for standard/internal txs
     * respectively.
     *
     * @param address
     * @returns Array of tx objects
     */
    async getAccountTokenTransfers(
        address: string,
        {
            startBlock = '0',
            endBlock = 'latest',
            action = 'tokentx',
            sort = 'asc',
            page,
            offset,
        }: AccountTokenTransferConfig,
    ): Promise<AccountTokenTransfer[]> {
        try {
            const response = await axios.get(`${this.baseUrl}`, {
                params: {
                    module: 'account',
                    action,
                    address: address.toString(), // Turn array into comma separated string
                    startBlock,
                    endBlock,
                    sort,
                    ...(page && { page }),
                    ...(offset && { offset }),
                    apikey: this.apiKey,
                },
            });

            return response.data.result as AccountTokenTransfer[];
        } catch (error) {
            console.error(error);
            throw new Error(error as any);
        }
    }


    /**
     * Obtain event logs from a contract. 
     * 
     * --> From and to block are required
     * 
     * Topic filter docs: https://docs.bscscan.com/api-endpoints/logs
     * 
     * @param address
     * @param topicQuery Pass a single topic to search for, or pass Filter Params
     * @param LogsConfig 
     * @returns Array of log objects
     */
    async getLogs(
        address: string,
        topicQuery: string | FilterParameters,
        {
            startBlock = '0',
            endBlock = 'latest',
            sort = 'asc',
            page,
            offset,
        }: LogsConfig,
    ): Promise<AccountTokenTransfer[]> {
        try {
            let topics: FilterParameters;
            if(typeof topicQuery == 'string') {
                topics = { topic0: topicQuery };
            } else {
                topics = topicQuery
            }

            const response = await axios.get(`${this.baseUrl}`, {
                params: {
                    module: 'logs',
                    action: 'getLogs',
                    address: address.toString(), // Turn array into comma separated string
                    ...topics,
                    startBlock,
                    endBlock,
                    sort,
                    ...(page && { page }),
                    ...(offset && { offset }),
                    apikey: this.apiKey,
                },
            });

            return response.data.result as AccountTokenTransfer[];
        } catch (error) {
            console.error(error);
            throw new Error(error as any);
        }
    }

}