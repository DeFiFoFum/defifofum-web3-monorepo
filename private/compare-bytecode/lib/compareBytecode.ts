interface MisMatch {
    startIndex: number;
    lastIndex: number;
    mismatchString: string;
  }
  
  function createMismatcher() {
    let mismatches: MisMatch[] = [];
    function addMismatch(char: string, index: number): MisMatch[] {
      if (mismatches.length > 0) {
        let lastMismatch = mismatches[mismatches.length - 1];
        if (index - lastMismatch.lastIndex == 1) {
          mismatches[mismatches.length - 1] = {
            startIndex: lastMismatch.startIndex,
            lastIndex: index,
            mismatchString: lastMismatch.mismatchString + char,
          };
          return mismatches;
        }
      }
      // If this is the first mismatch or if the index does not come directly after then this will create a new mismatch element
      mismatches.push({
        startIndex: index,
        lastIndex: index,
        mismatchString: char,
      });
  
      return mismatches;
    }
    return addMismatch;
  }
  
  export function compareBytecode(bytecodeA: string, bytecodeB: string): boolean {
    const addMismatch = createMismatcher();
    const bytecodeALength = bytecodeA.length;
    const bytecodeBLength = bytecodeB.length;
    const lengthMatch = bytecodeBLength - bytecodeALength;
  
    if (lengthMatch === 0) {
      console.log("Bytecode is the same length.");
      let matches = 0;
      let mismatches: MisMatch[] = [];
      for (let index = 0; index < bytecodeBLength; index++) {
        if (bytecodeA[index] === bytecodeB[index]) {
          matches++;
        } else {
          mismatches = addMismatch(bytecodeB[index], index);
        }
      }
      console.dir({
        bytecodeLength: bytecodeALength,
        matches,
        mismatches,
        percentMatch: `${(matches / bytecodeALength) * 100}%`,
      });
      if(mismatches.length) {
        // Mismatches found
        return false;
      } else {
        // Bytecode is the same
        return true;
      }
    } else {
      console.log(`bytecodeB is ${lengthMatch} chars longer than bytecodeA`);
      return false;
    }
  }
  