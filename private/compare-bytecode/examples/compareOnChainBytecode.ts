import { compareBytecode, getBytecode } from "../lib";
import { writeJSONToFile } from "../../../packages/files/lib/files"

interface ContractConfig {
  rpcUrl: string;
  contractAddress: string;
}

const bytecodeConfig: [ContractConfig, ContractConfig] = [
  {
    rpcUrl: "https://bscrpc.com",
    contractAddress: "0x5471F99bCB8F682f4Fd2b463Fd3609DadD56A929",
  },
  {
    rpcUrl: "https://mainnet.telos.net/evm",
    contractAddress: "0x178C075a1d413f8637B3C6623c9501167D457bf3",
  },
];

async function script() {
  const byteCodeA = await getBytecode(
    bytecodeConfig[0].rpcUrl,
    bytecodeConfig[0].contractAddress
  );
  const byteCodeB = await getBytecode(
    bytecodeConfig[1].rpcUrl,
    bytecodeConfig[1].contractAddress
  );

  const success = compareBytecode(byteCodeA, byteCodeB);
  if(!success) {
    const output = {
        byteCodeA,
        byteCodeB,
    }
    const filePath = __dirname + '/output/bytecode-compare'
    const fileUrl = await writeJSONToFile(filePath, output);
    console.log(`Bytecode does not match. Please find retrieved bytecode written to this file: ${fileUrl}`)
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
