import { createWalletClient, createPublicClient, http, parseUnits, keccak256, toHex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { arbitrumSepolia } from 'viem/chains';
import { USDC_ADDRESS, USDC_DECIMALS, ERC20_ABI, ARBISCAN_TX } from '../lib/usdc';

const RECIBO_ADDRESS = '0x563249FfE1783050D95A2dc70fE549909b4D09a8' as `0x${string}`;

const USDC_ABI = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const;

const RECIBO_ABI = [
  {
    inputs: [
      { name: 'invoiceId', type: 'bytes32' },
      { name: 'freelancer', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'payInvoice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

async function main() {
  // Payer (client) wallet that has 39.5 USDC
  const payerPk = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  // Freelancer wallet
  const freelancer = '0x59ffc8907beaA275F29B466BCB1D9BbfeaDAd165';
  
  const rpc = 'https://sepolia-rollup.arbitrum.io/rpc';
  const payerAccount = privateKeyToAccount(payerPk);
  
  const wallet = createWalletClient({ account: payerAccount, chain: arbitrumSepolia, transport: http(rpc) });
  const pub = createPublicClient({ chain: arbitrumSepolia, transport: http(rpc) });

  console.log(`\n🇲🇽  Recibo On-Chain Proofs Generator`);
  console.log(`    Payer (Client):     ${payerAccount.address}`);
  console.log(`    Freelancer (MX):    ${freelancer}`);
  console.log(`    Recibo Contract:    ${RECIBO_ADDRESS}\n`);

  // 1. Approve USDC spend
  const amount = parseUnits('1', USDC_DECIMALS);
  console.log('1. Approving USDC spend...');
  const approveTx = await wallet.writeContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: 'approve',
    args: [RECIBO_ADDRESS, amount]
  });
  console.log(`✓ Approve Tx Sent: ${approveTx}`);
  await pub.waitForTransactionReceipt({ hash: approveTx });
  console.log(`  Confirmed: ${ARBISCAN_TX}${approveTx}\n`);

  // Generate unique invoice ID
  const invoiceId = keccak256(toHex(`RCB-PROOF-${Date.now()}`));
  console.log(`Generated Invoice ID: ${invoiceId}`);

  // 2. Pay Invoice (First time)
  console.log('2. Paying invoice...');
  const payTx1 = await wallet.writeContract({
    address: RECIBO_ADDRESS,
    abi: RECIBO_ABI,
    functionName: 'payInvoice',
    args: [invoiceId, freelancer, amount]
  });
  console.log(`✓ Pay Invoice 1 Tx Sent: ${payTx1}`);
  await pub.waitForTransactionReceipt({ hash: payTx1 });
  console.log(`  Confirmed: ${ARBISCAN_TX}${payTx1}\n`);

  // 3. Pay Invoice (Second time - Reverts)
  console.log('3. Re-paying same invoice (reverts on-chain)...');
  const payTx2 = await wallet.writeContract({
    address: RECIBO_ADDRESS,
    abi: RECIBO_ABI,
    functionName: 'payInvoice',
    args: [invoiceId, freelancer, amount],
    gas: 100000n // Bypass gas estimation failure
  });
  console.log(`✓ Pay Invoice 2 (Reverted) Tx Sent: ${payTx2}`);
  console.log(`  Link: ${ARBISCAN_TX}${payTx2}\n`);

  console.log('── HASHES TO SAVE ──────────────────────────────────');
  console.log(`APPROVE_TX_HASH=${approveTx}`);
  console.log(`PAY_TX_HASH_1=${payTx1}`);
  console.log(`PAY_TX_HASH_2_REVERTS_ALREADY_PAID=${payTx2}`);
}

main().catch(console.error);
