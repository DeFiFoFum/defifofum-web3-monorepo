import { ethers } from '../lib/ola-lending-cli'
import OlaLenCaptainABI from '../lib/ABIs/OlaLenCaptain.json'
const IOlaCaptain = new ethers.utils.Interface(OlaLenCaptainABI);

// TODO: Building off of these tools, we could take an ABI and full TX data (including function selector) to decode all the data :thinking:

/**
 * Steps to decode data from a Timelock
 * 1. Find the function signature of the function (i.e. `transfer(address,uint256)`)
 * 2. Find the function selector (i.e. `0x32c05291`)
 * 3. Add the signature in front of the data provided in the timelock below.
 * 4. Decode the data.
 * 5. Print it out to verify. :cheers:
 */


/**
 * Provide a function name and Interface to pull out the entire function signature
 * 
 * @param functionName Any part of the function signature to search for (i.e. 'transfer')
 * @param ethersInterface 
 * @returns 
 */
function getFunctionSignatureFromInterface(functionName: string, ethersInterface: ethers.utils.Interface) {
    const foundFunctions = [];
    for (const currentFunction in ethersInterface.functions) {
        if(currentFunction.includes(functionName)) {
            foundFunctions.push({
                functionSignature: currentFunction,
                functionFragment: ethersInterface.functions[currentFunction],
            });
        }
    }

    if(foundFunctions.length == 1) {
        return foundFunctions[0]
    } else {
        throw new Error(`Function Signature for function: ${functionName} not found.`)
    }
}

/**
 * Take a Solidity function signature and encode the function selector.
 * 
 * Here is also an EVM sig/selector database: https://sig.eth.samczsun.com/
 * 
 * @param functionSignature Example: `transfer(address,uint256)`
 * @returns 
 */
function encodeFunctionSelector(functionSignature: string) {
    const selectorLength = '0x11223344'.length; // function selectors are the first 4 bytes of a hex value
    return (ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature)).slice(0, selectorLength));
}

function cleanHex(hexString: string) {
    return hexString.startsWith('0x') ? hexString.slice(2) : hexString;
}


/**
 * Decode encoded tx data
 * 
 * @param functionName Name (or part of) of Solidity function
 * @param functionData Encoded data being passed into the function (wihtout selector)
 * @param ethersInterface Ethers interface built from an ABI
 */
async function decodeFunctionData(functionName: string, functionData: string, ethersInterface: ethers.utils.Interface) {
    // Pull out fill function signature from Interface
    const { functionSignature, functionFragment } = getFunctionSignatureFromInterface(functionName, ethersInterface);
    const functionSelector = encodeFunctionSelector(functionSignature);
    // NOTE: Log
    console.dir({functionSignature, functionSelector, functionFragment})
    // Prepend the functionSelector to the data being passed to the function to be able to decode it
    return ethersInterface.decodeFunctionData(functionSignature, functionSelector + cleanHex(functionData))
}

(async function () {
    try {
        const data = '0000000000000000000000001bdd3cf7f79cfb8edbb955f20ad99211551ba2755ca9f42656dfd02129f65cd9afd34fc7404b3390ec2bdead0a2249b512b6c67e000000000000000000000000000000000000000000000000000000000000010000000000000000000000000017b43552c58cc6423f9c2527fc1dd60adb94fd7e00000000000000000000000000000000000000000000000002c68af0bb14000000000000000000000000000000000000000000000000000006f05b59d3b200000000000000000000000000000000000000000000000000000853a0d2313c00000000000000000000000000000000000000000000000000000f8b0a10e47000000000000000000000000000000000000000000000000000000000000000000000'
        const decodedData = await decodeFunctionData('_supportMarket', data, IOlaCaptain);

        // Log results
        for (const key in decodedData) {
            const element = decodedData[key];
            
            if(element._isBigNumber) {
                console.log(`${key} ${element.toString()}`)
            // } else if (key == 'contractNameHash') {
                // TODO: Not working :shrug:
                // console.log(`${key} ${ethers.utils.parseBytes32String(element.toString())}`)
            } else {
                console.log(`${key} ${element}`)
            }
        }


        console.log('🎉');
        process.exit(0);
    }
    catch (e) {
        console.error('Error running script.')
        console.dir(e);
        process.exit(1);
    }
}());