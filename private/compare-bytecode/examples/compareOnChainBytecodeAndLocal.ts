import { compareBytecode, getBytecode } from "../lib";
import { writeJSONToFile } from "../../../packages/files/lib/files";
import { inputBytecode } from "./bytecodeInput";

interface ContractConfig {
  rpcUrl: string;
  contractAddress: string;
}

const bytecodeConfig: [ContractConfig] = [
  {
    rpcUrl: "https://rpc.linea.build",
    contractAddress: "0x286200Bb331d736aC141115Cb7970c60A9bCEc23",
  },
  // {
  //   rpcUrl: "https://mainnet.telos.net/evm",
  //   contractAddress: "0x178C075a1d413f8637B3C6623c9501167D457bf3",
  // },
];

async function script() {
  const byteCodeA = inputBytecode;

  const byteCodeB = await getBytecode(
    bytecodeConfig[0].rpcUrl,
    bytecodeConfig[0].contractAddress
  );

  const success = compareBytecode(byteCodeA, byteCodeB);
  if (!success) {
    const output = {
      byteCodeA,
      byteCodeB,
    };
    const filePath = __dirname + "/output/bytecode-compare";
    const fileUrl = await writeJSONToFile(filePath, output);
    console.log(
      `Bytecode does not match. Please find retrieved bytecode written to this file: ${fileUrl}`
    );
  }
}

(async function () {
  try {
    await script();
    console.log("🎉");
    process.exit(0);
  } catch (e) {
    console.error("Error running script.");
    console.dir(e);
    process.exit(1);
  }
})();
