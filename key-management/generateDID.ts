// @ts-ignore
import createIpid from 'did-ipid';
import IPFS from 'ipfs-core';
import crypto from 'libp2p-crypto';

async function generateDID (privateKey: Buffer, publicKey: Buffer) {
  const cryptoPrivateKey = new crypto.keys.supportedKeys.secp256k1.Secp256k1PrivateKey(privateKey, publicKey);
  const ipfs = await IPFS.create();
  const ipid = await createIpid(ipfs);

  const didDocument = await ipid.create(cryptoPrivateKey.bytes, (document) => {
    const publicKeyRegistration = document.addPublicKey({
      type: 'secp256k1VerificationKey2018',
      publicKeyHex: publicKey,
    });

    const authentication = document.addAuthentication(publicKeyRegistration.id);

  });
  console.log(didDocument);
}

export default generateDID;
