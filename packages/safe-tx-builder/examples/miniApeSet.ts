
// import { miniApeV2Builders } from "@defifofum/safe-tx-builder"
import { miniApeV2Builders } from "../lib/safe-tx-builder"

const MINI_APE_ADDRESS = '0x54aff400858Dcac39797a81894D9920f16972D1D';

async function script() {
    const txBuilder = miniApeV2Builders.generateTxs_MiniApe_Set(
        MINI_APE_ADDRESS,
        [
            {
                pid: '0',
                allocPoint: '0',
            }
        ]
    )

    console.log(JSON.stringify(txBuilder));
}

(async function () {
    try {
        await script();
        console.log('🎉');
        process.exit(0);
    }
    catch (e) {
        console.error('Error running script.')
        console.dir(e);
        process.exit(1);
    }
}());