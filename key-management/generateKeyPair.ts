import * as buffer from "buffer";

const bip32 = require('bip32');
const bip39 = require('bip39');

// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const chainCode = {
  'btc': 0,
  'testnet': 1,
  'eth': 60
}

function getPath (network: string): string {
  let chain = chainCode[network];

  if (!chain) {
    console.warn('network is not listed, defaulting to testnet');
    chain = chain.testnet;
  }
  // https://ethereum.stackexchange.com/a/70029
  // https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
  return `m/44'/${chain}'/0/0/0`;
}

interface IKeyPair {
  privateKey: Buffer;
  publicKey: Buffer;
}

function generateKeyPair (network = 'testnet'): IKeyPair {
  console.log('target network is', network);
  const mnemonic = bip39.generateMnemonic();
  console.log('mnenomic phrase generated:');
  console.log(mnemonic);

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const node = bip32.fromSeed(seed);
  const path = getPath(network);
  const derived = node.derivePath(path);
  const { privateKey, publicKey } = derived;
  console.log('private key generated', privateKey.toString('hex'));
  console.log('public key generated', publicKey.toString('hex'));
  return {
    privateKey,
    publicKey
  };
}

generateKeyPair();
