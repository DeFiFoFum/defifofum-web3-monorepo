import EtherscanService from '../lib/etherscan/etherscan.service';
import { getConfig } from '../lib/config';

const { baseUrl: BASE_URL, apiKey: API_KEY } = getConfig('bsc');


(async function () {
  const etherscanService = new EtherscanService(BASE_URL, API_KEY);
  const transfers = await etherscanService.getAccountTokenTransfers('0x9b0407abf861e94C95Cf183ba2D58CD382A3d0bE', {
    // action: 'tokennfttsx',
  })
  console.dir(transfers);
  console.dir({numTransfers: transfers.length});
  await Promise.resolve(console.log('🎉'));
  process.exit(0);
})();
