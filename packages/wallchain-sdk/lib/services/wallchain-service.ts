import axios from "axios";

/**
 * Helper function to allow strict typings on key value look ups
 * 
 * @param obj Object used to look up value from
 * @returns (key) => obj[key] Pass in the key to the returned function for lookup
 */
 const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) => obj[key];


function getWallchainAPIUrl() {
    // FIXME: Put API Key in config
    const API_KEY = `5cf2b177-5fa5-477a-8cea-f2b54859af2a`;
    const url = `https://matic.wallchain.xyz/upgrade_txn/?key=${API_KEY}`;
    return url;
}

// value: "1000000000000000000000",
// sender: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
// destination: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
// data: "0x7ff36ab5000000000000000000000000000000000000000000000065fff429ce525844fe00000000000000000000000000000000000000000000000000000000000000800000000000000000000000003d73afbb4b3de6870898ecde8d13b2d198e2f8e200000000000000000000000000000000000000000000000000000000c3810f2d00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000f239e69ce434c7fb408b05a0da416b14917d934e"
export interface WallchainRequest {
    value: string;
    sender: string;
    destination: string;
    data: string;
}

export interface WallchainResponse extends WallchainRequest {
    txUpdated: boolean;
}

export async function postWallchainRequest(wallchainRequest: WallchainRequest): Promise<WallchainResponse> {
    try {
        const res = await axios.post(getWallchainAPIUrl(), {
            value: wallchainRequest.value,
            sender: wallchainRequest.sender,
            destination: wallchainRequest.destination,
            data: wallchainRequest.data,
        })

        const returnData = res.data as WallchainRequest;
        try {
            let txUpdated = false;
            for (const key in returnData) {
                const currentValue = getKeyValue(returnData)(key as keyof WallchainRequest);
                const providedValue = getKeyValue(wallchainRequest)(key as keyof WallchainRequest);
                if(currentValue != providedValue) {
                    txUpdated = true;
                }
            }
            return { ...returnData, txUpdated };
        } catch (e) {
            console.error(e);
            throw new Error(`postWallchainRequest`);
        }
    } catch (e) {
        console.error(e);
        throw new Error(`postWallchainRequest`);
    }
}