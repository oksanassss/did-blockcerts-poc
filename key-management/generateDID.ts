import createIpid from 'did-ipid';
import IPFS from 'ipfs-core';
import toPem from './utils/toPem';

async function generateDID (privateKey: Buffer, publicKey: Buffer) {
  const ipfs = await IPFS.create();
  const ipid = await createIpid(ipfs);

  const pem = toPem(privateKey);

  const didDocument = await ipid.create(pem, (document) => {
    const publicKeyRegistration = document.addPublicKey({
      type: 'RsaVerificationKey2018',
      publicKeyHex: publicKey,
    });

    const authentication = document.addAuthentication(publicKeyRegistration.id);

  });
  console.log(didDocument);
}

export default generateDID;
