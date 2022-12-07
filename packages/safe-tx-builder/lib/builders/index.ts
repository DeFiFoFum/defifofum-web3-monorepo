import { ContractMethod, Tx, TxBuilder } from "../types";
export * as miniApeV2Builders from "./miniApeV2"

export function buildFullTx(
    name: string,
    chainId: string | number,
    transactions: Tx[],
    options?: {
        version?: string;
        description?: string;
    }
    ): TxBuilder {

    return {
        version: options?.version || '0.0.1',
        chainId,
        createdAt: (new Date()).getTime(),
        meta: {
            name,
            description: options?.description || '',
            txBuilderVersion: '1.11.1',
            createdFromSafeAddress: '',
            createdFromOwnerAddress: '',
            checksum: '', // TODO: How to obtain this?
        },
        transactions,
    }
}

export function buildSingleTx(
    toAddress: string,
    contractMethod: ContractMethod,
    contractInputsValues: { [key: string]: string },
    options?: {
        value?: string;
        data?: string;
    }): Tx {
    const inputNames = contractMethod.inputs.map(input => input.name);
    // Check that the input value keys match the input names
    for (const key in contractInputsValues) {
        if(!inputNames.includes(key)) {
            throw new Error(`${buildSingleTx.toString()}: contractMethod input name not found when checking contractInputValues`);
        }
    }

    return {
        to: toAddress,
        value: options?.value || '0',
        data: options?.data || "",
        contractMethod,
        contractInputsValues
    }
}