import { ethers } from 'ethers';

export function getAddressFromPrivateKey(privateKey: string): string {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.address;
}

export function getContractAddress(from: string, nonce = 0): string {
    return ethers.utils.getContractAddress({from, nonce});
}