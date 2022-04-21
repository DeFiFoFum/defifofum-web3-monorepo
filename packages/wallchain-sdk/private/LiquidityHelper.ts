import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, PopulatedTransaction } from "@ethersproject/contracts";
import LiquidityHelperABI from './ABI/LiquidityHelper.json'
import { LiquidityHelper } from "./ABI/types/LiquidityHelper";



export default class LiquidityPairHelper {
    liquidityHelperContract: LiquidityHelper;
    provider: JsonRpcProvider;

    constructor(address: string, rpcUrl: string) {
        this.provider = new JsonRpcProvider(rpcUrl);

        this.liquidityHelperContract = new Contract(
            address,
            LiquidityHelperABI,
            this.provider,
        ) as LiquidityHelper;
    }

    async getPairBalancesFromPairAddress(
        pairAddress: string,
    ) {
        return await this.liquidityHelperContract['getPairBalances(address)'](pairAddress);
    }

    async getPairBalancesFromTokenAddresses(
        token0: string,
        token1: string,
    ) {
        return await this.liquidityHelperContract['getPairBalances(address,address)'](token0, token1);
    }
}