import { EtherscanService, getConfig } from '../lib/etherscan-sdk'


(async function () {
    try {
        const { baseUrl, apiKey } = getConfig('bsc');
        const etherscanService = new EtherscanService(baseUrl, apiKey);

        const transfers = await etherscanService.getAccountTokenTransfers('0x94bfE225859347f2B2dd7EB8CBF35B84b4e8Df69', {})

        const tokenSet = new Set();
        
        // console.dir({transfers})
        
        for (let index = 0; index < transfers.length; index++) {
            const transferObject = transfers[index];
            tokenSet.add(transferObject.contractAddress);
        }

        console.dir(tokenSet)
        // TODO: dynamic code
        // const messages = ['DeFi Apes', 'We love $BANANA', 'But also love to burn $BANANA'];
        // const messageBoardAddress = addressList[56].MESSAGE_BOARD;
        // const timelockAddress = addressList[56].OZ_TIMELOCK_ALPHA;
        // const encodeReturn = await encodeBatchTimelockMessageTx(messages, { messageBoardAddress, timelockAddress });
        // console.dir(encodeReturn);
        process.exit(0); // Exit Success
    } catch (e) {
        throw new Error(e);
    }
}());