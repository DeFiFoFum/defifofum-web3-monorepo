import { multicallDynamicAbiIndexedCalls, AbiCall } from "@defifofum/multicall";
import { utils, BigNumber } from "ethers";
const formatEther = utils.formatEther;
import ERC20RewardApeV1Build from "../lib/ABIs/ERC20RewardApeV1.json";

const RPC_PROVIDER = "https://mainnet.telos.net/evm";
const MULTICALL_ADDRESS = "0xa1a283f10f578201a97a8f69d8c15828b778f04b";

const contractAddresses = [
  "0xA3c3A929Ae19Bfc56E2A9B0f23e99bae8Bf6F11A", // ETH-TLOS JF
  "0xffd6a576dCa8742D7afED1538ad6EF8b0022dDbb", // USDT-TLOS JF
  "0xE874E1EF5622aeb65b2394105E5051d265D3cFe6", // USDC-TLOS JF
  "0x96de2679e2d34cfC7cA3245D2d1e55f7dCdF88Bc", // BTC-TLOS JF
  "0x5B7d49806709Fa0B3CdA23232cc2D609bCA2B2d0", // BANANA-TLOS JF
];

const readFunctions = [
  "owner",
  "STAKE_TOKEN",
  "REWARD_TOKEN",
  "rewardPerSecond",
  "startTime",
  "bonusEndTime",
  "getUnharvestedRewards",
  "getStakeTokenFeeBalance",
] as const;

function getBlockExplorerUrl(address: string) {
  return `https://www.teloscan.io/address/${address}#contract`;
}

type ReadFunctionType = { [K in typeof readFunctions[number]]: string };
function calculatedDataArray(poolDataArray: ReadFunctionType[]) {
  return poolDataArray.map((poolData, index) => {
    return calculatePoolData(poolData);
  });
}

function calculatePoolData(poolData: ReadFunctionType) {
  const calculatedData = JSON.parse(JSON.stringify(poolData));
  const totalTime = Number(poolData.bonusEndTime) - Number(poolData.startTime);
  const totalRewards = BigNumber.from(poolData.rewardPerSecond).mul(
    BigNumber.from(totalTime)
  );
  calculatedData.totalTime = totalTime;
  calculatedData.totalRewards = formatEther(totalRewards);

  return calculatedData;
}

async function script() {
  const lpTokenDataMulticall: AbiCall[][] = [];
  for await (const contractAddress of contractAddresses) {
    const internalCalls: AbiCall[] = [];
    for await (const readFunction of readFunctions) {
      internalCalls.push({
        address: contractAddress, // Address of the contract to call
        abi: ERC20RewardApeV1Build.abi,
        functionName: readFunction, // Name of the contract function to call
        params: [], // Provide an array of args which map to arg0, arg1, argN
      });
    }
    lpTokenDataMulticall.push(internalCalls);
  }

  if (lpTokenDataMulticall.length == 0) {
    return [];
  }

  const returnLpTokenData = await multicallDynamicAbiIndexedCalls(
    RPC_PROVIDER, // RPC url. ChainId is inferred from this to point to the proper contract
    lpTokenDataMulticall, // Call[]
    {
      maxCallsPerTx: 1000, // This param defaults to 1000. It sets the max batch limit per multicall call
      customMulticallAddress: MULTICALL_ADDRESS,
    }
  );

  // Pull addresses out of return data
  const cleanedLpTokenDataArray = returnLpTokenData.map(
    (indexedDataArray, index) => {
      const returnData: any = {
        contractAddress: contractAddresses[index],
        explorerUrl: getBlockExplorerUrl(contractAddresses[index]),
      };
      readFunctions.map((readFunction, index) => {
        returnData[readFunction] = indexedDataArray[index][0].toString();
      });

      return returnData;
    }
  );

  // FIXME: log
  const calculatedData = calculatedDataArray(cleanedLpTokenDataArray);
  console.dir({ calculatedData });
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
