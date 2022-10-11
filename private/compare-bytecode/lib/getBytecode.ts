const Web3 = require('Web3');

export const getBytecode = async (rpcUrl: string, contractAddress: string) => {
    const web3 = new Web3(rpcUrl);
    const bytecode = await web3.eth.getCode(contractAddress);
    return bytecode;
};