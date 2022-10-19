# Etherscan SDK

Typescript enabled SDK for pulling data from Etherscan like services.   

## Supported Configurations
This SDK can take any API endpoint and API_KEY to pull data from Etherscan like services.  

This package is pre-configured with API endpoints for: 
- Etherscan
- BscScan
- Polygonscan


## Installation
```
npm i @defifofum/etherscan-sdk

yarn add @defifofum/etherscan-sdk
```


## Configuration
To pass in API KEY details, make a copy of `.env.example` and name it to `.env`. Add in API keys as needed.

## Usage
```js
EtherscanService {
    getContractABI: (...args) => Promise<ParsedABI>;
    getFullContractDetails: (...args) => Promise<FullContractDetails>; 
    getBalance: (...args) => Promise<AccountBalance[]>;
    getAccountTxs: (...args) => Promise<AccountTX[]>;
    getAccountTokenTransfers: (...args) => Promise<AccountTokenTransfer[]>;
}
```


Here is an example of pulling a contract ABI from BscScan based on a contract address. This ABI can then be used to create an `ethers` contract to interact with it through web3. 

```js
import { EtherscanService, getConfig } from '@defifofum/etherscan-sdk';
import { Contract } from '@ethersproject/contracts'

// Get details from Etherscan service
const etherscanService = new EtherscanService(BASE_URL, API_KEY);
const fullContractDetails = await etherscanService.getFullContractDetails(ADDRESS);
const contractInstance = new Contract(ADDRESS, fullContractDetails.ABI);
// Encode every function on the ABI with random values
const encodedTxs = {};
for (const functionName of fullContractDetails.parsedAbi.functionList) {
    const functionDetails = fullContractDetails.parsedAbi.getFunctionByName(functionName);
    let inputs: Array<number | string | boolean> = [];
    for (const input of functionDetails.inputs) {
        const inputType = input.type;
        if(inputType.includes('uint')) {
            inputs.push(1)
        } else if(inputType == 'address') {
            inputs.push('0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9')
        } else if(inputType == 'bool') {
            inputs.push(true)
        } else {
            throw new Error(`Input type ${inputType} not recognized.`)
        }
        
    }
    encodedTxs[functionName] = await contractInstance.populateTransaction[functionName](...inputs);
}

console.dir({encodedTxs});
```

## Types
The `ParsedABI` type is meant to separate details of the ABI into useful properties for displaying on a UI and interacting with a random ABI.  

```js
interface ParsedABI {
    ABI: ContractABI;
    constructor: ConstructorABIDeclaration | undefined;
    fallback: FallbackABIDeclaration | undefined;
    receive: ReceiveABIDeclaration | undefined;
    functionList: string[];
    functions: FunctionABIDeclaration[];
    getFunctionByName: (name: string) => FunctionABIDeclaration;
    eventList: string[];
    events: EventABIDeclaration[];
    getEventByName: (name: string) => EventABIDeclaration;
    canReceive: boolean;
}
```

The `FullContractDetails` type adds in the `ParsedABI` type along with the Etherscan return for contract source code.

```js
interface FullContractDetails {
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    OptimizationUsed: string;
    Runs: string;
    ConstructorArguments: string;
    EVMVersion: string;
    Library: string;
    LicenseType: string;
    Proxy: string;
    Implementation: string;
    SwarmSource: string;
    parsedAbi: ParsedABI;
}
```