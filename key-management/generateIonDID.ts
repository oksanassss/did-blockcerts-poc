import { keyUtils } from '@transmute/did-key-secp256k1';
import ION from '@decentralized-identity/ion-tools';


function jwkFrom (key: Buffer, isPrivate: boolean = false): any /* @trust/keyto */ {
  const keyToHexString = key.toString('hex');
  if (isPrivate) {
    return keyUtils.privateKeyJwkFromPrivateKeyHex(keyToHexString);
  }

  return keyUtils.publicKeyJwkFromPublicKeyHex(keyToHexString);
}

function generateIonDID (privateKey: Buffer, publicKey: Buffer) {
  const publicKeyJWK = jwkFrom(publicKey);
  const privateKeyJWK = jwkFrom(privateKey, true);
  console.log('JWK key pair generated', privateKeyJWK, publicKeyJWK);
}

export default generateIonDID;
