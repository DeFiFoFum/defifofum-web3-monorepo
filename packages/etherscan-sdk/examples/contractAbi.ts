import EtherscanService from '../lib/etherscan/etherscan.service';
import { getConfig } from '../lib/config';

const { baseUrl: BASE_URL, apiKey: API_KEY } = getConfig('bsc');

(async function () {
  const etherscanService = new EtherscanService(BASE_URL, API_KEY);
  const fullContractDetails = await etherscanService.getFullContractDetails('0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9'); // MasterApe

  for (const eventName of fullContractDetails.parsedAbi.eventList) {
      console.dir(fullContractDetails.parsedAbi.getEventByName(eventName))
  }
  
  await Promise.resolve(console.log('🎉'));
  process.exit(0);
})();
