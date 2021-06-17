// @ts-ignore
import createIpid from 'did-ipid';
import IPFS from 'ipfs-core';
import crypto from 'libp2p-crypto';
import KeyEncoder from 'key-encoder';
import { createFromPrivKey } from 'peer-id';

function privateKeyToPem (key: Buffer) {
  const keyEncoder = new KeyEncoder('secp256k1')
  const pemPrivateKey = keyEncoder
    .encodePrivate(key.toString('hex'), 'raw', 'pem')
    .replace(/EC PRIVATE/g, 'PRIVATE');
  console.log('private key converted to pem', pemPrivateKey);
  return pemPrivateKey;
}

async function generateIpidDID (privateKey: Buffer, publicKey: Buffer) {
  const cryptoPrivateKey = new crypto.keys.supportedKeys.secp256k1.Secp256k1PrivateKey(privateKey, publicKey);
  const peerIdFromPrivateKey = await createFromPrivKey(cryptoPrivateKey.bytes);
  // console.log(peerIdFromPrivateKey);
  const ipfs = await IPFS.create({ init: { privateKey: peerIdFromPrivateKey, algorithm: 'secp256k1' }, silent: false });
  const ipid = await createIpid(ipfs);

  // This is not working. Basically it always and only expects an RSA private key and this trick of passing
  // the crypto key solves the first step: generating the DID, but fails on the second one, which is importing the keys
  // I have tried to initiate ipfs with the private key, that does not work. If I pass the pem private key
  // as second parameter it still fails as not RSA...
  // all in all to work this far, this needs a modified fork of ipid locally
  const didDocument = await ipid.create(cryptoPrivateKey.bytes, peerIdFromPrivateKey,  (document) => {
    const publicKeyRegistration = document.addPublicKey({
      type: 'secp256k1VerificationKey2018',
      publicKeyHex: publicKey,
    });

    const authentication = document.addAuthentication(publicKeyRegistration.id);

  });
  console.log(didDocument);
}

export default generateIpidDID;
