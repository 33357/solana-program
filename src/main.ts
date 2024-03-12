import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Umi, PublicKey as _PublicKey } from "@metaplex-foundation/umi";
import {
  Metadata,
  fetchDigitalAsset,
} from "@metaplex-foundation/mpl-token-metadata";

class Relation {
  umi: Umi;
  connection: Connection;

  constructor(url: string) {
    this.umi = createUmi(url);
    this.connection = new Connection(url);
  }

  // 获取账户余额
  async getBalance(accountAddress: string) {
    const publicKey = new PublicKey(accountAddress);
    const balance = await this.connection.getBalance(publicKey);
    return (balance / Math.pow(10, 9)).toString();
  }

  // 获取账户的所有代币账户信息
  async getAllTokenData(accountAddress: string) {
    try {
      const publicKey = new PublicKey(accountAddress);
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );
      const dataList: {
        balance: string;
        metaData: Metadata | null;
      }[] = [];
      const balance = await this.getBalance(accountAddress);
      dataList.push({
        balance,
        metaData: null,
      });
      for (const { account } of tokenAccounts.value) {
        const balance = account.data.parsed.info.tokenAmount.uiAmountString;
        const mintAddress = account.data.parsed.info.mint;
        const data = {
          balance,
          metaData: await this.getTokenMetaData(mintAddress),
        };
        dataList.push(data);
      }
      return dataList;
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  }

  // 尝试获取代币的元数据
  async getTokenMetaData(mintAddress: string) {
    const asset = await fetchDigitalAsset(
      this.umi,
      new PublicKey(mintAddress) as unknown as _PublicKey
    );
    return asset.metadata;
  }
}

async function main() {
  const relation = new Relation("https://api.devnet.solana.com");
  console.log(
    await relation.getAllTokenData(
      "A4pPdjPaDMTK8dbSN5eyPzUWuCpJmAZkDirm87gVSqHf"
    )
  );
}

main();
