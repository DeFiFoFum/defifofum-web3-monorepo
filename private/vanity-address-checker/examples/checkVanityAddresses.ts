import { getContractAddress, getAddressFromPrivateKey } from '../lib/vanity-address-checker'

const vanityContractAddresses = [
    '0xdD2e1Bccc723D63DaAAC6Fb7A5136b978b4fD76e',
    '0x4eCFF89D65aE1b3aad39B868b77C6599c8FA1095',
    '0x0610C59f610B9aa64e957b13630f14Ec6E239662',
    '0x551696E6FD36b3F2567C72001FafDc471CD13576',
]

for (const vanityContractAddress of vanityContractAddresses) {
    // Only want to test the initial nonce
    const nonce = 0;
    console.log(getContractAddress(vanityContractAddress, nonce))
}

const PK = ''

function logAddressAndContractFromPK(pk: string) {
    const address = getAddressFromPrivateKey(pk);
    const initialContract = getContractAddress(address);
    console.log(`Address generated from PK is ${address}. Initial contract is ${initialContract}`)
}
logAddressAndContractFromPK(PK);