import { keyUtils } from '@transmute/did-key-secp256k1';
import ION from '@decentralized-identity/ion-tools';
import {ionApiServer, ionChallengeEndpoint} from "../config/ion";

function jwkFrom (key: Buffer, isPrivate: boolean = false): any /* @trust/keyto */ {
  // TODO: should we keep the `kid` property?
  const keyToHexString = key.toString('hex');
  if (isPrivate) {
    return keyUtils.privateKeyJwkFromPrivateKeyHex(keyToHexString);
  }

  return keyUtils.publicKeyJwkFromPublicKeyHex(keyToHexString);
}

async function generateIonDID (privateKey: Buffer, publicKey: Buffer) {
  const publicKeyJwk = jwkFrom(publicKey);
  const privateKeyJwk = jwkFrom(privateKey, true);
  const did = new ION.DID({
    content: {
      publicKeys: [
        {
          id: 'key-1',
          type: 'EcdsaSecp256k1VerificationKey2019',
          publicKeyJwk,
          purposes: [ 'authentication' ]
        }
      ]
    }
  });
  const didUri = await did.getURI();
  console.log('ION DID generated', didUri);
  const requestBody = await did.generateRequest(0);
  const request = new ION.AnchorRequest(requestBody, {
    // challengeEndpoint: `${ionApiServer}/proof-of-work-challenge`,
    challengeEndpoint: ionChallengeEndpoint, // Not available locally?
    solutionEndpoint: `${ionApiServer}/operations`
  });
  let response = await request.submit();
  const didUriShort = await did.getURI('short');
  console.log(didUriShort);
}

export default generateIonDID;
