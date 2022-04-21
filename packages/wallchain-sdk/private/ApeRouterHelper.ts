import { BigNumberish } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Contract, PopulatedTransaction } from '@ethersproject/contracts';
import ApeRouterABI from './ABI/ApeRouter.json';
import { ApeRouter } from './ABI/types/ApeRouter';


export default class ApeRouterHelper {
    apeRouterContract: ApeRouter;
    provider: JsonRpcProvider;

    constructor(address: string, rpcUrl: string) {
        this.provider = new JsonRpcProvider(rpcUrl);

        this.apeRouterContract = new Contract(
            address,
            ApeRouterABI,
            this.provider,
        ) as ApeRouter;
    }

    async getAmountOut(amountIn: BigNumberish, reserveIn: BigNumberish, reserveOut: BigNumberish) {
        return await this.apeRouterContract.getAmountOut(
            amountIn,
            reserveIn,
            reserveOut
        )
    }

    async getAmountIn(amountOut: BigNumberish, reserveIn: BigNumberish, reserveOut: BigNumberish) {
        return await this.apeRouterContract.getAmountOut(
            amountOut,
            reserveIn,
            reserveOut
        )
    }

    async encodeSwapETHForExactTokens(amountOut: BigNumberish, path: string[], toAddress: string, deadline: BigNumberish) {
        return await this.apeRouterContract.populateTransaction.swapETHForExactTokens(
            amountOut,
            path,
            toAddress,
            deadline
        )
    }

    async encodeSwapExactETHForTokens(amountOutMin: BigNumberish, path: string[], toAddress: string, deadline: BigNumberish) {
        return await this.apeRouterContract.populateTransaction.swapExactETHForTokens(
            amountOutMin,
            path,
            toAddress,
            deadline
        )
    }

    async encodeSwapExactTokensForETH(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], toAddress: string, deadline: BigNumberish) {
        return await this.apeRouterContract.populateTransaction.swapExactTokensForETH(
            amountIn,
            amountOutMin,
            path,
            toAddress,
            deadline
        )
    }

    async encodeSwapTokensForExactETH(amountOut: BigNumberish, amountInMax: BigNumberish, path: string[], toAddress: string, deadline: BigNumberish) {
        return await this.apeRouterContract.populateTransaction.swapTokensForExactETH(
            amountOut,
            amountInMax,
            path,
            toAddress,
            deadline
        )
    }

    async encodeSwapExactTokensForTokens(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], toAddress: string, deadline: BigNumberish) {
        return await this.apeRouterContract.populateTransaction.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            toAddress,
            deadline
        )
    }

    async encodeSwapTokensForExactTokens(amountOut: BigNumberish, amountInMax: BigNumberish, path: string[], toAddress: string, deadline: BigNumberish) {
        return await this.apeRouterContract.populateTransaction.swapTokensForExactTokens(
            amountOut,
            amountInMax,
            path,
            toAddress,
            deadline
        )
    }
}
