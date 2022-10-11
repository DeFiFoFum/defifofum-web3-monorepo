import EtherscanService from "../lib/etherscan/etherscan.service";
import { getConfig } from "../lib/config";

const { baseUrl: BASE_URL, apiKey: API_KEY } = getConfig("bsc");

(async function () {
  const etherscanService = new EtherscanService(BASE_URL, API_KEY);

  const fullContractDetails = await etherscanService.getFullContractDetails(
    "0xdcE92E5a2209198f945Cb37d3D6696bdED3c1a2A" // OlaLinearPoolFactory
  );
  console.dir({ fullContractDetails });
  await Promise.resolve(console.log("🎉"));
  process.exit(0);
})();
