import 'dotenv/config';
import axios from "axios";

function getWallchainAPIUrl() {
    const API_KEY = process.env.API_KEY;
    // FIXME: Allow for multinetwork looks ups
    const url = `https://matic.wallchain.xyz/upgrade_txn/?key=${API_KEY}`;
    return url;
}

export interface WallchainRequest {
    value: string;
    sender: string;
    destination: string;
    data: string;
}

export interface WallchainResponse {
    pathFound: boolean;
    summary: {
        searchSummary: {
            expectedProfit: number;
            firstTokenAddress: string;
            firstTokenAmount: number;
        };
    },
    transactionArgs: {
        data: string;
        destination: string;
        gas: string;
        gasPrice: string;
        maxFeePerGas: string;
        maxPriorityFeePerGas: string;
        nonce: string;
        sender: string;
        value: string;
    }
}

export async function postWallchainRequest(wallchainRequest: WallchainRequest): Promise<WallchainResponse> {
    try {
        const res = await axios.post(getWallchainAPIUrl(), {
            value: wallchainRequest.value,
            sender: wallchainRequest.sender,
            destination: wallchainRequest.destination,
            data: wallchainRequest.data,
        })

        return res.data as WallchainResponse;
    } catch (e) {
        console.error(e);
        throw new Error(`postWallchainRequest`);
    }
}