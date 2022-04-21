import { postWallchainRequest, WallchainRequest } from '../lib/wallchain-sdk';
import LiquidityHelper from '../private/LiquidityHelper';
import ApeRouterHelper from '../private/ApeRouterHelper';
import { BigNumber } from 'ethers';
import { decodeWallchainData } from '../lib/utils/wallchainDecoder';

function getUnixOffset(delay: number) {
    return String(Math.floor(Date.now() / 1000) + delay);
}

/**
 * BSC Config
    const APESWAP_ROUTER = '0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7';
    const BSC_LIQUIDITY_HELPER = '0x578606C96A54b6CAA0c13aa253F52cCBdaA5b741';
    const BSC_RPC_URL = 'https://bscrpc.com'
    const BANANA_BNB_PAIR_ADDRESS = '0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713';
    const TOKEN_A = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'; // WBNB
    const TOKEN_B = '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95'; // BANANA
 * 
 */

async function script() {
    // FIXME: Add to config per chain
    // NOTE: Polygon Router
    const APESWAP_ROUTER = '0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607';
    const POLYGON_LIQUIDITY_HELPER = '0x2F07969090a2E9247C761747EA2358E5bB033460';
    const POLYGON_RPC_URL = 'https://polygon-rpc.com/'
    const BANANA_BNB_PAIR_ADDRESS = '0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713';
    const TOKEN_A = '0x5d47baba0d66083c52009271faf3f50dcc01023c'; // Polygon BANANA
    const TOKEN_B = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'; // MATIC


    const liquidityHelper = new LiquidityHelper(POLYGON_LIQUIDITY_HELPER, POLYGON_RPC_URL);
    const apeRouterHelper = new ApeRouterHelper(APESWAP_ROUTER, POLYGON_RPC_URL);

    // const tokenBalances = await liquidityHelper.getPairBalancesFromPairAddress(BANANA_BNB_PAIR_ADDRESS)
    const tokenBalances = await liquidityHelper.getPairBalancesFromTokenAddresses(TOKEN_A, TOKEN_B);
    
    // NOTE: Log
    console.dir({
        totalLpSupply: tokenBalances.totalLpSupply.toString(),
        token0: tokenBalances.token0,
        token0Balance: tokenBalances.token0Balance.toString(),
        token1: tokenBalances.token1,
        token1Balance: tokenBalances.token1Balance.toString(),
    });

    const AMOUNT_OUT = '1000000' + "0".repeat(18);
    const swapAmountIn = await apeRouterHelper.getAmountIn(AMOUNT_OUT, tokenBalances.token1Balance.toString(),tokenBalances.token0Balance.toString());
    const SLIPPAGE_SETTING = BigNumber.from(120)
    const SLIPPAGE_FACTOR = BigNumber.from(100)
    const adjustedSwapAmountIn = (swapAmountIn.mul(SLIPPAGE_SETTING)).div(SLIPPAGE_FACTOR);
    const PATH = [tokenBalances.token0, tokenBalances.token1];
    
    // NOTE: Log
    console.dir({
        ethAmountOut: AMOUNT_OUT.toString(),
        swapAmountIn: swapAmountIn.toString(),
        adjustedSwapAmountIn: adjustedSwapAmountIn.toString(),
        path: PATH
    })
    
    const TO_ADDRESS = '0x876688C3dF57953259D69de76B9F209bB3645e12' // ApeSwap Deployer
    const encodeData = await apeRouterHelper.encodeSwapTokensForExactETH(AMOUNT_OUT, adjustedSwapAmountIn, PATH, TO_ADDRESS, getUnixOffset(30 * 60))
    
    // NOTE: Log
    console.log({encodeData})

    const wallchainRequest: WallchainRequest = {
        value: AMOUNT_OUT,
        sender: TO_ADDRESS,
        destination: APESWAP_ROUTER,
        data: encodeData.data || '0x',
    }

    const wallchainReturn = await postWallchainRequest(wallchainRequest);
    // TODO: Currently just logging the output
    decodeWallchainData('swapTokensForExactETH', wallchainReturn.transactionArgs.data)

    console.dir({wallchainReturn}, { depth: null });
}

(async function () {
    try {
        await script();
        console.log('🎉');
        process.exit(0);
    }
    catch (e) {
        console.error('Error running script.')
        console.dir(e);
        process.exit(1);
    }
}());

