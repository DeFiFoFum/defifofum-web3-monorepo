import "dotenv/config";
import { postWallchainRequest, WallchainRequest } from "../lib/wallchain-sdk";
import LiquidityHelper from "../private/LiquidityHelper";
import ApeRouterHelper from "../private/ApeRouterHelper";
import { BigNumber } from "ethers";
import { decodeWallchainData } from "../lib/utils/wallchainDecoder";
import { CHAIN_IDS } from "../lib/config";

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
  // NOTE: BSC Router
  const APESWAP_ROUTER = "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7";
  const LIQUIDITY_HELPER = "0x9b04DD397058d5f030A1ACd8119A7e0037B187f9";
  const CHAIN_ID: CHAIN_IDS = 56;
  const RPC_URL = process.env.RPC_URL_BSC || 'https://bscrpc.com/';

  const BANANA_BNB_PAIR_ADDRESS = "0xF65C1C0478eFDe3c19b49EcBE7ACc57BB6B1D713"; // BSC
  const TOKEN_A = "0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95"; // BSC BANANA
  const TOKEN_B = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // BNB

  const liquidityHelper = new LiquidityHelper(LIQUIDITY_HELPER, RPC_URL);
  const apeRouterHelper = new ApeRouterHelper(APESWAP_ROUTER, RPC_URL);

  const tokenBalances = await liquidityHelper.getPairBalancesFromPairAddress(BANANA_BNB_PAIR_ADDRESS)
  // const tokenBalances = await liquidityHelper.getPairBalancesFromTokenAddresses(
  //   TOKEN_A,
  //   TOKEN_B
  // );

  // NOTE: Log
  console.dir({
    totalLpSupply: tokenBalances.totalLpSupply.toString(),
    token0: tokenBalances.token0,
    token0Balance: tokenBalances.token0Balance.toString(),
    token1: tokenBalances.token1,
    token1Balance: tokenBalances.token1Balance.toString(),
  });

  const AMOUNT_OUT = "1000000" + "0".repeat(18);
  const swapAmountIn = await apeRouterHelper.getAmountIn(
    AMOUNT_OUT,
    tokenBalances.token1Balance.toString(),
    tokenBalances.token0Balance.toString()
  );
  const SLIPPAGE_SETTING = BigNumber.from(120);
  const SLIPPAGE_FACTOR = BigNumber.from(100);
  const adjustedSwapAmountIn = swapAmountIn
    .mul(SLIPPAGE_SETTING)
    .div(SLIPPAGE_FACTOR);
  const PATH = [tokenBalances.token0, tokenBalances.token1];

  // NOTE: Log
  console.dir({
    ethAmountOut: AMOUNT_OUT.toString(),
    swapAmountIn: swapAmountIn.toString(),
    adjustedSwapAmountIn: adjustedSwapAmountIn.toString(),
    path: PATH,
  });

  const TO_ADDRESS = "0x876688C3dF57953259D69de76B9F209bB3645e12"; // ApeSwap Deployer
  const encodeData = await apeRouterHelper.encodeSwapTokensForExactETH(
    AMOUNT_OUT,
    adjustedSwapAmountIn,
    PATH,
    TO_ADDRESS,
    getUnixOffset(30 * 60)
  );

  // NOTE: Log
  console.log({ encodeData });

  const wallchainRequest: WallchainRequest = {
    value: AMOUNT_OUT,
    sender: TO_ADDRESS,
    destination: APESWAP_ROUTER,
    data: encodeData.data || "0x",
  };

  const wallchainReturn = await postWallchainRequest(
    CHAIN_ID,
    wallchainRequest
  );
  // TODO: Currently just logging the output
  decodeWallchainData(
    "swapTokensForExactETH",
    wallchainReturn.transactionArgs.data
  );

  console.dir({ wallchainReturn }, { depth: null });
}

(async function () {
  try {
    await script();
    console.log("🎉");
    process.exit(0);
  } catch (e) {
    console.error("Error running script.");
    console.dir(e);
    process.exit(1);
  }
})();
