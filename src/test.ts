import Metadata from "@metaplex-foundation/mpl-token-metadata";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID,getTokenMetadata } from '@solana/spl-token';

const connection = new Connection("https://api.mainnet-beta.solana.com");

(async () => {
  let mintPubkey = new PublicKey("LFG1ezantSY2LPX8jRz2qa31pPEhpwN9msFDzZw4T9Q");
  const Info = await new Token(
    connection,
    mintPubkey,
    TOKEN_PROGRAM_ID,
    
  );
  let res = await Metadata.getAccountMetasAndSigners([mintPubkey],'programId',TOKEN_PROGRAM_ID)
  console.log(res);
})();