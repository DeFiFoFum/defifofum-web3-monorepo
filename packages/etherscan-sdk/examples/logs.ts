// import { EtherscanService, Log } from "@defifofum/etherscan-sdk";
import { EtherscanService, Log } from "../lib/etherscan";
import { getConfig } from "../lib/config";

const { baseUrl: BASE_URL, apiKey: API_KEY } = getConfig("bsc");

(async function () {
  const etherscanService = new EtherscanService(BASE_URL, API_KEY);
  const DEPOSIT_TOPIC = '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c'
  const logs: Log[] = await etherscanService.getLogs(
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
    DEPOSIT_TOPIC,
    {
      // Only the first 1000 Logs are returned. It may be needed to batch requests 
      // page,
      // offset,
      // startBlock,
      // endBlock,
    });
  console.dir(logs);
  console.dir({ numLogs: logs.length });
  await Promise.resolve(console.log("🎉"));
  process.exit(0);
})();
