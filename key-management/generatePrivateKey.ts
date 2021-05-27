const bip32 = require('bip32');
const bip39 = require('bip39');

// https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const chainCode = {
  'btc': 0,
  'testnet': 1,
  'eth': 60
}

function getPath (): string {
  // https://ethereum.stackexchange.com/a/70029
  return `m/44'/${chainCode.testnet}'/0/0/0`;
}

function generatePrivateKey (): Buffer {
  const mnemonic = bip39.generateMnemonic();
  console.log('mnenomic phrase generated:');
  console.log(mnemonic);

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const node = bip32.fromSeed(seed);
  const path = getPath();
  const privateKey = node.derivePath(path).privateKey;
  console.log('private key generated', privateKey.toString('hex'));
  return privateKey;
}

generatePrivateKey();
