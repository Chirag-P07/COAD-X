import { readFileSync } from 'fs';
import { processZipArchive } from './src/utils/zipReconstructionEngine.js';
import { processE01Image } from './src/utils/e01ReconstructionEngine.js';

// Polyfill calculateSHA256 crypto for node just to let it pass
global.window = {
  crypto: {
    subtle: {
      digest: async () => new Uint8Array(32)
    }
  }
};

async function test() {
  const buf = readFileSync('c:\\Users\\user\\OneDrive\\Desktop\\nps-2009-canon2-gen1 (2).zip');
  const zipResult = await processZipArchive(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  const e01File = zipResult.files[0];
  console.log("E01 Size:", e01File.buffer.length);
  
  try {
    const ebuf = e01File.buffer;
    const res = await processE01Image(ebuf.buffer.slice(ebuf.byteOffset, ebuf.byteOffset + ebuf.byteLength));
    console.log("SUCCESS:", res.filesRecovered, "files recovered!");
    console.log("JPEGs:", res.jpegFiles);
  } catch (e) {
    console.error("FAILED E01:", e);
  }
}

test().catch(console.error);
