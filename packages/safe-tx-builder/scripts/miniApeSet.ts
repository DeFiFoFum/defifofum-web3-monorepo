
import { miniApeV2Builders } from "../lib/safe-tx-builder"
import { readJSONFile, writeJSONToFile } from "@defifofum/files/dist/files"

const MINI_APE_ADDRESS = '0x54aff400858Dcac39797a81894D9920f16972D1D';

async function script() {
    const file = await readJSONFile(__dirname + "/input.json")
    console.dir({file})
    const txBuilder = miniApeV2Builders.generateTxs_MiniApe_Set(
        MINI_APE_ADDRESS,
        file as any,
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