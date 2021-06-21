const bip32 = require('bip32');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const web3 = require('web3');
const secp256k1 = require('secp256k1');
import generateIpidDID from './generateIpidDID';
import generateIonDID from './generateIonDID';

enum Network {
  bitcoin = 'bitcoin',
  testnet = 'testnet',
  regtest = 'regtest',
  ropsten = 'ropsten',
  ethereum = 'ethereum'
}

function getPath (network: Network): string {
  // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  const chainCode = {
    'bitcoin': 0,
    'testnet': 1,
    'regtest': 1,
    'ropsten': 1,
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

function generateFromBip32 (network: Network): IKeyPair {
  const mnemonic = bip39.generateMnemonic();
  // TODO: allow for external param to be passed
  // const mnemonic = 'prevent level element robot buyer area quick harbor input estate wrong unfair';
  console.log('mnenomic phrase generated:');
  console.log(mnemonic);
  let bitcoinNetwork = null; // default network of bip32 is Bitcoin mainnet

  if (network === 'testnet') {
    // https://github.com/bitcoinjs/bip32/pull/7/files
    bitcoinNetwork = {
      wif: 0xef,
      bip32: {
        public: 0x043587cf,
        private: 0x04358394
      }
    }
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  console.log(seed.toString('hex'));
  const node = bip32.fromSeed(seed, bitcoinNetwork);
  const path = getPath(network);
  const derived = node.derivePath(path);
  const { privateKey, publicKey } = derived;
  console.log('private key bip32 generated', privateKey.toString('hex'), secp256k1.privateKeyVerify(privateKey));
  console.log('public key bip32 generated', publicKey.toString('hex'));
  console.log('WIF', derived.toWIF());

  return {
    privateKey,
    publicKey
  };
}

function generateKeyPair (network: Network = Network.testnet): IKeyPair {
  const { privateKey, publicKey } = generateFromBip32(network);
  return {
    privateKey,
    publicKey
  };
}

function getBTCAddress (publicKey: Buffer, network: string): string {
  const supportedNetworks = Object.keys(bitcoin.networks);
  if (!supportedNetworks.includes(network)) {
    console.error('unsupported bitcoin network, cannot generate address');
    return null;
  }
  return bitcoin.payments.p2pkh({ pubkey: publicKey, network: bitcoin.networks[network] }).address;
}

function getEthereumAddress (publicKey: Buffer): string {
  const publicKeyString = publicKey.toString('hex');
  // could also use https://web3js.readthedocs.io/en/v1.3.4/web3-eth-accounts.html#privatekeytoaccount - but no public key
  const keccakString = web3.utils.sha3(publicKeyString);
  const address = `0x${keccakString.substr(keccakString.length - 40)}`
  if (web3.utils.isAddress(address)) {
    return address;
  }
  console.error('Error creating ETH address.');
  return null;
}

function getNetwork (): Network {
  const args = process.argv;
  const networkProperty = '--network';
  const passedArgument = args.find(arg => arg.includes(networkProperty)).split('=')[1];
  return passedArgument as Network || Network.testnet;
}

const network = getNetwork();
console.log('target network is', network);
const { publicKey, privateKey } = generateKeyPair(network);
const bitcoinAddress = getBTCAddress(publicKey, network);
console.log('bitcoin address generated', bitcoinAddress);
const ethereumAddress = getEthereumAddress(privateKey);
console.log('ethereum address generated', ethereumAddress);

// DID
// generateIpidDID(privateKey, publicKey);
generateIonDID(privateKey, publicKey);
