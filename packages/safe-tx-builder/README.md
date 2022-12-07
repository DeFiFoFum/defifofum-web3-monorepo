# Safe Tx Builder
Use this package to create batch transactions on https://app.safe.global/ 

## Example Usage
The output of this can be imported into Safe's TX builder

```typescript
import { miniApeV2Builders } from "@defifofum/safe-tx-builder"
import { MINI_APE_ADDRESS } from "./constants"

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
```