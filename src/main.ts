import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID ,getTokenMetadata} from '@solana/spl-token';

// 创建与Solana网络的连接
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
// 指定要查询余额的账户地址
const accountAddress = 'oK3iLEfh2rqrK9HxARoqmxGRhZyW7yDJsgmUjdmWhyj';
// 将字符串地址转换为PublicKey
const publicKey = new PublicKey(accountAddress);
// 异步函数来获取并打印账户余额
const getBalance = async () => {
    try {
        const balance = await connection.getBalance(publicKey);
        console.log(`账户余额: ${balance / Math.pow(10, 9)} SOL`);
    } catch (error) {
        console.error(error);
    }
};

const getAllTokenBalances = async () => {
    try {
        // 获取账户的所有代币账户信息
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });
        for (const { account } of tokenAccounts.value) {
            const tokenBalance = account.data.parsed.info.tokenAmount.uiAmountString;
            const tokenMint = account.data.parsed.info.mint;
            console.log(`代币Mint地址: ${tokenMint}, 余额: ${tokenBalance}`);
            console.log(await getTokenInfo(tokenMint))
        }
    } catch (error) {
        console.error('Error fetching token balances:', error);
    }
};

const getTokenInfo = async (mintAddress: string) => {
    // 尝试获取代币的元数据（名称和符号）
    try {
        const token = await getTokenMetadata(
            connection,
            new PublicKey(mintAddress),
            undefined,
            TOKEN_PROGRAM_ID
        );
        return token;
    } catch (error) {
        console.log('Error fetching token info:', error);
    }
}

// 调用函数
getBalance();
//getTokenBalance();
getAllTokenBalances()
