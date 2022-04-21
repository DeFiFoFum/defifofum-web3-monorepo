import { ethers } from 'ethers';
import RouterManagerABI from '../ABI/RouterManager.json'
import { RouterManagerInterface } from '../ABI/types/RouterManager'


export function decodeWallchainData(method: string, data: string) {
    const routerManagerInterface = (new ethers.utils.Interface(RouterManagerABI)) as RouterManagerInterface;

    console.dir({method})
    // const routerManagerInterface = (new ethers.utils.Interface(['function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)'])) as RouterManagerInterface;
    const methodNames = [
        'swapExactTokensForTokens',
        'swapTokensForExactTokens',
        'swapExactETHForTokens',
        'swapTokensForExactETH',
        'swapExactTokensForETH',
        'swapETHForExactTokens',
    ]
    
    let decodedData;
    let methodUsed;
    for (const methodName of methodNames) {
        try {
            decodedData = routerManagerInterface.decodeFunctionData(methodName, data)
            methodUsed = methodName
            break;
        } catch (e) {

        }
    }

    // FIXME: log
    console.dir({methodUsed, decodedData});

    // TODO: Not sure if we can decode data from a contract?
    // const routerManager = new Contract('0x0000000000000000000000000000000000000000', RouterManagerABI) as RouterManager;
}