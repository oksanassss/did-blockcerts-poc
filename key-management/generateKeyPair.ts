const bip32 = require('bip32');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

function getPath (network: string): string {
  // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  const chainCode = {
    'bitcoin': 0,
    'testnet': 1,
    'regtest': 1,
    'ethereum': 60
  };
  let chain = chainCode[network];

  if (chain == null) {
    chain = chainCode.testnet;
    console.warn(`network is not listed, defaulting to testnet ${chain}`);
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

function getBTCAddress (publicKey: Buffer, network: string) {
  const supportedNetworks = Object.keys(bitcoin.networks);
  if (!supportedNetworks.includes(network)) {
    console.error('unsupported bitcoin network, cannot generate address');
    return null;
  }
  return bitcoin.payments.p2pkh({ pubkey: publicKey, network: bitcoin.networks[network] }).address;
}

function getNetwork (): string {
  const args = process.argv;
  const networkProperty = '--network';
  const passedArgument = args.find(arg => arg.includes(networkProperty)).split('=')[1];
  return passedArgument || 'testnet';
}

const network = getNetwork();
console.log('target network is', network);
const { publicKey } = generateKeyPair(network);
const bitcoinAddress = getBTCAddress(publicKey, network);
console.log('bitcoin address generated', bitcoinAddress);
