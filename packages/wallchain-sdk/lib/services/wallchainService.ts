import "dotenv/config";
import axios from "axios";
import { CHAIN_IDS, getWallchainAPIUrl } from "../config";

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
  };
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
  };
}

export async function postWallchainRequest(
  chainId: CHAIN_IDS,
  wallchainRequest: WallchainRequest
): Promise<WallchainResponse> {
  try {
    const res = await axios.post(getWallchainAPIUrl(chainId), {
      value: wallchainRequest.value,
      sender: wallchainRequest.sender,
      destination: wallchainRequest.destination,
      data: wallchainRequest.data,
    });

    return res.data as WallchainResponse;
  } catch (e) {
    console.error(e);
    throw new Error(`postWallchainRequest`);
  }
}
