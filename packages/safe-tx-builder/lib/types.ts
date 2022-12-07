export const ADDRESS_O = "0x0000000000000000000000000000000000000000";

export interface ContractMethod {
  name: string;
  payable: boolean;
  inputs: {
    name: string;
    internalType: string;
    type: "uint256" | "bool" | "address";
  }[];
}

export interface Tx {
  to: string;
  value: string;
  data: string;
  contractMethod: ContractMethod;
  contractInputsValues: { [key: string]: string };
}

export interface TxBuilder {
  version: string;
  chainId: string | number;
  createdAt: number;
  meta: {
    name: string;
    description: string;
    txBuilderVersion: string;
    createdFromSafeAddress: string;
    createdFromOwnerAddress: string;
    checksum: string; // TODO: How to obtain this?
  };
  transactions: Tx[];
}
