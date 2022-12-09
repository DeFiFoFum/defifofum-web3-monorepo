
// import { miniApeV2Builders } from "@defifofum/safe-tx-builder"
import { miniApeV2Builders } from "../lib/safe-tx-builder"
import { writeJSONToFile } from "@defifofum/files"

// NOTE: Import proper adjustments
import Adjustments from './input.json'
const MINI_APE_ADDRESS = '0x54aff400858Dcac39797a81894D9920f16972D1D';

async function script() {
    const mappedAdjustments = Adjustments.map(currentAdjustment => { return { 
        pid: String(currentAdjustment.pid),
        allocPoint: String(currentAdjustment.allocation)
    } })
    
    console.dir({mappedAdjustments})

    const txBuilder = miniApeV2Builders.generateTxs_MiniApe_Set(
        MINI_APE_ADDRESS,
        mappedAdjustments,
    )

    await writeJSONToFile(__dirname + "/SetTxBuilder.json", txBuilder, true)
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