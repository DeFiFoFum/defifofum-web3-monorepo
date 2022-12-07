import { buildFullTx, buildSingleTx } from "./index"
import { ContractMethod, Tx, TxBuilder, ADDRESS_O } from "../types";

const MiniApe_Set_ContractMethod: ContractMethod = {
    name: "set",
    payable: false,
    inputs: [
        {
            internalType: "uint256",
            name: "_pid",
            type: "uint256",
        },
        {
            internalType: "uint256",
            name: "_allocPoint",
            type: "uint256",
        },
        {
            internalType: "contract IRewarder",
            name: "_rewarder",
            type: "address",
        },
        {
            internalType: "bool",
            name: "overwrite",
            type: "bool",
        },
    ],
};

export function generateTxs_MiniApe_Set(
    miniApeAddress: string,
    setDetails: {
        pid: string
        allocPoint: string
        rewarder?: string
    }[],
    options?: {
        name?: string
        chainId?: string | number
        version?: string
        description?: string
    }
): TxBuilder {
    const txs = [];
    for (const setDetail of setDetails) {
        const currentTx = buildSingleTx(
            miniApeAddress,
            MiniApe_Set_ContractMethod,
            {
                _pid: String(setDetail.pid),
                _allocPoint: String(setDetail.allocPoint),
                _rewarder: setDetail.rewarder || ADDRESS_O,
                overwrite: setDetail.rewarder ? String(true) : String(false)
            }
        )
        txs.push(currentTx)
    }

    return buildFullTx(
        options?.name || 'MiniApeV2 - Set',
        options?.chainId || '137',
        txs,
        {
            version: options?.version || '0.1',
            description: options?.description || 'Adjust allocations on MiniApeV2.'
        }
    )
}
