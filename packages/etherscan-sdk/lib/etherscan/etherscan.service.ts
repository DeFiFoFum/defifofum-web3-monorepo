import axios from 'axios';
import { parseABI, ParsedABI } from '../utils/abi'
import { utils } from 'ethers';
const { formatUnits } = utils;

interface FullContractDetails {
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
    parsedAbi: ParsedABI;
}

interface AccountBalance {
    account: string;
    balance: string;
    decimalBalance: string;
}

/**
 *
 * ERC20 Transfers
 *
 */
interface AccountTokenTransferConfig {
    startBlock?: number | string;
    endBlock?: number | string;
    action?: 'tokentx' | 'tokennfttx';
    sort?: 'asc' | 'dsc';
    page?: number;
    offset?: number;
}

interface AccountTokenTransfer {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
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
interface AccountTXConfig {
    startBlock?: number | string;
    endBlock?: number | string;
    // TODO: txlistinternal has a different return shape
    action?: 'txlist' | 'txlistinternal';
    sort?: 'asc' | 'dsc';
    page?: number;
    offset?: number;
}

interface AccountTX {
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
    ): Promise<ParsedABI> {
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

}